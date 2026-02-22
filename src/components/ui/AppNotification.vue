<script setup lang="ts">
import { useToast } from '@/composables/useToast.ts'

const { toasts, removeToast } = useToast()

const icons: Record<string, string> = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
}

const titles: Record<string, string> = {
  success: 'Success',
  error:   'Error',
  info:    'Info',
  warning: 'Warning',
}
</script>

<template>
  <teleport to="body">
    <div class="notification-wrap">
      <transition-group name="notif" tag="div" class="notification-list">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['notif', `notif-${t.type}`]"
        >
          <div class="notif-icon">{{ icons[t.type] }}</div>
          <div class="notif-body">
            <div class="notif-title">{{ titles[t.type] }}</div>
            <div class="notif-msg">{{ t.message }}</div>
          </div>
          <button class="notif-close" @click="removeToast(t.id)">✕</button>
          <div class="notif-progress" :style="{ animationDuration: '3000ms' }"></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped>
.notification-wrap {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;
  pointer-events: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.notif {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.14);
  position: relative;
  overflow: hidden;
  pointer-events: all;
  border-left: 4px solid transparent;
}

.notif-success { background: #f0fdf4; border-left-color: #22c55e; color: #166534; }
.notif-error   { background: #fef2f2; border-left-color: #ef4444; color: #991b1b; }
.notif-info    { background: #eff6ff; border-left-color: #3b82f6; color: #1e40af; }
.notif-warning { background: #fffbeb; border-left-color: #f59e0b; color: #92400e; }

.notif-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }

.notif-body { flex: 1; min-width: 0; }
.notif-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
.notif-msg   { font-size: 13px; line-height: 1.4; opacity: 0.85; word-break: break-word; }

.notif-close {
  background: none; border: none; cursor: pointer;
  font-size: 13px; opacity: 0.5; padding: 2px 4px;
  border-radius: 4px; color: inherit; flex-shrink: 0;
  margin-top: -2px;
}
.notif-close:hover { opacity: 1; background: rgba(0,0,0,0.07); }

/* Auto-close progress bar */
.notif-progress {
  position: absolute;
  bottom: 0; left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: shrink linear forwards;
}
@keyframes shrink {
  from { width: 100%; }
  to   { width: 0%; }
}

/* Transition */
.notif-enter-active { transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1); }
.notif-leave-active { transition: all 0.2s ease-in; position: absolute; }
.notif-enter-from   { opacity: 0; transform: translateX(60px) scale(0.9); }
.notif-leave-to     { opacity: 0; transform: translateX(60px); }
.notif-move         { transition: transform 0.3s ease; }
</style>
