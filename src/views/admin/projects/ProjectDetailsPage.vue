<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore.ts'
import { useMemberStore } from '@/stores/useMemberStore.ts'
import { authStore } from '@/stores/authStore.ts'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import ProjectFormModal from '@/components/project/ProjectFormModal.vue'
import OverviewTab from './tabs/OverviewTab.vue'
import PhasesTab from './tabs/PhasesTab.vue'
import FeaturesTab from './tabs/FeaturesTab.vue'
import MembersTab from './tabs/MembersTab.vue'
import ActivityTab from './tabs/ActivityTab.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Project } from '@/types/index.ts'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const memberStore = useMemberStore()
const store = authStore()
const { addToast } = useToast()
const { ask } = useConfirm()

const projectId = computed(() => Number(route.params.id))
const activeTab = ref<'overview' | 'phases' | 'features' | 'members' | 'activity'>('overview')

// Sync tab from ?tab= query param
watch(
  () => route.query.tab,
  (tab) => {
    const valid = ['overview', 'phases', 'features', 'members', 'activity']
    if (tab && valid.includes(tab as string)) {
      activeTab.value = tab as typeof activeTab.value
    }
  },
  { immediate: true }
)
const showEditModal = ref(false)
const saving = ref(false)

const tabs = [
  { key: 'overview',  label: '📊 Overview' },
  { key: 'phases',    label: '📋 Phases' },
  { key: 'features',  label: '🎯 Features' },
  { key: 'members',   label: '👥 Members' },
  { key: 'activity',  label: '📜 Activity' },
] as const

const currentRole = computed(() => {
  const userId = store.user?.id
  if (!userId) return 'viewer'
  const m = memberStore.members?.find(m => m.user_id === userId)
  return m?.role ?? 'viewer'
})

onMounted(async () => {
  try {
    await projectStore.fetchProject(projectId.value)
    await memberStore.fetchMembers(projectId.value)
  } catch {
    // error state set in store
  }
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
    <!-- Loading -->
    <SkeletonLoader v-if="projectStore.loading" :count="1" height="40px" />
    <SkeletonLoader v-if="projectStore.loading" :count="1" height="60px" style="margin-top:16px" />
    <SkeletonLoader v-if="projectStore.loading" :count="3" height="100px" style="margin-top:16px" />

    <template v-else-if="projectStore.currentProject">
      <!-- Breadcrumb -->
      <AppBreadcrumb
        :items="[
          { label: 'Dashboard', to: '/admin' },
          { label: 'Projects', to: '/admin/projects' },
          { label: projectStore.currentProject.name }
        ]"
      />

      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">{{ projectStore.currentProject.name }}</h1>
        <div class="page-header-actions">
          <button class="btn-edit" @click="showEditModal = true">✏️ Edit</button>
          <button class="btn-delete" @click="handleDelete">🗑️ Delete</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <OverviewTab
          v-if="activeTab === 'overview'"
          :project="projectStore.currentProject"
          :members-count="memberStore.members?.length ?? 0"
          @edit="showEditModal = true"
        />
        <PhasesTab
          v-else-if="activeTab === 'phases'"
          :project-id="projectId"
          :current-role="currentRole"
        />
        <FeaturesTab
          v-else-if="activeTab === 'features'"
          :project-id="projectId"
          :current-role="currentRole"
        />
        <MembersTab
          v-else-if="activeTab === 'members'"
          :project-id="projectId"
          :current-role="currentRole"
        />
        <ActivityTab v-else-if="activeTab === 'activity'" />
      </div>
    </template>

    <div v-else class="not-found">
      <p>Project not found.</p>
    </div>

    <!-- Edit Modal -->
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
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.tabs-nav {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid rgba(102,126,234,0.12);
  overflow-x: auto;
}

.tab-btn {
  padding: 10px 18px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  opacity: 0.55;
  transition: all 0.2s;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.tab-btn:hover { opacity: 0.85; }
.tab-btn.active {
  opacity: 1;
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  padding: 4px 0;
}

.not-found { text-align: center; padding: 60px; opacity: 0.5; }

@media (max-width: 600px) {
  .page-title { font-size: 1.4rem; }
  .tabs-nav { gap: 0; }
  .tab-btn { padding: 10px 12px; font-size: 13px; }
}
</style>
