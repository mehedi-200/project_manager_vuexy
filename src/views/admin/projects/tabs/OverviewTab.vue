<script setup lang="ts">
import type { Project, Member } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  project: Project
  membersCount?: number
}>()

const emit = defineEmits<{ (e: 'edit'): void }>()

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="overview-tab">
    <div class="overview-header">
      <h3 class="section-label">Project Details</h3>
      <button class="btn-edit" @click="$emit('edit')">✏️ Edit Project</button>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="info-card-icon">📊</div>
        <div class="info-card-content">
          <span class="info-card-label">Status</span>
          <Badge type="status" :value="project.is_active" />
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon">📅</div>
        <div class="info-card-content">
          <span class="info-card-label">Start Date</span>
          <span class="info-card-value">{{ formatDate(project.start_date) }}</span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon">⏰</div>
        <div class="info-card-content">
          <span class="info-card-label">Deadline</span>
          <span class="info-card-value">{{ formatDate(project.deadline) }}</span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon">📈</div>
        <div class="info-card-content">
          <span class="info-card-label">Progress</span>
          <span class="info-card-value">{{ project.progress ?? 0 }}%</span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon">👥</div>
        <div class="info-card-content">
          <span class="info-card-label">Members</span>
          <span class="info-card-value">{{ membersCount ?? '—' }}</span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon">🎯</div>
        <div class="info-card-content">
          <span class="info-card-label">Features</span>
          <span class="info-card-value">
            {{ project.completed_features_count ?? 0 }} / {{ project.features_count ?? 0 }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="project.description" class="desc-card">
      <h4 class="desc-title">📝 Description</h4>
      <p class="desc-text">{{ project.description }}</p>
    </div>

    <div class="progress-section">
      <div class="progress-label-row">
        <span class="progress-label">Overall Progress</span>
        <span class="progress-pct">{{ project.progress ?? 0 }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (project.progress ?? 0) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-tab { display: flex; flex-direction: column; gap: 24px; }

.overview-header {
  display: flex; align-items: center; justify-content: space-between;
}
.section-label { font-size: 16px; font-weight: 700; opacity: 0.8; }

.btn-edit {
  padding: 9px 18px;
  background: rgba(102,126,234,0.1);
  border: 1px solid rgba(102,126,234,0.3);
  border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; color: #667eea; transition: all 0.2s;
}
.btn-edit:hover { background: rgba(102,126,234,0.2); }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px;
  transition: all 0.2s;
}
.info-card:hover { border-color: rgba(102,126,234,0.4); box-shadow: 0 2px 8px rgba(102,126,234,0.08); }

.info-card-icon { font-size: 28px; }
.info-card-content { display: flex; flex-direction: column; gap: 4px; }
.info-card-label { font-size: 12px; opacity: 0.55; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.info-card-value { font-size: 16px; font-weight: 700; }

.desc-card {
  padding: 18px 20px;
  border: 1px solid rgba(102,126,234,0.15);
  border-radius: 12px;
}
.desc-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; opacity: 0.75; }
.desc-text { font-size: 14px; line-height: 1.7; opacity: 0.7; }

.progress-section { }
.progress-label-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.progress-label { font-size: 13px; font-weight: 600; opacity: 0.7; }
.progress-pct { font-size: 13px; font-weight: 700; color: #667eea; }
.progress-bar { height: 10px; background: rgba(102,126,234,0.12); border-radius: 5px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 5px; transition: width 0.5s ease; }
</style>
