import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types/index.ts'
import * as projectsApi from '@/api/projectsApi.ts'

export interface Pagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination>({
    total: 0, per_page: 15, current_page: 1, last_page: 1, from: 0, to: 0
  })

  async function fetchProjects(page = 1, perPage?: number) {
    loading.value = true
    error.value = null
    try {
      const res = await projectsApi.getProjects(page, perPage ?? pagination.value.per_page)
      const d = res.data.data
      projects.value = Array.isArray(d?.projects) ? d.projects : []
      if (d?.pagination) pagination.value = d.pagination
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'Failed to load projects'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await projectsApi.getProject(id)
      currentProject.value = res.data.data ?? res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'Failed to load project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: Partial<Project>) {
    const res = await projectsApi.createProject(data)
    return res.data.data as Project
  }

  async function updateProject(id: number, data: Partial<Project>) {
    const res = await projectsApi.updateProject(id, data)
    const updated: Project = res.data.data
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = updated
    if (currentProject.value?.id === id) currentProject.value = updated
    return updated
  }

  async function deleteProject(id: number) {
    await projectsApi.deleteProject(id)
    projects.value = projects.value.filter(p => p.id !== id)
  }

  return { projects, currentProject, loading, error, pagination, fetchProjects, fetchProject, createProject, updateProject, deleteProject }
})
