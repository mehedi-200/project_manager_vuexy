import { api } from '@/api/axious.ts'

export const getComments = (featureId: number) =>
  api.get(`/features/${featureId}/comments`)

export const addComment = (featureId: number, data: { comment: string }) =>
  api.post(`/features/${featureId}/comments`, data)

export const deleteComment = (id: number) => api.delete(`/comments/${id}`)
