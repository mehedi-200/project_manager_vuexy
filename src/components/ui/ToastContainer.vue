<script setup lang="ts">
import { useToast } from '@/composables/useToast.ts'

const { toasts, removeToast } = useToast()

const icons: Record<string, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
}
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon">{{ icons[toast.type] }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="removeToast(toast.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  pointer-events: all;
  min-width: 260px;
  max-width: 380px;
  transition: all 0.3s ease;
}

.toast-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
.toast-error   { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
.toast-info    { background: #e3f2fd; color: #1565c0; border: 1px solid #90caf9; }
.toast-warning { background: #fff8e1; color: #f57f17; border: 1px solid #ffe082; }

.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-message { flex: 1; }

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  color: inherit;
  flex-shrink: 0;
}
.toast-close:hover { opacity: 1; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
