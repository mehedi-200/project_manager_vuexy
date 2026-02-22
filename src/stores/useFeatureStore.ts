import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Feature } from '@/types/index.ts'
import * as featuresApi from '@/api/featuresApi.ts'

export const useFeatureStore = defineStore('featureStore', () => {
  const features = ref<Feature[]>([])
  const currentFeature = ref<Feature | null>(null)
  const loading = ref(false)

  async function fetchFeatures(projectId: number) {
    loading.value = true
    try {
      const res = await featuresApi.getFeatures(projectId)
      features.value = Array.isArray(res.data.data) ? res.data.data : []
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createFeature(projectId: number, data: Partial<Feature>) {
    try {
      const res = await featuresApi.createFeature(projectId, data)
      const feature: Feature = res.data.data
      features.value.push(feature)
      return feature
    } catch (e: any) {
      throw e
    }
  }

  async function updateFeature(id: number, data: Partial<Feature>) {
    try {
      const res = await featuresApi.updateFeature(id, data)
      const updated: Feature = res.data.data
      const idx = features.value.findIndex(f => f.id === id)
      if (idx !== -1) features.value[idx] = updated
      if (currentFeature.value?.id === id) currentFeature.value = updated
      return updated
    } catch (e: any) {
      throw e
    }
  }

  async function updateStatus(id: number, status: Feature['status']) {
    // optimistic update
    const idx = features.value.findIndex(f => f.id === id)
    const oldStatus = idx !== -1 ? features.value[idx]!.status : null
    if (idx !== -1) features.value[idx]!.status = status
    try {
      const res = await featuresApi.updateFeatureStatus(id, status)
      const updated: Feature = res.data.data
      if (idx !== -1) features.value[idx] = updated
      if (currentFeature.value?.id === id) currentFeature.value = updated
      return updated
    } catch (e: any) {
      if (idx !== -1 && oldStatus) features.value[idx]!.status = oldStatus
      throw e
    }
  }

  async function deleteFeature(id: number) {
    const backup = [...features.value]
    features.value = features.value.filter(f => f.id !== id)
    try {
      await featuresApi.deleteFeature(id)
    } catch (e: any) {
      features.value = backup
      throw e
    }
  }

  async function reorderFeature(id: number, direction: 'up' | 'down') {
    const sorted = [...features.value].sort((a, b) => (a.serial_number ?? 9999) - (b.serial_number ?? 9999))
    const idx = sorted.findIndex(f => f.id === id)
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const curr = sorted[idx]!
    const swap = sorted[swapIdx]!
    const currSerial = curr.serial_number ?? idx + 1
    const swapSerial = swap.serial_number ?? swapIdx + 1
    // optimistic
    curr.serial_number = swapSerial
    swap.serial_number = currSerial
    try {
      await Promise.all([
        featuresApi.updateFeature(curr.id, { serial_number: curr.serial_number }),
        featuresApi.updateFeature(swap.id, { serial_number: swap.serial_number }),
      ])
    } catch (e: any) {
      curr.serial_number = currSerial
      swap.serial_number = swapSerial
      throw e
    }
  }

  return { features, currentFeature, loading, fetchFeatures, createFeature, updateFeature, updateStatus, deleteFeature, reorderFeature }
})
