<script setup lang="ts">
const props = defineProps<{
  type: 'priority' | 'status' | 'role' | 'feature-status' | 'feature-priority'
  value: string | number
}>()

function label(v: string | number): string {
  if (props.type === 'status' && typeof v === 'number') return v === 1 ? 'Active' : 'Inactive'
  if (props.type === 'feature-status') return v === 1 ? 'Pending' : v === 2 ? 'In Progress' : 'Completed'
  if (props.type === 'feature-priority') return v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'
  return String(v).replace('_', ' ')
}

function cls(v: string | number): string {
  if (props.type === 'status' && typeof v === 'number') return `badge-status-${v === 1 ? 'active' : 'inactive'}`
  if (props.type === 'feature-status') return v === 1 ? 'badge-fs-pending' : v === 2 ? 'badge-fs-inprogress' : 'badge-fs-completed'
  if (props.type === 'feature-priority') return v === 1 ? 'badge-fp-low' : v === 2 ? 'badge-fp-medium' : 'badge-fp-high'
  return `badge-${props.type}-${String(v).replace('_', '-')}`
}
</script>

<template>
  <span :class="['badge', cls(value)]">{{ label(value) }}</span>
</template>

<style scoped>
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; white-space: nowrap; }
.badge-priority-low    { background: rgba(76,175,80,0.15);  color: #388e3c; }
.badge-priority-medium { background: rgba(255,152,0,0.15);  color: #e65100; }
.badge-priority-high   { background: rgba(244,67,54,0.15);  color: #c62828; }
.badge-status-pending     { background: rgba(158,158,158,0.15); color: #616161; }
.badge-status-in-progress { background: rgba(33,150,243,0.15);  color: #1565c0; }
.badge-status-done        { background: rgba(76,175,80,0.15);   color: #2e7d32; }
.badge-role-admin     { background: rgba(156,39,176,0.15);  color: #7b1fa2; }
.badge-role-manager   { background: rgba(33,150,243,0.15);  color: #1565c0; }
.badge-role-developer { background: rgba(0,150,136,0.15);   color: #00695c; }
.badge-role-viewer    { background: rgba(158,158,158,0.15); color: #616161; }
.badge-status-active    { background: rgba(33,150,243,0.15); color: #1565c0; }
.badge-status-inactive  { background: rgba(158,158,158,0.15); color: #616161; }
.badge-status-completed { background: rgba(76,175,80,0.15);  color: #2e7d32; }
.badge-status-archived  { background: rgba(158,158,158,0.15); color: #616161; }
.badge-fs-pending    { background: rgba(158,158,158,0.15); color: #616161; }
.badge-fs-inprogress { background: rgba(33,150,243,0.15);  color: #1565c0; }
.badge-fs-completed  { background: rgba(76,175,80,0.15);   color: #2e7d32; }
.badge-fp-low    { background: rgba(76,175,80,0.15);  color: #388e3c; }
.badge-fp-medium { background: rgba(255,152,0,0.15);  color: #e65100; }
.badge-fp-high   { background: rgba(244,67,54,0.15);  color: #c62828; }
</style>
