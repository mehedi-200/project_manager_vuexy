<script setup lang="ts">
import type { Feature } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps<{
  features: Feature[]
  filterStatus?: string
  filterPriority?: string
  canEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', feature: Feature): void
  (e: 'delete', feature: Feature): void
  (e: 'status-change', id: number, statusValue: number): void
  (e: 'open', feature: Feature): void
  (e: 'reorder', id: number, direction: 'up' | 'down'): void
}>()

function sorted() {
  return [...props.features].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
}

function filtered() {
  return sorted().filter(f => {
    if (props.filterStatus && f.status.value !== Number(props.filterStatus)) return false
    if (props.filterPriority && f.priority.value !== Number(props.filterPriority)) return false
    return true
  })
}

function isFirst(f: Feature) {
  const s = sorted()
  return s[0]?.id === f.id
}

function isLast(f: Feature) {
  const s = sorted()
  return s[s.length - 1]?.id === f.id
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="feature-table-wrap">
    <table class="feature-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Start</th>
          <th>End</th>
          <th>Est. Hours</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filtered().length === 0">
          <td colspan="8" class="empty-row">No features found</td>
        </tr>
        <tr v-for="f in filtered()" :key="f.id" class="feature-row" @click="$emit('open', f)">
          <td class="td-order" @click.stop>
            <div class="order-cell">
              <span class="order-num">{{ f.order ?? '—' }}</span>
              <div v-if="canEdit" class="order-btns">
                <button class="order-btn" :disabled="isFirst(f)" title="Move up" @click="$emit('reorder', f.id, 'up')">▲</button>
                <button class="order-btn" :disabled="isLast(f)" title="Move down" @click="$emit('reorder', f.id, 'down')">▼</button>
              </div>
            </div>
          </td>
          <td class="td-title">
            <div class="title-cell">
              <span class="feature-title">{{ f.title }}</span>
              <span v-if="f.description" class="feature-desc">{{ f.description }}</span>
            </div>
          </td>
          <td @click.stop><Badge type="feature-priority" :value="f.priority.value" /></td>
          <td @click.stop>
            <select
              :value="f.status.value"
              class="status-select"
              :class="`status-v${f.status.value}`"
              :disabled="!canEdit"
              @change="$emit('status-change', f.id, Number(($event.target as HTMLSelectElement).value))"
            >
              <option :value="1">⏳ Pending</option>
              <option :value="2">🔄 In Progress</option>
              <option :value="3">✅ Completed</option>
            </select>
          </td>
          <td>{{ formatDate(f.start_date) }}</td>
          <td>{{ formatDate(f.end_date) }}</td>
          <td>{{ f.estimated_hours != null ? f.estimated_hours + 'h' : '—' }}</td>
          <td class="td-actions" @click.stop>
            <button class="icon-btn edit-btn" title="Edit" @click="$emit('edit', f)">✏️</button>
            <button class="icon-btn delete-btn" title="Delete" @click="$emit('delete', f)">🗑️</button>
            <button class="icon-btn view-btn" title="View details" @click="$emit('open', f)">👁️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.feature-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid rgba(102,126,234,0.15); }

.feature-table { width: 100%; border-collapse: collapse; font-size: 14px; }

.feature-table th {
  padding: 12px 14px; text-align: left; font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.6;
  border-bottom: 2px solid rgba(102,126,234,0.12); white-space: nowrap;
}

.feature-row { cursor: pointer; transition: background 0.15s; }
.feature-row:hover { background: rgba(102,126,234,0.04); }

.feature-table td { padding: 12px 14px; border-bottom: 1px solid rgba(102,126,234,0.08); vertical-align: middle; }

.td-order { width: 80px; }
.order-cell { display: flex; align-items: center; gap: 6px; }
.order-num { font-weight: 700; font-size: 13px; opacity: 0.6; min-width: 20px; }
.order-btns { display: flex; flex-direction: column; gap: 2px; }
.order-btn {
  background: none; border: 1px solid rgba(102,126,234,0.2); border-radius: 4px;
  cursor: pointer; padding: 1px 5px; font-size: 9px; line-height: 1.4; color: #667eea; transition: all 0.15s;
}
.order-btn:hover:not(:disabled) { background: rgba(102,126,234,0.15); border-color: #667eea; }
.order-btn:disabled { opacity: 0.25; cursor: not-allowed; }

.td-title { max-width: 260px; }
.title-cell { display: flex; flex-direction: column; gap: 2px; }
.feature-title { font-weight: 600; }
.feature-desc { font-size: 12px; opacity: 0.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }

.empty-row { text-align: center; padding: 40px; opacity: 0.5; }

.status-select {
  padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(102,126,234,0.2); cursor: pointer; background: inherit; color: inherit; outline: none;
}
.status-select:disabled { opacity: 0.7; cursor: default; }
.status-select.status-v1 { background: rgba(158,158,158,0.12); color: #616161; border-color: rgba(158,158,158,0.3); }
.status-select.status-v2 { background: rgba(33,150,243,0.12);  color: #1565c0; border-color: rgba(33,150,243,0.3); }
.status-select.status-v3 { background: rgba(76,175,80,0.12);   color: #2e7d32; border-color: rgba(76,175,80,0.3); }

.td-actions { display: flex; gap: 6px; align-items: center; }
.icon-btn { background: none; border: 1px solid rgba(102,126,234,0.2); border-radius: 6px; cursor: pointer; padding: 4px 8px; font-size: 12px; transition: all 0.2s; color: inherit; }
.edit-btn:hover   { background: rgba(33,150,243,0.1); border-color: #2196f3; }
.delete-btn:hover { background: rgba(244,67,54,0.1);  border-color: #f44336; }
.view-btn:hover   { background: rgba(102,126,234,0.1); border-color: #667eea; }
</style>
