<script setup lang="ts">
import { useTheme } from '@/composables/useTheme.ts'
defineProps<{
  count?: number
  height?: string
  type?: 'block' | 'card' | 'stat' | 'row' | 'detail'
}>()
const { isDark } = useTheme()
</script>

<template>
  <!-- Project card skeletons -->
  <div v-if="type === 'card'" class="skeleton-grid">
    <div v-for="i in (count ?? 6)" :key="i" :class="['skeleton-card', { dark: isDark }]">
      <!-- Top: name + badge -->
      <div class="sk-row">
        <div :class="['sk', 'sk-title', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-badge', { dark: isDark }]"></div>
      </div>
      <!-- Description lines -->
      <div :class="['sk', 'sk-line', 'w90', { dark: isDark }]"></div>
      <div :class="['sk', 'sk-line', 'w70', { dark: isDark }]"></div>
      <!-- Meta row 1 -->
      <div class="sk-row gap-sm">
        <div :class="['sk', 'sk-meta', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-meta', { dark: isDark }]"></div>
      </div>
      <!-- Meta row 2 -->
      <div class="sk-row gap-sm">
        <div :class="['sk', 'sk-meta', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-meta', { dark: isDark }]"></div>
      </div>
      <!-- Spacer -->
      <div class="sk-spacer"></div>
      <!-- Progress -->
      <div class="sk-progress-wrap">
        <div class="sk-row mb4">
          <div :class="['sk', 'sk-progress-label', { dark: isDark }]"></div>
          <div :class="['sk', 'sk-progress-pct', { dark: isDark }]"></div>
        </div>
        <div :class="['sk', 'sk-progress-bar', { dark: isDark }]"></div>
      </div>
      <!-- Actions -->
      <div :class="['sk-actions', { dark: isDark }]">
        <div :class="['sk', 'sk-btn', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-btn', { dark: isDark }]"></div>
      </div>
    </div>
  </div>

  <!-- Dashboard stat card skeletons -->
  <div v-else-if="type === 'stat'" class="skeleton-stats">
    <div v-for="i in (count ?? 4)" :key="i" :class="['skeleton-stat-card', { dark: isDark }]">
      <div :class="['sk', 'sk-icon-circle', { dark: isDark }]"></div>
      <div class="sk-stat-content">
        <div :class="['sk', 'sk-line', 'w60', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-value', { dark: isDark }]"></div>
      </div>
    </div>
  </div>

  <!-- Table / list row skeletons -->
  <div v-else-if="type === 'row'" class="skeleton-rows">
    <div v-for="i in (count ?? 5)" :key="i" :class="['skeleton-row', { dark: isDark }]">
      <div :class="['sk', 'sk-row-name', { dark: isDark }]"></div>
      <div :class="['sk', 'sk-badge', { dark: isDark }]"></div>
      <div :class="['sk', 'sk-meta', 'w40', { dark: isDark }]"></div>
    </div>
  </div>

  <!-- Detail page skeleton -->
  <div v-else-if="type === 'detail'" class="skeleton-detail">
    <div :class="['sk', 'sk-breadcrumb', { dark: isDark }]"></div>
    <div class="sk-row mt12">
      <div :class="['sk', 'sk-big-title', { dark: isDark }]"></div>
      <div class="sk-row gap8">
        <div :class="['sk', 'sk-btn', { dark: isDark }]"></div>
        <div :class="['sk', 'sk-btn', { dark: isDark }]"></div>
      </div>
    </div>
  </div>

  <!-- Default plain blocks -->
  <div v-else class="skeleton-wrapper">
    <div
      v-for="i in (count ?? 3)"
      :key="i"
      :class="['sk', { dark: isDark }]"
      :style="{ height: height ?? '60px' }"
    ></div>
  </div>
</template>

<style scoped>
/* ── Shimmer base ── */
.sk {
  border-radius: 8px;
  background: linear-gradient(90deg, #e8ecf4 25%, #d0d8ee 50%, #e8ecf4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.sk.dark {
  background: linear-gradient(90deg, #252d40 25%, #2e3a52 50%, #252d40 75%);
  background-size: 200% 100%;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Size tokens ── */
.sk-title        { height: 16px; flex: 1; }
.sk-badge        { height: 22px; width: 58px; border-radius: 20px; flex-shrink: 0; }
.sk-line         { height: 12px; }
.sk-meta         { height: 12px; flex: 1; }
.sk-value        { height: 26px; width: 55%; border-radius: 8px; }
.sk-icon-circle  { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0; }
.sk-btn          { height: 30px; flex: 1; border-radius: 8px; }
.sk-progress-bar { height: 5px; border-radius: 99px; }
.sk-progress-label { height: 10px; width: 55px; }
.sk-progress-pct   { height: 10px; width: 30px; }
.sk-big-title    { height: 30px; flex: 1; max-width: 260px; }
.sk-row-name     { height: 14px; flex: 1; }
.sk-breadcrumb   { height: 12px; width: 200px; margin-bottom: 12px; }

.w90 { width: 90%; }
.w70 { width: 70%; }
.w60 { width: 60%; }
.w40 { width: 40%; }

/* ── Layout helpers ── */
.sk-row   { display: flex; align-items: center; gap: 10px; }
.gap8     { gap: 8px; }
.gap-sm   { gap: 10px; }
.mt12     { margin-top: 12px; }
.mb4      { margin-bottom: 4px; }
.sk-spacer { flex: 1; min-height: 8px; }

/* ── Card skeleton ── */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.skeleton-card {
  background: white;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 260px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.skeleton-card.dark {
  background: #1e2435;
  border-color: rgba(255,255,255,0.07);
  box-shadow: none;
}

.sk-progress-wrap { display: flex; flex-direction: column; gap: 4px; }

.sk-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f9;
}
.sk-actions.dark { border-top-color: rgba(255,255,255,0.07); }

/* ── Stat skeleton ── */
.skeleton-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.skeleton-stat-card {
  background: white;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.skeleton-stat-card.dark {
  background: #1e2435;
  border-color: rgba(255,255,255,0.07);
  box-shadow: none;
}
.sk-stat-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }

/* ── Row skeleton ── */
.skeleton-rows { display: flex; flex-direction: column; gap: 10px; }
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e8ecf4;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.skeleton-row.dark {
  background: #1e2435;
  border-color: rgba(255,255,255,0.07);
  box-shadow: none;
}

/* ── Detail skeleton ── */
.skeleton-detail { display: flex; flex-direction: column; }

/* ── Plain blocks ── */
.skeleton-wrapper { display: flex; flex-direction: column; gap: 12px; }
</style>
