<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFeatureStore } from '@/stores/useFeatureStore.ts'
import { usePhaseStore } from '@/stores/usePhaseStore.ts'
import FeatureTable from '@/components/feature/FeatureTable.vue'
import FeatureKanban from '@/components/feature/FeatureKanban.vue'
import FeatureFormModal from '@/components/feature/FeatureFormModal.vue'
import FeatureDrawer from '@/components/feature/FeatureDrawer.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Feature } from '@/types/index.ts'

const props = defineProps<{
  projectId: number
  currentRole?: string
}>()

const featureStore = useFeatureStore()
const phaseStore = usePhaseStore()
const { addToast } = useToast()
const { ask } = useConfirm()

const viewMode = ref<'table' | 'kanban'>('table')
const filterStatus = ref('')
const filterPriority = ref('')
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingFeature = ref<Feature | undefined>(undefined)
const drawerFeature = ref<Feature | null>(null)

const canEdit = computed(() => ['admin', 'manager'].includes(props.currentRole ?? ''))

onMounted(async () => {
  if (!featureStore.features.length) {
    await featureStore.fetchFeatures(props.projectId)
  }
  if (!phaseStore.phases.length) {
    await phaseStore.fetchPhases(props.projectId)
  }
})

function closeDrawer() {
  drawerFeature.value = null
}

function closeModal() {
  showModal.value = false
}

function openCreate() {
  modalMode.value = 'create'
  editingFeature.value = undefined
  showModal.value = true
}

function openEdit(feature: Feature) {
  modalMode.value = 'edit'
  editingFeature.value = feature
  showModal.value = true
}

function openDrawer(feature: Feature) {
  drawerFeature.value = feature
}

async function handleSaved(data: Partial<Feature>) {
  try {
    if (modalMode.value === 'create') {
      await featureStore.createFeature(props.projectId, data)
      addToast('Feature created!', 'success')
    } else if (editingFeature.value) {
      await featureStore.updateFeature(editingFeature.value.id, data)
      addToast('Feature updated!', 'success')
    }
    showModal.value = false
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to save feature', 'error')
  }
}

async function handleDelete(feature: Feature) {
  const confirmed = await ask(`Delete feature "${feature.title}"?`)
  if (!confirmed) return
  try {
    await featureStore.deleteFeature(feature.id)
    addToast('Feature deleted', 'success')
  } catch {
    addToast('Failed to delete feature', 'error')
  }
}

async function handleStatusChange(id: number, status: Feature['status']) {
  try {
    await featureStore.updateStatus(id, status)
    addToast('Status updated', 'success')
  } catch {
    addToast('Failed to update status', 'error')
  }
}
</script>

<template>
  <div class="features-tab">
    <!-- Toolbar -->
    <div class="tab-toolbar">
      <div class="view-toggle">
        <button :class="['toggle-btn', { active: viewMode === 'table' }]" @click="viewMode = 'table'">📋 Table</button>
        <button :class="['toggle-btn', { active: viewMode === 'kanban' }]" @click="viewMode = 'kanban'">🗂 Kanban</button>
      </div>

      <div class="filters">
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select v-model="filterPriority" class="filter-select">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button v-if="canEdit" class="btn-primary" @click="openCreate">➕ Add Feature</button>
    </div>

    <SkeletonLoader v-if="featureStore.loading" :count="4" height="50px" />

    <EmptyState
      v-else-if="!featureStore.features.length"
      icon="🎯"
      title="No features yet"
      message="Break your project into features and track progress."
      :action-label="canEdit ? 'Add First Feature' : undefined"
      @action="openCreate"
    />

    <template v-else>
      <FeatureTable
        v-if="viewMode === 'table'"
        :features="featureStore.features"
        :phases="phaseStore.phases"
        :filter-status="filterStatus"
        :filter-priority="filterPriority"
        @edit="openEdit"
        @delete="handleDelete"
        @status-change="handleStatusChange"
        @open="openDrawer"
      />
      <FeatureKanban
        v-else
        :features="featureStore.features"
        :phases="phaseStore.phases"
        @open="openDrawer"
        @status-change="handleStatusChange"
      />
    </template>

    <FeatureFormModal
      v-if="showModal"
      :mode="modalMode"
      :feature="editingFeature"
      :project-id="projectId"
      :phases="phaseStore.phases"
      :features="featureStore.features"
      @saved="handleSaved"
      @close="closeModal"
    />

    <FeatureDrawer
      :feature="drawerFeature"
      :phases="phaseStore.phases"
      @close="closeDrawer"
    />
  </div>
</template>

<style scoped>
.features-tab { display: flex; flex-direction: column; gap: 20px; }

.tab-toolbar {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  border: 1px solid rgba(102,126,234,0.25);
  border-radius: 8px;
  overflow: hidden;
}
.toggle-btn {
  padding: 8px 14px; background: none; border: none; cursor: pointer;
  font-size: 13px; font-weight: 500; color: inherit;
  transition: all 0.2s;
}
.toggle-btn.active { background: rgba(102,126,234,0.15); color: #667eea; font-weight: 700; }
.toggle-btn:hover:not(.active) { background: rgba(102,126,234,0.06); }

.filters { display: flex; gap: 8px; flex: 1; flex-wrap: wrap; }

.filter-select {
  padding: 8px 12px; border: 1px solid rgba(102,126,234,0.2);
  border-radius: 8px; font-size: 13px; background: inherit; color: inherit;
  outline: none; cursor: pointer;
}
.filter-select:focus { border-color: #667eea; }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color: white; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.3s; box-shadow: 0 4px 12px rgba(102,126,234,0.3);
  white-space: nowrap;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,0.4); }
</style>
