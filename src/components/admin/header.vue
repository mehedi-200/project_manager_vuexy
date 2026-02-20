<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/authStore.ts'

const store = authStore()
const router = useRouter()
const isDark = ref(false)

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

watch(isDark, (newValue) => {
  localStorage.setItem('admin-theme', newValue ? 'dark' : 'light')
  emit('myFunction', newValue)
})

const emit = defineEmits(['myFunction', 'isSiderbar'])

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const toggleSidebar = () => {
  emit('isSiderbar', true)
}

const handleLogout = async () => {
  await store.logout()
  router.push({ name: 'login' })
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
        <span class="user-name">{{ store.user?.name ?? 'Admin' }}</span>
        <button class="logout-btn" @click="handleLogout" title="Logout">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(244, 67, 54, 0.12);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.logout-btn:hover {
  background: rgba(244, 67, 54, 0.22);
  border-color: #f44336;
}
</style>
