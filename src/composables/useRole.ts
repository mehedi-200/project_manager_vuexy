import { computed } from 'vue'

export function useRole(role: string) {
  const isAdmin = computed(() => role === 'admin')
  const isManager = computed(() => role === 'manager')
  const isDeveloper = computed(() => role === 'developer')
  const isViewer = computed(() => role === 'viewer')

  const canEdit = computed(() => ['admin', 'manager'].includes(role))
  const canDelete = computed(() => role === 'admin')
  const canCreate = computed(() => ['admin', 'manager'].includes(role))

  return { isAdmin, isManager, isDeveloper, isViewer, canEdit, canDelete, canCreate }
}
