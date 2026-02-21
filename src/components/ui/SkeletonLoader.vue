<script setup lang="ts">
defineProps<{
  count?: number
  height?: string
}>()
</script>

<template>
  <div class="skeleton-wrapper">
    <div
      v-for="i in (count ?? 3)"
      :key="i"
      class="skeleton-block"
      :style="{ height: height ?? '60px' }"
    ></div>
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-block {
  background: linear-gradient(90deg, rgba(102,126,234,0.08) 25%, rgba(102,126,234,0.18) 50%, rgba(102,126,234,0.08) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 10px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
