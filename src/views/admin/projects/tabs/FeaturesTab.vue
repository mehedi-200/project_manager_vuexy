<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFeatureStore } from '@/stores/useFeatureStore.ts'
import FeatureTable from '@/components/feature/FeatureTable.vue'
import FeatureKanban from '@/components/feature/FeatureKanban.vue'
import FeatureFormModal from '@/components/feature/FeatureFormModal.vue'
import FeatureDrawer from '@/components/feature/FeatureDrawer.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
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
const { addToast } = useToast()
const { ask } = useConfirm()

const viewMode = ref<'table' | 'kanban'>('table')
const filterStatus = ref('')
const filterPriority = ref('')
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingFeature = ref<Feature | undefined>(undefined)
const drawerFeature = ref<Feature | null>(null)

const canEdit = computed(() => props.currentRole ? ['admin', 'manager'].includes(props.currentRole) : true)

onMounted(async () => {
  await featureStore.fetchFeatures(props.projectId)
})

function closeDrawer() { drawerFeature.value = null }
function closeModal() { showModal.value = false }

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

async function handleSaved(data: object) {
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

async function handleStatusChange(id: number, statusValue: number) {
  try {
    await featureStore.updateStatus(id, statusValue)
  } catch {
    addToast('Failed to update status', 'error')
  }
}

async function handleReorder(id: number, direction: 'up' | 'down') {
  try {
    await featureStore.reorderFeature(id, direction)
  } catch {
    addToast('Failed to reorder', 'error')
  }
}

async function changePage(page: number) {
  await featureStore.fetchFeatures(props.projectId, page, featureStore.pagination?.per_page)
}

async function changePerPage(perPage: number) {
  await featureStore.fetchFeatures(props.projectId, 1, perPage)
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
          <option value="1">Pending</option>
          <option value="2">In Progress</option>
          <option value="3">Completed</option>
        </select>
        <select v-model="filterPriority" class="filter-select">
          <option value="">All Priority</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
      </div>

      <button class="btn-primary" @click="openCreate">➕ Add Feature</button>
    </div>

    <div class="features-content">
      <SkeletonLoader v-if="featureStore.loading" :count="4" height="50px" />

      <EmptyState
        v-else-if="!featureStore.features.length"
        icon="🎯"
        title="No features yet"
        message="Break your project into features and track progress."
        action-label="Add First Feature"
        @action="openCreate"
      />

      <template v-else>
        <FeatureTable
          v-if="viewMode === 'table'"
          :features="featureStore.features"
          :filter-status="filterStatus"
          :filter-priority="filterPriority"
          :can-edit="canEdit"
          @edit="openEdit"
          @delete="handleDelete"
          @status-change="handleStatusChange"
          @reorder="handleReorder"
          @open="openDrawer"
        />
        <FeatureKanban
          v-else
          :features="featureStore.features"
          @open="openDrawer"
          @status-change="handleStatusChange"
        />
      </template>
    </div>

    <AppPagination
      v-if="featureStore.pagination"
      :current-page="featureStore.pagination.current_page"
      :last-page="featureStore.pagination.last_page"
      :total="featureStore.pagination.total"
      :per-page="featureStore.pagination.per_page"
      :from="featureStore.pagination.from"
      :to="featureStore.pagination.to"
      @change="changePage"
      @per-page-change="changePerPage"
    />

    <FeatureFormModal
      v-if="showModal"
      :mode="modalMode"
      :feature="editingFeature"
      :project-id="projectId"
      @saved="handleSaved"
      @close="closeModal"
    />

    <FeatureDrawer
      :feature="drawerFeature"
      @close="closeDrawer"
    />
  </div>
</template>

<style scoped>
.features-tab { display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 0; }
.features-content { flex: 1; min-height: 0; padding-bottom: 20px; display: flex; flex-direction: column; gap: 20px; padding-top: 20px; }

.tab-toolbar {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 20px;
}

.view-toggle {
  display: flex;
  border: 1px solid rgba(102,126,234,0.25);
  border-radius: 8px;
  overflow: hidden;
}
.toggle-btn {
  padding: 8px 14px; background: none; border: none; cursor: pointer;
  font-size: 13px; font-weight: 500; color: inherit; transition: all 0.2s;
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
