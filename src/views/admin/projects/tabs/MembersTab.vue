<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores/useMemberStore.ts'
import MemberList from '@/components/member/MemberList.vue'
import InviteModal from '@/components/member/InviteModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Member } from '@/types/index.ts'

const props = defineProps<{
  projectId: number
  currentRole?: string
}>()

const memberStore = useMemberStore()
const { addToast } = useToast()
const { ask } = useConfirm()
const showInvite = ref(false)

async function handleInvite(data: { user_id: number; role: string }) {
  try {
    await memberStore.inviteMember(props.projectId, data)
    addToast('Member invited!', 'success')
    showInvite.value = false
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to invite member', 'error')
  }
}

async function handleRemove(member: Member) {
  const confirmed = await ask(`Remove ${member.name} from this project?`)
  if (!confirmed) return
  try {
    await memberStore.removeMember(props.projectId, member.user_id)
    addToast('Member removed', 'success')
  } catch {
    addToast('Failed to remove member', 'error')
  }
}
</script>

<template>
  <div class="members-tab">
    <div class="tab-header">
      <h3 class="tab-section-title">Members ({{ memberStore.members.length }})</h3>
      <button
        v-if="currentRole === 'admin' || currentRole === 'manager'"
        class="btn-primary"
        @click="showInvite = true"
      >👥 Invite Member</button>
    </div>

    <SkeletonLoader v-if="memberStore.loading" :count="3" height="56px" />

    <EmptyState
      v-else-if="!memberStore.members.length"
      icon="👥"
      title="No members yet"
      message="Invite team members to collaborate on this project."
      :action-label="(currentRole === 'admin' || currentRole === 'manager') ? 'Invite Member' : undefined"
      @action="showInvite = true"
    />

    <MemberList
      v-else
      :members="memberStore.members"
      :current-role="currentRole"
      @remove="handleRemove"
    />

    <InviteModal
      v-if="showInvite"
      @saved="handleInvite"
      @close="showInvite = false"
    />
  </div>
</template>

<style scoped>
.members-tab { display: flex; flex-direction: column; gap: 20px; }
.tab-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.tab-section-title { font-size: 16px; font-weight: 700; opacity: 0.8; }
.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color: white; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.3s; box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,0.4); }
</style>
