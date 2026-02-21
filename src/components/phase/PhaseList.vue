<script setup lang="ts">
import type { Phase } from '@/types/index.ts'

const props = defineProps<{
  phases: Phase[]
  canEdit?: boolean
  canDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', phase: Phase): void
  (e: 'delete', phase: Phase): void
  (e: 'move', id: number, direction: 'up' | 'down'): void
}>()

const sorted = () => [...props.phases].sort((a, b) => a.order_number - b.order_number)
</script>

<template>
  <div class="phase-list">
    <div v-if="phases.length === 0" class="empty-phases">
      No phases yet. Add your first phase!
    </div>
    <div v-for="(phase, idx) in sorted()" :key="phase.id" class="phase-card">
      <div class="phase-order">{{ phase.order_number }}</div>
      <div class="phase-info">
        <span class="phase-name">{{ phase.name }}</span>
      </div>
      <div class="phase-actions">
        <button
          class="icon-btn"
          title="Move Up"
          :disabled="idx === 0"
          @click="$emit('move', phase.id, 'up')"
        >↑</button>
        <button
          class="icon-btn"
          title="Move Down"
          :disabled="idx === sorted().length - 1"
          @click="$emit('move', phase.id, 'down')"
        >↓</button>
        <button v-if="canEdit" class="icon-btn edit-btn" title="Edit" @click="$emit('edit', phase)">✏️</button>
        <button v-if="canDelete" class="icon-btn delete-btn" title="Delete" @click="$emit('delete', phase)">🗑️</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phase-list { display: flex; flex-direction: column; gap: 10px; }

.empty-phases {
  text-align: center; padding: 40px; opacity: 0.5; font-size: 15px;
}

.phase-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 10px;
  transition: all 0.2s ease;
}
.phase-card:hover { background: rgba(102,126,234,0.04); border-color: rgba(102,126,234,0.35); }

.phase-order {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}

.phase-info { flex: 1; }
.phase-name { font-size: 15px; font-weight: 600; }

.phase-actions { display: flex; gap: 6px; align-items: center; }

.icon-btn {
  background: none; border: 1px solid rgba(102,126,234,0.2);
  border-radius: 6px; cursor: pointer; padding: 5px 9px;
  font-size: 13px; transition: all 0.2s; color: inherit;
}
.icon-btn:hover:not(:disabled) { background: rgba(102,126,234,0.1); border-color: #667eea; }
.icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.edit-btn:hover:not(:disabled) { background: rgba(33,150,243,0.1); border-color: #2196f3; }
.delete-btn:hover:not(:disabled) { background: rgba(244,67,54,0.1); border-color: #f44336; }
</style>
