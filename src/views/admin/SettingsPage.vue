<script setup lang="ts">
import { useTheme } from '@/composables/useTheme.ts'
const { isDark } = useTheme()
</script>

<template>
  <div :class="['settings-page', { dark: isDark }]">
    <div class="page-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-subtitle">Application preferences</p>
    </div>

    <div class="settings-card">
      <div class="setting-row">
        <div>
          <div class="setting-name">Theme</div>
          <div class="setting-desc">Switch between light and dark mode using the 🌙 / ☀️ toggle in the top navigation bar.</div>
        </div>
        <span class="badge-active">Available</span>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-name">Notifications</div>
          <div class="setting-desc">Email and in-app notification preferences.</div>
        </div>
        <span class="badge-soon">Coming Soon</span>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-name">API Access</div>
          <div class="setting-desc">Manage personal access tokens for third-party integrations.</div>
        </div>
        <span class="badge-soon">Coming Soon</span>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-name">Language & Region</div>
          <div class="setting-desc">Set your preferred language, timezone, and date format.</div>
        </div>
        <span class="badge-soon">Coming Soon</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { padding: 32px; max-width: 640px; }
.page-header { margin-bottom: 28px; }
.page-title { font-size: 26px; font-weight: 800; margin: 0 0 6px; }
.page-subtitle { font-size: 14px; opacity: 0.55; margin: 0; }

.settings-card {
  border-radius: 16px;
  border: 1px solid rgba(102,126,234,0.15);
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  overflow: hidden;
}
.settings-page.dark .settings-card {
  background: #252d40;
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 2px 16px rgba(0,0,0,0.3);
}

.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; gap: 20px;
  border-bottom: 1px solid rgba(102,126,234,0.08);
}
.settings-page.dark .setting-row { border-bottom-color: rgba(255,255,255,0.06); }
.setting-row:last-child { border-bottom: none; }

.setting-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.setting-desc { font-size: 13px; opacity: 0.55; }

.badge-active {
  flex-shrink: 0; padding: 4px 12px; border-radius: 20px;
  background: rgba(72, 199, 142, 0.15); color: #48c78e;
  font-size: 11px; font-weight: 700; white-space: nowrap;
}
.badge-soon {
  flex-shrink: 0; padding: 4px 12px; border-radius: 20px;
  background: rgba(102,126,234,0.1); color: #667eea;
  font-size: 11px; font-weight: 700; white-space: nowrap;
}
</style>

