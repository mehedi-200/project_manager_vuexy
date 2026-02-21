<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePhaseStore } from '@/stores/usePhaseStore.ts'
import PhaseList from '@/components/phase/PhaseList.vue'
import PhaseFormModal from '@/components/phase/PhaseFormModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Phase } from '@/types/index.ts'

const props = defineProps<{
  projectId: number
  currentRole?: string
}>()

const phaseStore = usePhaseStore()
const { addToast } = useToast()
const { ask } = useConfirm()

const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingPhase = ref<Phase | undefined>(undefined)

const canEdit = computed(() => ['admin', 'manager'].includes(props.currentRole ?? ''))
const canDelete = computed(() => props.currentRole === 'admin')

onMounted(() => phaseStore.fetchPhases(props.projectId))

function openCreate() {
  modalMode.value = 'create'
  editingPhase.value = undefined
  showModal.value = true
}

function openEdit(phase: Phase) {
  modalMode.value = 'edit'
  editingPhase.value = phase
  showModal.value = true
}

async function handleSaved(data: Partial<Phase>) {
  try {
    if (modalMode.value === 'create') {
      await phaseStore.createPhase(props.projectId, data)
      addToast('Phase created!', 'success')
    } else if (editingPhase.value) {
      await phaseStore.updatePhase(editingPhase.value.id, data)
      addToast('Phase updated!', 'success')
    }
    showModal.value = false
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to save phase', 'error')
  }
}

async function handleDelete(phase: Phase) {
  const confirmed = await ask(`Delete phase "${phase.name}"? This cannot be undone.`)
  if (!confirmed) return
  try {
    await phaseStore.deletePhase(phase.id)
    addToast('Phase deleted', 'success')
  } catch {
    addToast('Failed to delete phase', 'error')
  }
}

async function handleMove(id: number, direction: 'up' | 'down') {
  try {
    await phaseStore.reorderPhases(id, direction)
  } catch {
    addToast('Failed to reorder', 'error')
  }
}
</script>

<template>
  <div class="phases-tab">
    <div class="tab-header">
      <h3 class="tab-section-title">Phases</h3>
      <button v-if="canEdit" class="btn-primary" @click="openCreate">➕ Add Phase</button>
    </div>

    <SkeletonLoader v-if="phaseStore.loading" :count="3" height="60px" />

    <EmptyState
      v-else-if="!phaseStore.phases.length"
      icon="📋"
      title="No phases yet"
      message="Organize your project into phases for better structure."
      :action-label="canEdit ? 'Add First Phase' : undefined"
      @action="openCreate"
    />

    <PhaseList
      v-else
      :phases="phaseStore.phases"
      :can-edit="canEdit"
      :can-delete="canDelete"
      @edit="openEdit"
      @delete="handleDelete"
      @move="handleMove"
    />

    <PhaseFormModal
      v-if="showModal"
      :mode="modalMode"
      :phase="editingPhase"
      :project-id="projectId"
      @saved="handleSaved"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.phases-tab { display: flex; flex-direction: column; gap: 20px; }
.tab-header { display: flex; align-items: center; justify-content: space-between; }
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
