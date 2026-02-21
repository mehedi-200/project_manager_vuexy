<script setup lang="ts">
import { useRoute,useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { authStore as useAuthStore } from '../stores/authStore'
const router = useRouter();
const authStore = useAuthStore();
const isDark = ref(false)

// Load theme preference from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

// Watch for theme changes and save to localStorage
watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <div :class="['layout', { dark: isDark }]">
    <header class="header">
      <div class="container">
        <router-link class="logo" to="/">Project Manager</router-link>
        <nav class="nav">
          <router-link to="/">Home</router-link>
          <div v-if="authStore.isLoggedIn" @click="router.push('/admin')">Dashboard</div>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <span v-if="!isDark">🌙</span>
            <span v-else>☀️</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 Project Manager. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style src="../assets/layout.css"></style>
