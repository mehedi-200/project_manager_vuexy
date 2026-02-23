<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore.ts'
import ProjectFormModal from '@/components/project/ProjectFormModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
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

onMounted(() => projectStore.fetchProjects(1))

async function changePage(page: number) {
  await projectStore.fetchProjects(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function changePerPage(perPage: number) {
  await projectStore.fetchProjects(1, perPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
    await projectStore.fetchProjects(projectStore.pagination.current_page)
  } catch (e: any) {
    addToast(e?.response?.data?.message || 'Failed to save project', 'error')
  } finally {
    saving.value = false
  }
}

async function handleDelete(project: Project) {
  const confirmed = await ask(`Permanently delete "${project.name}"? This cannot be undone.`)
  if (!confirmed) return
  try {
    await projectStore.deleteProject(project.id)
    addToast('Project deleted', 'success')
    await projectStore.fetchProjects(projectStore.pagination.current_page)
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
    <SkeletonLoader v-if="projectStore.loading" type="card" :count="6" />

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
          <div class="card-badges">
            <Badge type="status" :value="p.is_active" />
            <span class="status-label">{{ p.status?.label }}</span>
          </div>
        </div>

        <p class="card-desc">{{ p.description || '—' }}</p>

        <div class="card-meta">
          <span class="meta-item">📅 {{ formatDate(p.start_date) }}</span>
          <span class="meta-item">⏰ {{ formatDate(p.deadline) }}</span>
        </div>

        <div class="card-meta">
          <span class="meta-item">👤 {{ p.owner?.name ?? '—' }}</span>
          <span class="meta-item">🎯 {{ p.features_count ?? 0 }} features</span>
        </div>

        <div class="card-spacer"></div>

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
          <button class="action-btn edit-btn" @click="openEdit(p)">✏️ Edit</button>
          <button class="action-btn delete-btn" @click="handleDelete(p)">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <AppPagination
      v-if="!projectStore.loading && projectStore.projects.length > 0"
      :current-page="projectStore.pagination.current_page"
      :last-page="projectStore.pagination.last_page"
      :total="projectStore.pagination.total"
      :per-page="projectStore.pagination.per_page"
      :from="projectStore.pagination.from"
      :to="projectStore.pagination.to"
      @change="changePage"
      @per-page-change="changePerPage"
    />

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
  flex: 1;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  align-content: start;
}

.project-card {
  background: white;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(102,126,234,0.13);
  border-color: rgba(102,126,234,0.35);
}
.admin-layout.dark .project-card {
  background: #1e2435;
  border-color: rgba(255,255,255,0.08);
}

/* Top: name + badges */
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.card-name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  flex: 1;
  /* clamp to 2 lines so all cards same name height */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
.card-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
}

/* Description — always 2 lines height */
.card-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
.admin-layout.dark .card-desc { color: #94a3b8; }

/* Meta rows */
.card-meta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.meta-item {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}
.admin-layout.dark .meta-item { color: #94a3b8; }

/* Spacer pushes progress + actions to bottom */
.card-spacer { flex: 1; }

/* Progress */
.card-progress { }
.progress-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.progress-label { font-size: 11px; color: #94a3b8; font-weight: 500; }
.progress-pct { font-size: 11px; font-weight: 700; color: #667eea; }
.progress-bar {
  height: 5px;
  background: #f1f3f9;
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 99px;
  transition: width 0.4s ease;
}

/* Actions — always at bottom */
.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f9;
}
.admin-layout.dark .card-actions { border-top-color: rgba(255,255,255,0.07); }

.action-btn {
  flex: 1;
  padding: 7px 0;
  background: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  text-align: center;
}
.edit-btn {
  border: 1px solid rgba(102,126,234,0.3);
  color: #667eea;
}
.edit-btn:hover { background: rgba(102,126,234,0.08); }
.delete-btn {
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
}
.delete-btn:hover { background: rgba(239,68,68,0.08); }

.status-label {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(245,158,11,0.12);
  color: #b45309;
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
