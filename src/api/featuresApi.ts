import { api } from '@/api/axious.ts'
import type { Feature } from '@/types/index.ts'

export const getFeatures = (projectId: number) => api.get(`/projects/${projectId}/features`)

export const createFeature = (projectId: number, data: Partial<Feature>) =>
  api.post(`/projects/${projectId}/features`, data)

export const updateFeature = (id: number, data: Partial<Feature>) => api.patch(`/features/${id}`, data)

export const updateFeatureStatus = (id: number, status: Feature['status']) =>
  api.patch(`/features/${id}/status`, { status })

export const deleteFeature = (id: number) => api.delete(`/features/${id}`)
