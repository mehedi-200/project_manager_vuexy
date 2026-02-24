import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Feature } from '@/types/index.ts'
import * as featuresApi from '@/api/featuresApi.ts'

export const useFeatureStore = defineStore('featureStore', () => {
  const features = ref<Feature[]>([])
  const currentFeature = ref<Feature | null>(null)
  const loading = ref(false)
  const pagination = ref<any>(null)
  const currentProjectId = ref<number>(0)

  async function fetchFeatures(projectId: number, page = 1, perPage?: number) {
    currentProjectId.value = projectId
    loading.value = true
    try {
      const params: any = { page }
      if (perPage) params.per_page = perPage
      const res = await featuresApi.getFeatures(projectId, params)
      const data = res.data.data
      features.value = Array.isArray(data.features) ? data.features : []
      pagination.value = data.pagination ?? null
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createFeature(projectId: number, data: object) {
    try {
      const res = await featuresApi.createFeature(projectId, data)
      const feature: Feature = res.data.data
      features.value.push(feature)
      return feature
    } catch (e: any) {
      throw e
    }
  }

  async function updateFeature(id: number, data: object) {
    try {
      const res = await featuresApi.updateFeature(currentProjectId.value, id, data)
      const updated: Feature = res.data.data
      const idx = features.value.findIndex(f => f.id === id)
      if (idx !== -1) features.value[idx] = updated
      if (currentFeature.value?.id === id) currentFeature.value = updated
      return updated
    } catch (e: any) {
      throw e
    }
  }

  async function updateStatus(id: number, statusValue: number) {
    const idx = features.value.findIndex(f => f.id === id)
    const oldStatus = idx !== -1 ? { ...features.value[idx]!.status } : null
    if (idx !== -1) {
      const labels: Record<number, string> = { 1: 'Pending', 2: 'In Progress', 3: 'Completed' }
      features.value[idx]!.status = { value: statusValue, label: labels[statusValue] ?? '' }
    }
    try {
      const res = await featuresApi.updateFeature(currentProjectId.value, id, { status: statusValue })
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
      await featuresApi.deleteFeature(currentProjectId.value, id)
    } catch (e: any) {
      features.value = backup
      throw e
    }
  }

  async function reorderFeature(id: number, direction: 'up' | 'down') {
    const sorted = [...features.value].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    const idx = sorted.findIndex(f => f.id === id)
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const curr = sorted[idx]!
    const swap = sorted[swapIdx]!
    const currOrder = curr.order ?? idx + 1
    const swapOrder = swap.order ?? swapIdx + 1
    curr.order = swapOrder
    swap.order = currOrder
    try {
      await Promise.all([
        featuresApi.updateFeature(currentProjectId.value, curr.id, { order: curr.order }),
        featuresApi.updateFeature(currentProjectId.value, swap.id, { order: swap.order }),
      ])
    } catch (e: any) {
      curr.order = currOrder
      swap.order = swapOrder
      throw e
    }
  }

  return { features, currentFeature, loading, pagination, fetchFeatures, createFeature, updateFeature, updateStatus, deleteFeature, reorderFeature }
})
