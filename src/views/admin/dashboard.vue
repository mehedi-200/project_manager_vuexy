<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboard } from '@/api/dashboardApi.ts'
import { authStore } from '@/stores/authStore.ts'

const store = authStore()
const loading = ref(true)
const error = ref<string | null>(null)

const user = ref<any>(null)
const stats = ref([
  { icon: '📁', title: 'Total Projects', value: '0', color: '#667eea' },
  { icon: '✅', title: 'Completed',       value: '0', color: '#4caf50' },
  { icon: '⏳', title: 'In Progress',     value: '0', color: '#ff9800' },
  { icon: '🗂️',  title: 'Planning',       value: '0', color: '#f093fb' },
])
const recentProjects = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await getDashboard()
    const data = res.data.data

    user.value = data.user
    if (store.user === null) {
      store.user = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    const s = data.stats as { total_projects: number; completed: number; in_progress: number; planning: number }
    const sv = stats.value
    if (sv[0]) sv[0].value = String(s.total_projects ?? 0)
    if (sv[1]) sv[1].value = String(s.completed ?? 0)
    if (sv[2]) sv[2].value = String(s.in_progress ?? 0)
    if (sv[3]) sv[3].value = String(s.planning ?? 0)

    recentProjects.value = data.recent_projects
  } catch (e: any) {
    error.value = 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
})

const statusClass = (status: string) => status.replace('_', '-')
const formatDate = (d: string) => new Date(d).toLocaleDateString()
</script>

<template>
  <div class="dashboard">
    <!-- Loading -->
    <div v-if="loading" class="dashboard-loading">
      <span class="spinner"></span> Loading dashboard...
    </div>

    <template v-else>
      <!-- Error -->
      <div v-if="error" class="dashboard-error">{{ error }}</div>

      <!-- Page Header -->
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">
            Welcome back, <strong>{{ user?.name ?? 'User' }}</strong>! Here's your project overview.
          </p>
        </div>
        <button class="btn-primary">
          <span>➕</span>
          New Project
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div v-for="(stat, index) in stats" :key="index" class="stat-card">
          <div class="stat-icon" :style="{ background: stat.color + '20', color: stat.color }">
            {{ stat.icon }}
          </div>
          <div class="stat-content">
            <p class="stat-title">{{ stat.title }}</p>
            <h2 class="stat-value">{{ stat.value }}</h2>
          </div>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Recent Projects</h3>
          <a href="#" class="card-link">View All →</a>
        </div>
        <div class="card-content">
          <div v-if="recentProjects.length === 0" class="empty-state">
            No projects yet. Create your first project!
          </div>
          <div v-for="(project, index) in recentProjects" :key="index" class="project-item">
            <div class="project-info">
              <h4 class="project-name">{{ project.name }}</h4>
              <div class="project-meta">
                <span :class="['project-status', statusClass(project.status)]">{{ project.status.replace('_', ' ') }}</span>
                <span class="project-date">{{ formatDate(project.created_at) }}</span>
                <span :class="['project-priority', 'priority-' + project.priority]">{{ project.priority }}</span>
              </div>
            </div>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-card">
        <h3 class="card-title">Quick Actions</h3>
        <div class="quick-actions-grid">
          <button class="quick-action-btn"><span class="action-icon">📁</span><span class="action-label">Create Project</span></button>
          <button class="quick-action-btn"><span class="action-icon">📝</span><span class="action-label">Add Note</span></button>
          <button class="quick-action-btn"><span class="action-icon">📊</span><span class="action-label">View Reports</span></button>
          <button class="quick-action-btn"><span class="action-icon">⚙️</span><span class="action-label">Settings</span></button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Loading */
.dashboard-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 60px;
  justify-content: center;
  font-size: 16px;
  opacity: 0.7;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.dashboard-error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  opacity: 0.5;
  font-size: 15px;
}

/* Page Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 1rem;
  opacity: 0.7;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-title { font-size: 14px; opacity: 0.7; margin-bottom: 8px; }
.stat-value { font-size: 32px; font-weight: 700; }

/* Card */
.dashboard-card, .quick-actions-card {
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}

.card-title { font-size: 18px; font-weight: 600; }
.card-link { color: #667eea; font-size: 14px; text-decoration: none; }
.card-link:hover { opacity: 0.7; }
.card-content { display: flex; flex-direction: column; gap: 16px; }

/* Project Item */
.project-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.project-item:hover { background: rgba(102, 126, 234, 0.05); }
.project-name { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.project-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px; }

.project-status { padding: 4px 10px; border-radius: 6px; font-weight: 500; text-transform: capitalize; }
.project-status.in-progress { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
.project-status.planning    { background: rgba(102, 126, 234, 0.2); color: #667eea; }
.project-status.completed   { background: rgba(76, 175, 80, 0.2); color: #4caf50; }

.project-date { opacity: 0.6; }

.project-priority { padding: 4px 10px; border-radius: 6px; font-weight: 500; text-transform: capitalize; }
.priority-high   { background: rgba(244, 67, 54, 0.2); color: #f44336; }
.priority-medium { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
.priority-low    { background: rgba(158, 158, 158, 0.2); color: #9e9e9e; }

.project-progress { display: flex; align-items: center; gap: 12px; }
.progress-bar { flex: 1; height: 8px; background: rgba(102, 126, 234, 0.2); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; transition: width 0.3s ease; }
.progress-text { font-size: 13px; font-weight: 600; opacity: 0.7; }

/* Quick Actions */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: inherit;
}

.quick-action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-icon { font-size: 32px; }
.action-label { font-size: 14px; font-weight: 500; }

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.5rem; }
  .stat-value { font-size: 24px; }
  .stats-grid { grid-template-columns: 1fr; }
  .quick-actions-grid { grid-template-columns: 1fr; }
}
</style>
