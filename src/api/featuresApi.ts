import { api } from '@/api/axious.ts'

export const getFeatures = (projectId: number, params?: { per_page?: number; page?: number }) =>
  api.get(`/projects/${projectId}/features`, { params })

export const createFeature = (projectId: number, data: object) =>
  api.post(`/projects/${projectId}/features/store`, data)

export const showFeature = (projectId: number, id: number) =>
  api.get(`/projects/${projectId}/features/show/${id}`)

export const updateFeature = (projectId: number, id: number, data: object) =>
  api.post(`/projects/${projectId}/features/update/${id}`, data)

export const deleteFeature = (projectId: number, id: number) =>
  api.get(`/projects/${projectId}/features/delete/${id}`)
