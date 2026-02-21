import { api } from '@/api/axious.ts'
import type { Phase } from '@/types/index.ts'

export const getPhases = (projectId: number) => api.get(`/projects/${projectId}/phases`)

export const createPhase = (projectId: number, data: Partial<Phase>) =>
  api.post(`/projects/${projectId}/phases`, data)

export const updatePhase = (id: number, data: Partial<Phase>) => api.patch(`/phases/${id}`, data)

export const deletePhase = (id: number) => api.delete(`/phases/${id}`)
