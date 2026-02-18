<script setup lang="ts">
import { ref } from 'vue'

const stats = [
  {
    icon: '📁',
    title: 'Total Projects',
    value: '24',
    change: '+12%',
    positive: true,
    color: '#667eea'
  },
  {
    icon: '✅',
    title: 'Completed',
    value: '18',
    change: '+8%',
    positive: true,
    color: '#4caf50'
  },
  {
    icon: '⏳',
    title: 'In Progress',
    value: '6',
    change: '-5%',
    positive: false,
    color: '#ff9800'
  },
  {
    icon: '📝',
    title: 'Total Notes',
    value: '142',
    change: '+23%',
    positive: true,
    color: '#f093fb'
  }
]

const recentProjects = [
  {
    name: 'E-commerce Platform',
    status: 'In Progress',
    progress: 75,
    date: '2026-02-15',
    priority: 'High'
  },
  {
    name: 'Mobile App Redesign',
    status: 'Planning',
    progress: 30,
    date: '2026-02-14',
    priority: 'Medium'
  },
  {
    name: 'API Integration',
    status: 'In Progress',
    progress: 60,
    date: '2026-02-13',
    priority: 'High'
  },
  {
    name: 'Dashboard UI Update',
    status: 'Completed',
    progress: 100,
    date: '2026-02-10',
    priority: 'Low'
  }
]

const recentActivities = [
  {
    icon: '✅',
    text: 'Completed task "API Authentication"',
    time: '2 hours ago',
    color: '#4caf50'
  },
  {
    icon: '📝',
    text: 'Added new note to "Mobile App" project',
    time: '4 hours ago',
    color: '#667eea'
  },
  {
    icon: '🚀',
    text: 'Started new project "Marketing Website"',
    time: '1 day ago',
    color: '#f093fb'
  },
  {
    icon: '🔄',
    text: 'Updated roadmap for "E-commerce Platform"',
    time: '2 days ago',
    color: '#ff9800'
  }
]
</script>

<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's your project overview</p>
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
          <p :class="['stat-change', { positive: stat.positive, negative: !stat.positive }]">
            {{ stat.change }} from last month
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Recent Projects -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Recent Projects</h3>
          <a href="#" class="card-link">View All →</a>
        </div>
        <div class="card-content">
          <div v-for="(project, index) in recentProjects" :key="index" class="project-item">
            <div class="project-info">
              <h4 class="project-name">{{ project.name }}</h4>
              <div class="project-meta">
                <span :class="['project-status', project.status.toLowerCase().replace(' ', '-')]">
                  {{ project.status }}
                </span>
                <span class="project-date">{{ project.date }}</span>
                <span :class="['project-priority', 'priority-' + project.priority.toLowerCase()]">
                  {{ project.priority }}
                </span>
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

      <!-- Recent Activities -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Recent Activities</h3>
          <a href="#" class="card-link">View All →</a>
        </div>
        <div class="card-content">
          <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
            <div class="activity-icon" :style="{ background: activity.color + '20', color: activity.color }">
              {{ activity.icon }}
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-card">
      <h3 class="card-title">Quick Actions</h3>
      <div class="quick-actions-grid">
        <button class="quick-action-btn">
          <span class="action-icon">📁</span>
          <span class="action-label">Create Project</span>
        </button>
        <button class="quick-action-btn">
          <span class="action-icon">📝</span>
          <span class="action-label">Add Note</span>
        </button>
        <button class="quick-action-btn">
          <span class="action-icon">📊</span>
          <span class="action-label">View Reports</span>
        </button>
        <button class="quick-action-btn">
          <span class="action-icon">⚙️</span>
          <span class="action-label">Settings</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: inherit;
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

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
}

.stat-change.positive {
  color: #4caf50;
}

.stat-change.negative {
  color: #f44336;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-card {
  background: inherit;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.card-link {
  color: #667eea;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.card-link:hover {
  opacity: 0.7;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Project Item */
.project-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.project-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
}

.project-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
}

.project-status {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.project-status.in-progress {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.project-status.planning {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.project-status.completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.project-date {
  opacity: 0.6;
}

.project-priority {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.priority-high {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.priority-medium {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.priority-low {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.7;
}

/* Activity Item */
.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-text {
  font-size: 14px;
  line-height: 1.5;
}

.activity-time {
  font-size: 12px;
  opacity: 0.6;
}

/* Quick Actions */
.quick-actions-card {
  background: inherit;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 24px;
}

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
  background: inherit;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 32px;
}

.action-label {
  font-size: 14px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 24px;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
