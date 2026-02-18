<script setup lang="ts">
defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggleTheme: []
  toggleSidebar: []
}>()
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="emit('toggleSidebar')">
        <span>☰</span>
      </button>
      <h1 class="admin-title">Project Manager Admin</h1>
    </div>
    <div class="header-right">
      <button 
        class="theme-toggle" 
        @click="emit('toggleTheme')" 
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <span v-if="!isDark">🌙</span>
        <span v-else>☀️</span>
      </button>
      <div class="user-profile">
        <span class="user-avatar">👤</span>
        <span class="user-name">Admin</span>
      </div>
    </div>
  </header>
</template>
