<script setup lang="ts">
import type { Feature, Phase } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  features: Feature[]
  phases: Phase[]
}>()

const emit = defineEmits<{
  (e: 'open', feature: Feature): void
  (e: 'statusChange', id: number, status: Feature['status']): void
}>()

const columns: { key: Feature['status']; label: string; icon: string }[] = [
  { key: 'pending',     label: 'Pending',     icon: '🕐' },
  { key: 'in_progress', label: 'In Progress', icon: '⚡' },
  { key: 'done',        label: 'Done',        icon: '✅' },
]

function featuresForStatus(status: Feature['status']) {
  return props.features.filter(f => f.status === status)
}

function phaseName(phaseId?: number) {
  if (!phaseId) return null
  return props.phases.find(p => p.id === phaseId)?.name ?? null
}
</script>

<template>
  <div class="kanban-board">
    <div v-for="col in columns" :key="col.key" class="kanban-column">
      <div class="column-header">
        <span class="column-icon">{{ col.icon }}</span>
        <span class="column-title">{{ col.label }}</span>
        <span class="column-count">{{ featuresForStatus(col.key).length }}</span>
      </div>
      <div class="column-cards">
        <div
          v-if="featuresForStatus(col.key).length === 0"
          class="empty-column"
        >
          No items
        </div>
        <div
          v-for="f in featuresForStatus(col.key)"
          :key="f.id"
          class="kanban-card"
          @click="$emit('open', f)"
        >
          <div class="card-title">{{ f.title }}</div>
          <div class="card-meta">
            <Badge type="priority" :value="f.priority" />
            <span v-if="f.estimated_hours" class="card-hours">⏱ {{ f.estimated_hours }}h</span>
          </div>
          <div v-if="phaseName(f.phase_id)" class="card-phase">📂 {{ phaseName(f.phase_id) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
}

.kanban-column {
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px;
  overflow: hidden;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: rgba(102,126,234,0.06);
  border-bottom: 1px solid rgba(102,126,234,0.1);
  font-weight: 700;
  font-size: 14px;
}
.column-icon { font-size: 16px; }
.column-title { flex: 1; }
.column-count {
  background: rgba(102,126,234,0.15);
  color: #667eea;
  border-radius: 20px;
  padding: 1px 8px;
  font-size: 12px;
  font-weight: 700;
}

.column-cards { padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 80px; }

.empty-column { text-align: center; padding: 24px 0; opacity: 0.4; font-size: 13px; }

.kanban-card {
  padding: 14px;
  border: 1px solid rgba(102,126,234,0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kanban-card:hover {
  border-color: rgba(102,126,234,0.4);
  box-shadow: 0 4px 12px rgba(102,126,234,0.1);
  transform: translateY(-2px);
}

.card-title { font-size: 14px; font-weight: 600; line-height: 1.4; }
.card-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.card-hours { font-size: 12px; opacity: 0.65; }
.card-phase { font-size: 12px; opacity: 0.55; }

@media (max-width: 768px) {
  .kanban-board { grid-template-columns: 1fr; }
}
</style>
