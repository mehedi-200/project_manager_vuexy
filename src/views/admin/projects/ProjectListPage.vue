<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore.ts'
import ProjectFormModal from '@/components/project/ProjectFormModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import { useToast } from '@/composables/useToast.ts'
import { useConfirm } from '@/composables/useConfirm.ts'
import type { Project } from '@/types/index.ts'

const projectStore = useProjectStore()
const router = useRouter()
const { addToast } = useToast()
const { ask } = useConfirm()

const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingProject = ref<Project | undefined>(undefined)
const saving = ref(false)

onMounted(async () => {
  try {
    await projectStore.fetchProjects()
  } catch {
    // error state set in store
  }
})

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function openCreate() {
  modalMode.value = 'create'
  editingProject.value = undefined
  showModal.value = true
}

function openEdit(project: Project) {
  modalMode.value = 'edit'
  editingProject.value = project
  showModal.value = true
}

async function handleSaved(data: Partial<Project>) {
  saving.value = true
  try {
    if (modalMode.value === 'create') {
      await projectStore.createProject(data)
      addToast('Project created!', 'success')
    } else if (editingProject.value) {
      await projectStore.updateProject(editingProject.value.id, data)
      addToast('Project updated!', 'success')
    }
    showModal.value = false
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to save project', 'error')
  } finally {
    await projectStore.fetchProjects();
    saving.value = false
  }
}

async function handleDelete(project: Project) {
  const confirmed = await ask(`Permanently delete "${project.name}"? This cannot be undone.`)
  if (!confirmed) return
  try {
    await projectStore.deleteProject(project.id)
    addToast('Project deleted', 'success')
  } catch {
    addToast('Failed to delete project', 'error')
  }
}
</script>

<template>
  <div class="projects-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📁 Projects</h1>
        <p class="page-subtitle">Manage all your projects in one place.</p>
      </div>
      <button class="btn-primary" @click="openCreate">➕ New Project</button>
    </div>

    <!-- Loading -->
    <SkeletonLoader v-if="projectStore.loading" :count="6" height="180px" />

    <!-- Error -->
    <div v-else-if="projectStore.error" class="error-banner">
      {{ projectStore.error }}
    </div>

    <!-- Empty -->
    <EmptyState
      v-else-if="!projectStore.projects.length"
      icon="📭"
      title="No projects yet"
      message="Create your first project to get started with your team."
      action-label="Create Project"
      @action="openCreate"
    />

    <!-- Grid -->
    <div v-else class="projects-grid">
      <div
        v-for="p in projectStore.projects"
        :key="p.id"
        class="project-card"
        @click="router.push({ name: 'project-details', params: { id: p.id } })"
      >
        <div class="card-top">
          <h3 class="card-name">{{ p.name }}</h3>
          <Badge type="status" :value="p.is_active" />
        </div>

        <p v-if="p.description" class="card-desc">{{ p.description }}</p>

        <div class="card-meta">
          <span v-if="p.deadline" class="meta-item">⏰ {{ formatDate(p.deadline) }}</span>
          <span class="meta-item">🎯 {{ p.features_count ?? 0 }} features</span>
        </div>

        <div class="card-progress">
          <div class="progress-row">
            <span class="progress-label">Progress</span>
            <span class="progress-pct">{{ p.progress ?? 0 }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (p.progress ?? 0) + '%' }"></div>
          </div>
        </div>

        <div class="card-actions" @click.stop>
          <button
            class="action-btn edit-btn"
            title="Edit"
            @click="openEdit(p)"
          >✏️ Edit</button>
          <button
            class="action-btn delete-btn"
            title="Delete"
            @click="handleDelete(p)"
          >🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProjectFormModal
      v-if="showModal"
      :mode="modalMode"
      :project="editingProject"
      @saved="handleSaved"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.projects-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title { font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
.page-subtitle { font-size: 1rem; opacity: 0.65; }

.btn-primary {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color: white; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.3s; box-shadow: 0 4px 15px rgba(102,126,234,0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.4); }

.error-banner {
  background: rgba(244,67,54,0.1); color: #f44336;
  border: 1px solid rgba(244,67,54,0.3); border-radius: 10px;
  padding: 16px 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: var(--card-bg, white);
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(102,126,234,0.15);
  border-color: rgba(102,126,234,0.4);
}

.admin-layout.dark .project-card { background: #2d2d2d; }

.card-top {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
}
.card-name { font-size: 16px; font-weight: 700; line-height: 1.3; flex: 1; }

.card-desc {
  font-size: 13px; opacity: 0.65; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

.card-meta { display: flex; flex-wrap: wrap; gap: 10px; }
.meta-item { font-size: 12px; opacity: 0.6; }

.card-progress { }
.progress-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.progress-label { font-size: 12px; opacity: 0.6; }
.progress-pct { font-size: 12px; font-weight: 700; color: #667eea; }
.progress-bar { height: 6px; background: rgba(102,126,234,0.12); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 3px; transition: width 0.4s; }

.card-actions { display: flex; gap: 8px; padding-top: 4px; border-top: 1px solid rgba(102,126,234,0.1); }

.action-btn {
  padding: 6px 12px; background: none;
  border-radius: 6px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; flex: 1;
}
.archive-btn, .edit-btn { border: 1px solid rgba(102,126,234,0.3); color: #667eea; }
.archive-btn:hover, .edit-btn:hover { background: rgba(102,126,234,0.1); }
.delete-btn { border: 1px solid rgba(244,67,54,0.3); color: #f44336; }
.delete-btn:hover { background: rgba(244,67,54,0.1); }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
