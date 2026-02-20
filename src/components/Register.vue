<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Register</h2>

      <div v-if="errorMsg" class="auth-error">{{ errorMsg }}</div>

      <form class="auth-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="user.name"
            placeholder="Enter your name"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter your email"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            v-model="user.password"
            placeholder="Enter new password"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="user.password_confirmation"
            placeholder="Confirm your password"
            class="form-input"
          />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authStore } from '@/stores/authStore.ts'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = authStore()
const router = useRouter()
const errorMsg = ref<string | null>(null)
const loading = ref(false)

interface User {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const user = reactive<User>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
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
    await store.register(user)
    router.push({ name: 'login' })
  } catch (e: any) {
    errorMsg.value = parseError(e)
  } finally {
    loading.value = false
  }
}
</script>

<style src="../assets/auth.css"></style>
