<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

const emit = defineEmits(['myFunction', 'isSiderbar'])

// Load theme preference from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('admin-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    emit('myFunction', isDark.value)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    emit('myFunction', isDark.value)
  }
})

// Watch for theme changes and save to localStorage
watch(isDark, (newValue) => {
  localStorage.setItem('admin-theme', newValue ? 'dark' : 'light')
  emit('myFunction', newValue)
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const toggleSidebar = () => {
  emit('isSiderbar', true)
}
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <span>☰</span>
      </button>
      <h1 class="admin-title">Project Manager Admin</h1>
    </div>
    <div class="header-right">
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
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

<style scoped>
</style>
