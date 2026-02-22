import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Phase } from '@/types/index.ts'
import * as phasesApi from '@/api/phasesApi.ts'

export const usePhaseStore = defineStore('phaseStore', () => {
  const phases = ref<Phase[]>([])
  const loading = ref(false)

  async function fetchPhases(projectId: number) {
    loading.value = true
    try {
      const res = await phasesApi.getPhases(projectId)
      phases.value = Array.isArray(res.data.data) ? res.data.data : []
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createPhase(projectId: number, data: Partial<Phase>) {
    try {
      const res = await phasesApi.createPhase(projectId, data)
      const phase: Phase = res.data.data
      phases.value.push(phase)
      phases.value.sort((a, b) => a.order_number - b.order_number)
      return phase
    } catch (e: any) {
      throw e
    }
  }

  async function updatePhase(id: number, data: Partial<Phase>) {
    try {
      const res = await phasesApi.updatePhase(id, data)
      const updated: Phase = res.data.data
      const idx = phases.value.findIndex(p => p.id === id)
      if (idx !== -1) phases.value[idx] = updated
      phases.value.sort((a, b) => a.order_number - b.order_number)
      return updated
    } catch (e: any) {
      throw e
    }
  }

  async function deletePhase(id: number) {
    const backup = [...phases.value]
    phases.value = phases.value.filter(p => p.id !== id)
    try {
      await phasesApi.deletePhase(id)
    } catch (e: any) {
      phases.value = backup
      throw e
    }
  }

  async function reorderPhases(id: number, direction: 'up' | 'down') {
    const sorted = [...phases.value].sort((a, b) => a.order_number - b.order_number)
    const idx = sorted.findIndex(p => p.id === id)
    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1]!
      const curr = sorted[idx]!
      const prevOrder = prev.order_number
      prev.order_number = curr.order_number
      curr.order_number = prevOrder
      await Promise.all([
        phasesApi.updatePhase(prev.id, { order_number: prev.order_number }),
        phasesApi.updatePhase(curr.id, { order_number: curr.order_number }),
      ])
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1]!
      const curr = sorted[idx]!
      const nextOrder = next.order_number
      next.order_number = curr.order_number
      curr.order_number = nextOrder
      await Promise.all([
        phasesApi.updatePhase(next.id, { order_number: next.order_number }),
        phasesApi.updatePhase(curr.id, { order_number: curr.order_number }),
      ])
    }
    phases.value.sort((a, b) => a.order_number - b.order_number)
  }

  return { phases, loading, fetchPhases, createPhase, updatePhase, deletePhase, reorderPhases }
})
