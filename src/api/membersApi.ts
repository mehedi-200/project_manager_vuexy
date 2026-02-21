import { api } from '@/api/axious.ts'

export const getMembers = (projectId: number) => api.get(`/projects/${projectId}/members`)

export const inviteMember = (projectId: number, data: { user_id: number; role: string }) =>
  api.post(`/projects/${projectId}/invite`, data)

export const removeMember = (projectId: number, userId: number) =>
  api.delete(`/projects/${projectId}/members/${userId}`)
