import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types/index.ts'
import * as projectsApi from '@/api/projectsApi.ts'

export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const res = await projectsApi.getProjects()
      const data = res.data.data
      projects.value = Array.isArray(data) ? data : (data?.data ?? [])
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
    try {
      const res = await projectsApi.createProject(data)
      const project: Project = res.data.data
      projects.value.unshift(project)
      return project
    } catch (e: any) {
      throw e
    }
  }

  async function updateProject(id: number, data: Partial<Project>) {
    try {
      const res = await projectsApi.updateProject(id, data)
      const updated: Project = res.data.data
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = updated
      if (currentProject.value?.id === id) currentProject.value = updated
      return updated
    } catch (e: any) {
      throw e
    }
  }

  async function deleteProject(id: number) {
    // optimistic
    const backup = [...projects.value]
    projects.value = projects.value.filter(p => p.id !== id)
    try {
      await projectsApi.deleteProject(id)
    } catch (e: any) {
      projects.value = backup
      throw e
    }
  }

  return { projects, currentProject, loading, error, fetchProjects, fetchProject, createProject, updateProject, deleteProject }
})
