import { api } from '@/api/axious.ts'
import type { Project } from '@/types/index.ts'

export const getProjects  = (page = 1, perPage = 15)       => api.get(`/projects`, { params: { page, per_page: perPage } })
export const getProject   = (id: number)                   => api.get(`/projects/show/${id}`)
export const createProject = (data: Partial<Project>)      => api.post(`/projects/store`, data)
export const updateProject = (id: number, data: Partial<Project>) => api.post(`/projects/update/${id}`, data)
export const deleteProject = (id: number)                  => api.post(`/projects/delete/${id}`)
