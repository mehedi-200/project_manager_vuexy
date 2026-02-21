<script setup lang="ts">
import { authStore } from '@/stores/authStore.ts'
import { useTheme } from '@/composables/useTheme.ts'

const store = authStore()
const { isDark } = useTheme()
</script>

<template>
  <div :class="['profile-page', { dark: isDark }]">
    <div class="page-header">
      <h1 class="page-title">👤 Profile</h1>
      <p class="page-subtitle">Your account information</p>
    </div>

    <div class="profile-card">
      <div class="avatar">{{ store.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}</div>
      <div class="profile-info">
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">{{ store.user?.name ?? '—' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">{{ store.user?.email ?? '—' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role</span>
          <span class="info-value">Admin</span>
        </div>
      </div>
    </div>

    <div class="profile-card" style="margin-top: 20px;">
      <div class="section-title">🔒 Security</div>
      <p class="section-desc">Password management and two-factor authentication coming soon.</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page { padding: 32px; max-width: 640px; }

.page-header { margin-bottom: 28px; }
.page-title { font-size: 26px; font-weight: 800; margin: 0 0 6px; }
.page-subtitle { font-size: 14px; opacity: 0.55; margin: 0; }

.profile-card {
  display: flex; align-items: flex-start; gap: 24px;
  padding: 28px; border-radius: 16px;
  border: 1px solid rgba(102,126,234,0.15);
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.profile-page.dark .profile-card {
  background: #252d40;
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 2px 16px rgba(0,0,0,0.3);
}

.avatar {
  width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: white; font-size: 28px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.profile-info { display: flex; flex-direction: column; gap: 16px; flex: 1; }
.info-row { display: flex; flex-direction: column; gap: 4px; }
.info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.45; }
.info-value { font-size: 15px; font-weight: 600; }

.section-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.section-desc { font-size: 14px; opacity: 0.55; margin: 0; }
</style>

