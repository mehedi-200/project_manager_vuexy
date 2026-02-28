import { api } from '@/api/axious.ts'

export const getChecklistItems = (featureId: number) =>
  api.get(`/features/${featureId}/checklist`)

export const addChecklistItem = (featureId: number, data: { title: string }) =>
  api.post(`/features/${featureId}/checklist`, data)

export const updateChecklistItem = (id: number, data: { title?: string; is_completed?: boolean }) =>
  api.patch(`/checklist/${id}`, data)

export const deleteChecklistItem = (id: number) => api.delete(`/checklist/${id}`)
