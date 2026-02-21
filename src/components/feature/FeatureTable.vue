<script setup lang="ts">
import type { Feature, Phase } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  features: Feature[]
  phases: Phase[]
  filterStatus?: string
  filterPriority?: string
}>()

const emit = defineEmits<{
  (e: 'edit', feature: Feature): void
  (e: 'delete', feature: Feature): void
  (e: 'statusChange', id: number, status: Feature['status']): void
  (e: 'open', feature: Feature): void
}>()

function filtered() {
  return props.features.filter(f => {
    if (props.filterStatus && f.status !== props.filterStatus) return false
    if (props.filterPriority && f.priority !== props.filterPriority) return false
    return true
  })
}

function phaseName(phaseId?: number) {
  if (!phaseId) return '—'
  return props.phases.find(p => p.id === phaseId)?.name ?? '—'
}
</script>

<template>
  <div class="feature-table-wrap">
    <table class="feature-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Serial</th>
          <th>Day</th>
          <th>Title</th>
          <th>Phase</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Est. Hours</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filtered().length === 0">
          <td colspan="9" class="empty-row">No features found</td>
        </tr>
        <tr v-for="(f, i) in filtered()" :key="f.id" class="feature-row" @click="$emit('open', f)">
          <td class="td-num">{{ i + 1 }}</td>
          <td class="td-num">{{ f.serial_number ?? '—' }}</td>
          <td class="td-num">{{ f.day_number ?? '—' }}</td>
          <td class="td-title">{{ f.title }}</td>
          <td>{{ phaseName(f.phase_id) }}</td>
          <td @click.stop><Badge type="priority" :value="f.priority" /></td>
          <td @click.stop>
            <select
              :value="f.status"
              class="status-select"
              :class="`status-${f.status}`"
              @change="$emit('statusChange', f.id, ($event.target as HTMLSelectElement).value as Feature['status'])"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </td>
          <td>{{ f.estimated_hours != null ? f.estimated_hours + 'h' : '—' }}</td>
          <td class="td-actions" @click.stop>
            <button class="icon-btn edit-btn" title="Edit" @click="$emit('edit', f)">✏️</button>
            <button class="icon-btn delete-btn" title="Delete" @click="$emit('delete', f)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.feature-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(102,126,234,0.15);
}

.feature-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.feature-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.6;
  border-bottom: 2px solid rgba(102,126,234,0.12);
  white-space: nowrap;
}

.feature-row {
  cursor: pointer;
  transition: background 0.15s;
}
.feature-row:hover { background: rgba(102,126,234,0.04); }

.feature-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(102,126,234,0.08);
  vertical-align: middle;
}

.td-num { opacity: 0.55; font-size: 13px; }

.td-title { font-weight: 600; max-width: 220px; }

.empty-row { text-align: center; padding: 40px; opacity: 0.5; }

.status-select {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(102,126,234,0.2);
  cursor: pointer;
  background: inherit;
  color: inherit;
  outline: none;
}
.status-select.status-pending     { color: #616161; }
.status-select.status-in_progress { color: #1565c0; }
.status-select.status-done        { color: #2e7d32; }

.td-actions { display: flex; gap: 6px; }

.icon-btn {
  background: none; border: 1px solid rgba(102,126,234,0.2);
  border-radius: 6px; cursor: pointer; padding: 4px 8px;
  font-size: 12px; transition: all 0.2s; color: inherit;
}
.edit-btn:hover   { background: rgba(33,150,243,0.1); border-color: #2196f3; }
.delete-btn:hover { background: rgba(244,67,54,0.1);  border-color: #f44336; }
</style>
