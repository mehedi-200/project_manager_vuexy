<template>
  <div :class="['error-page', { dark: isDark }]">
    <div class="error-card">
      <div class="error-code">403</div>
      <div class="error-icon">🔒</div>
      <h1 class="error-title">Access Denied</h1>
      <p class="error-message">You need to be logged in to access this page.</p>
      <div class="error-actions">
        <button class="btn-primary" @click="router.push('/login')">Login</button>
        <button class="btn-secondary" @click="router.push('/')">Go Home</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme') || localStorage.getItem('admin-theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.error-page.dark {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.error-card {
  text-align: center;
  max-width: 480px;
  width: 100%;
  padding: 60px 40px;
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.error-page.dark .error-card {
  background-color: #2d2d2d;
  border-color: #404040;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.error-code {
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #f44336 0%, #ff5722 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.error-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.error-message {
  font-size: 1rem;
  margin-bottom: 36px;
  line-height: 1.6;
  color: #666;
}

.error-page.dark .error-message {
  color: #aaa;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 12px 28px;
  background: linear-gradient(135deg, #f44336 0%, #ff5722 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.45);
}

.btn-secondary {
  padding: 12px 28px;
  background: transparent;
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.4);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-page.dark .btn-secondary {
  color: #ff7961;
  border-color: rgba(255, 121, 97, 0.4);
}

.btn-secondary:hover {
  background: rgba(244, 67, 54, 0.1);
  border-color: #f44336;
  transform: translateY(-2px);
}

.error-page.dark .btn-secondary:hover {
  background: rgba(255, 121, 97, 0.12);
  border-color: #ff7961;
}
</style>
