<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore.ts'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import ProjectFormModal from '@/components/project/ProjectFormModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import FeaturesTab from '@/views/admin/projects/tabs/FeaturesTab.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Project } from '@/types/index.ts'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { addToast } = useToast()
const { ask } = useConfirm()

const projectId = computed(() => Number(route.params.id))
const activeTab = ref<'overview' | 'features'>('features')
const showEditModal = ref(false)
const saving = ref(false)

onMounted(async () => {
  try {
    await projectStore.fetchProject(projectId.value)
  } catch {}
})

async function handleEditSaved(data: Partial<Project>) {
  if (!projectStore.currentProject) return
  saving.value = true
  try {
    await projectStore.updateProject(projectStore.currentProject.id, data)
    addToast('Project updated!', 'success')
    showEditModal.value = false
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to update project', 'error')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!projectStore.currentProject) return
  const confirmed = await ask(`Delete "${projectStore.currentProject.name}"? This cannot be undone.`)
  if (!confirmed) return
  try {
    await projectStore.deleteProject(projectStore.currentProject.id)
    addToast('Project deleted', 'success')
    router.push({ name: 'projects' })
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to delete project', 'error')
  }
}
</script>

<template>
  <div class="project-details">
    <SkeletonLoader v-if="projectStore.loading" type="detail" />

    <template v-else-if="projectStore.currentProject">
      <AppBreadcrumb
        :items="[
          { label: 'Dashboard', to: '/admin' },
          { label: 'Projects', to: '/admin/projects' },
          { label: projectStore.currentProject.name }
        ]"
      />

      <div class="page-header">
        <h1 class="page-title">{{ projectStore.currentProject.name }}</h1>
        <div class="page-header-actions">
          <button class="btn-edit" @click="showEditModal = true">✏️ Edit</button>
          <button class="btn-delete" @click="handleDelete">🗑️ Delete</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          :class="['tab-btn', { active: activeTab === 'overview' }]"
          @click="activeTab = 'overview'"
        >📋 Overview</button>
        <button
          :class="['tab-btn', { active: activeTab === 'features' }]"
          @click="activeTab = 'features'"
        >🎯 Features</button>
      </div>

      <!-- Overview -->
      <div v-if="activeTab === 'overview'" class="overview-panel">
        <div class="overview-grid">
          <div class="overview-card">
            <span class="ov-label">Status</span>
            <span class="ov-value">{{ projectStore.currentProject.status?.label ?? '—' }}</span>
          </div>
          <div class="overview-card">
            <span class="ov-label">Start Date</span>
            <span class="ov-value">{{ projectStore.currentProject.start_date ?? '—' }}</span>
          </div>
          <div class="overview-card">
            <span class="ov-label">Deadline</span>
            <span class="ov-value">{{ projectStore.currentProject.deadline ?? '—' }}</span>
          </div>
          <div class="overview-card full">
            <span class="ov-label">Description</span>
            <span class="ov-value">{{ projectStore.currentProject.description || 'No description provided.' }}</span>
          </div>
        </div>
      </div>

      <!-- Features -->
      <FeaturesTab
        v-if="activeTab === 'features'"
        :project-id="projectId"
      />
    </template>

    <div v-else class="not-found">
      <p>Project not found.</p>
    </div>

    <ProjectFormModal
      v-if="showEditModal && projectStore.currentProject"
      mode="edit"
      :project="projectStore.currentProject"
      @saved="handleEditSaved"
      @close="showEditModal = false"
    />
  </div>
</template>

<style scoped>
.project-details {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  flex: 1;
  min-height: 0;
}

.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.8rem; font-weight: 700; }
.page-header-actions { display: flex; gap: 10px; }

.btn-edit {
  padding: 8px 18px; border: 1px solid rgba(102,126,234,0.35); color: #667eea;
  background: none; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-edit:hover { background: rgba(102,126,234,0.1); }

.btn-delete {
  padding: 8px 18px; border: 1px solid rgba(244,67,54,0.35); color: #f44336;
  background: none; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-delete:hover { background: rgba(244,67,54,0.1); }

/* Tab bar */
.tab-bar {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid rgba(102,126,234,0.15);
  padding-bottom: 0;
}
.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  transition: all 0.2s;
  border-radius: 6px 6px 0 0;
}
.tab-btn:hover { opacity: 1; background: rgba(102,126,234,0.06); }
.tab-btn.active { opacity: 1; border-bottom-color: #667eea; color: #667eea; }

/* Overview */
.overview-panel { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.overview-card {
  background: rgba(102,126,234,0.05);
  border: 1px solid rgba(102,126,234,0.12);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.overview-card.full { grid-column: 1 / -1; }
.ov-label { font-size: 12px; font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.05em; }
.ov-value { font-size: 15px; font-weight: 500; }

.not-found { text-align: center; padding: 60px; opacity: 0.5; }

@media (max-width: 600px) {
  .page-title { font-size: 1.4rem; }
}
</style>
