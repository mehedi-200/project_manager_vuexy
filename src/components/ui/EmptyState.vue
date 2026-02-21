<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  message?: string
  actionLabel?: string
}>()

defineEmits<{ (e: 'action'): void }>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon ?? '📭' }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="message" class="empty-message">{{ message }}</p>
    <button v-if="actionLabel" class="empty-action" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.7; }
.empty-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.empty-message { font-size: 15px; opacity: 0.6; margin-bottom: 24px; max-width: 360px; line-height: 1.5; }

.empty-action {
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.empty-action:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
</style>
