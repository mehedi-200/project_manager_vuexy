<script setup lang="ts">
defineProps<{
  isSidebarOpen: boolean
  isMobile: boolean
}>()

const emit = defineEmits(['closeSidebar'])

const handleMenuClick = () => {
  emit('closeSidebar')
}
</script>

<template>
  <aside :class="['admin-sidebar', { open: isSidebarOpen, collapsed: !isSidebarOpen && !isMobile }]">
    <nav class="sidebar-nav">
      <router-link to="/admin/dashboard" class="nav-item" @click="handleMenuClick">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Dashboard</span>
      </router-link>
      <router-link to="/admin/projects" class="nav-item" @click="handleMenuClick">
        <span class="nav-icon">📁</span>
        <span class="nav-label">Projects</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
</style>
