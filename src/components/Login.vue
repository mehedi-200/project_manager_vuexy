<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Login</h2>

      <div v-if="errorMsg" class="auth-error">{{ errorMsg }}</div>

      <form class="auth-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="credentials.email"
            placeholder="Enter your email" 
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="credentials.password"
            placeholder="Enter your password" 
            class="form-input"
          />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/authStore.ts'

const store = authStore()
const router = useRouter()
const errorMsg = ref<string | null>(null)
const loading = ref(false)

interface Credentials {
  email: string
  password: string
}

const credentials = reactive<Credentials>({
  email: '',
  password: '',
})

const parseError = (e: any): string => {
  const errors = e.response?.data?.errors
  if (errors) {
    const first = Object.values(errors)[0] as string[]
    return first[0] ?? 'Validation error.'
  }
  if (e.response?.data?.message) return e.response.data.message
  return e.message || 'Something went wrong.'
}

const submitForm = async () => {
  errorMsg.value = null
  loading.value = true
  try {
    await store.login(credentials)
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    errorMsg.value = parseError(e)
  } finally {
    loading.value = false
  }
}
</script>

<style src="../assets/auth.css"></style>
