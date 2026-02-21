import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Member } from '@/types/index.ts'
import * as membersApi from '@/api/membersApi.ts'

export const useMemberStore = defineStore('memberStore', () => {
  const members = ref<Member[]>([])
  const loading = ref(false)

  async function fetchMembers(projectId: number) {
    loading.value = true
    try {
      const res = await membersApi.getMembers(projectId)
      members.value = Array.isArray(res.data.data) ? res.data.data : []
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false
    }
  }

  async function inviteMember(projectId: number, data: { user_id: number; role: string }) {
    try {
      const res = await membersApi.inviteMember(projectId, data)
      const member: Member = res.data.data
      members.value.push(member)
      return member
    } catch (e: any) {
      throw e
    }
  }

  async function removeMember(projectId: number, userId: number) {
    const backup = [...members.value]
    members.value = members.value.filter(m => m.user_id !== userId)
    try {
      await membersApi.removeMember(projectId, userId)
    } catch (e: any) {
      members.value = backup
      throw e
    }
  }

  return { members, loading, fetchMembers, inviteMember, removeMember }
})
