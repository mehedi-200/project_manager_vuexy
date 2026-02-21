<script setup lang="ts">
defineProps<{
  type: 'priority' | 'status' | 'role'
  value: string
}>()
</script>

<template>
  <span :class="['badge', `badge-${type}-${value.replace('_', '-')}`]">
    {{ value.replace('_', ' ') }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

/* Priority */
.badge-priority-low    { background: rgba(76,175,80,0.15);  color: #388e3c; }
.badge-priority-medium { background: rgba(255,152,0,0.15);  color: #e65100; }
.badge-priority-high   { background: rgba(244,67,54,0.15);  color: #c62828; }

/* Status */
.badge-status-pending     { background: rgba(158,158,158,0.15); color: #616161; }
.badge-status-in-progress { background: rgba(33,150,243,0.15);  color: #1565c0; }
.badge-status-done        { background: rgba(76,175,80,0.15);   color: #2e7d32; }

/* Role */
.badge-role-admin     { background: rgba(156,39,176,0.15);  color: #7b1fa2; }
.badge-role-manager   { background: rgba(33,150,243,0.15);  color: #1565c0; }
.badge-role-developer { background: rgba(0,150,136,0.15);   color: #00695c; }
.badge-role-viewer    { background: rgba(158,158,158,0.15); color: #616161; }

/* Project Status */
.badge-status-active    { background: rgba(33,150,243,0.15); color: #1565c0; }
.badge-status-completed { background: rgba(76,175,80,0.15);  color: #2e7d32; }
.badge-status-archived  { background: rgba(158,158,158,0.15); color: #616161; }
</style>
