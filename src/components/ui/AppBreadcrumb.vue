<script setup lang="ts">
defineProps<{
  items: { label: string; to?: string }[]
}>()
</script>

<template>
  <nav class="breadcrumb">
    <template v-for="(item, i) in items" :key="i">
      <router-link v-if="item.to" :to="item.to" class="breadcrumb-link">{{ item.label }}</router-link>
      <span v-else class="breadcrumb-current">{{ item.label }}</span>
      <span v-if="i < items.length - 1" class="breadcrumb-sep">›</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.breadcrumb-link:hover { opacity: 0.75; text-decoration: underline; }

.breadcrumb-sep { opacity: 0.4; font-size: 16px; }

.breadcrumb-current { opacity: 0.65; font-weight: 500; }
</style>
