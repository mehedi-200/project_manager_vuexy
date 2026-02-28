<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { authStore } from '@/stores/authStore.ts'
import { useTheme } from '@/composables/useTheme.ts'
import { getDashboard } from '@/api/dashboardApi.ts'
import { api } from '@/api/axious.ts'

const store = authStore()
const { isDark } = useTheme()

const stats = ref([
  { icon: '📁', label: 'Total Projects', value: '—', color: '#667eea' },
  { icon: '✅', label: 'Completed',       value: '—', color: '#4caf50' },
  { icon: '⏳', label: 'In Progress',     value: '—', color: '#ff9800' },
  { icon: '🗂️',  label: 'Planning',       value: '—', color: '#f093fb' },
])

onMounted(async () => {
  try {
    const res = await getDashboard()
    const s = res.data.data.stats
    stats.value[0].value = String(s.total_projects ?? 0)
    stats.value[1].value = String(s.completed      ?? 0)
    stats.value[2].value = String(s.in_progress    ?? 0)
    stats.value[3].value = String(s.planning       ?? 0)
  } catch (_) { /* silent */ }
})

const initials = computed(() => {
  const name = store.user?.name ?? ''
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
})

const editMode  = ref(false)
const saving    = ref(false)
const saveMsg   = ref('')
const editName  = ref('')
const editEmail = ref('')

function openEdit() {
  editName.value  = store.user?.name  ?? ''
  editEmail.value = store.user?.email ?? ''
  saveMsg.value   = ''
  editMode.value  = true
}

async function saveProfile() {
  saving.value = true; saveMsg.value = ''
  try {
    const res = await api.put('/admin/profile', { name: editName.value, email: editEmail.value })
    const updated = res.data.data ?? res.data
    store.user = { ...store.user, ...updated }
    localStorage.setItem('user', JSON.stringify(store.user))
    saveMsg.value  = '✅ Profile updated!'
    editMode.value = false
  } catch (e: any) {
    saveMsg.value = e?.response?.data?.message ?? '❌ Failed to update.'
  } finally { saving.value = false }
}

const pwCurrent = ref(''); const pwNew = ref(''); const pwConfirm = ref('')
const pwSaving  = ref(false); const pwMsg = ref('')

async function changePassword() {
  if (pwNew.value !== pwConfirm.value) { pwMsg.value = '❌ Passwords do not match.'; return }
  pwSaving.value = true; pwMsg.value = ''
  try {
    await api.put('/admin/password', { current_password: pwCurrent.value, password: pwNew.value, password_confirmation: pwConfirm.value })
    pwMsg.value = '✅ Password changed!'
    pwCurrent.value = pwNew.value = pwConfirm.value = ''
  } catch (e: any) {
    pwMsg.value = e?.response?.data?.message ?? '❌ Failed to change password.'
  } finally { pwSaving.value = false }
}

const roleLabel  = computed(() => { const r = store.user?.role; return r ? r.charAt(0).toUpperCase() + r.slice(1) : 'Admin' })
const joinedDate = computed(() => { const d = store.user?.created_at; return d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null })
</script>

<template>
  <div class="profile-page">

    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Manage your account information and security settings.</p>
      </div>
      <button v-if="!editMode" class="btn-primary" @click="openEdit">✏️ Edit Profile</button>
    </div>

    <!-- Top: avatar card + stats -->
    <div class="top-grid">

      <!-- Avatar card -->
      <div class="profile-card">
        <div class="avatar-banner"></div>
        <div class="avatar-body">
          <div class="avatar-circle">{{ initials }}</div>
          <h2 class="av-name">{{ store.user?.name ?? 'User' }}</h2>
          <p class="av-email">{{ store.user?.email ?? '' }}</p>
          <span class="role-badge">{{ roleLabel }}</span>
          <div v-if="joinedDate" class="av-joined">Member since {{ joinedDate }}</div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card">
          <div class="stat-icon" :style="{ background: s.color + '20', color: s.color }">{{ s.icon }}</div>
          <div class="stat-content">
            <p class="stat-title">{{ s.label }}</p>
            <h2 class="stat-value">{{ s.value }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Account info -->
    <div class="section-card">
      <div class="card-header">
        <h3 class="card-title">👤 Account Information</h3>
      </div>
      <div class="card-body">
        <template v-if="!editMode">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ store.user?.name ?? '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value">{{ store.user?.email ?? '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Role</span>
              <span class="info-value">{{ roleLabel }}</span>
            </div>
            <div v-if="joinedDate" class="info-item">
              <span class="info-label">Member Since</span>
              <span class="info-value">{{ joinedDate }}</span>
            </div>
          </div>
          <p v-if="saveMsg" class="feedback-msg">{{ saveMsg }}</p>
        </template>
        <template v-else>
          <form class="edit-form" @submit.prevent="saveProfile">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input v-model="editName" class="form-input" type="text" placeholder="Your name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input v-model="editEmail" class="form-input" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <p v-if="saveMsg" class="feedback-msg">{{ saveMsg }}</p>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save Changes' }}</button>
              <button type="button" class="btn-ghost" @click="editMode = false">Cancel</button>
            </div>
          </form>
        </template>
      </div>
    </div>

    <!-- Change password -->
    <div class="section-card">
      <div class="card-header">
        <h3 class="card-title">🔒 Change Password</h3>
      </div>
      <div class="card-body">
        <form class="edit-form" @submit.prevent="changePassword">
          <div class="form-group" style="max-width:360px">
            <label class="form-label">Current Password</label>
            <input v-model="pwCurrent" class="form-input" type="password" placeholder="••••••••" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input v-model="pwNew" class="form-input" type="password" placeholder="••••••••" required minlength="8" />
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <input v-model="pwConfirm" class="form-input" type="password" placeholder="••••••••" required minlength="8" />
            </div>
          </div>
          <p v-if="pwMsg" class="feedback-msg">{{ pwMsg }}</p>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="pwSaving">{{ pwSaving ? 'Updating…' : 'Update Password' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="section-card danger-card">
      <div class="card-header">
        <h3 class="card-title" style="color:#ef4444">⚠️ Danger Zone</h3>
      </div>
      <div class="card-body danger-row">
        <div>
          <div class="danger-title">Delete Account</div>
          <div class="danger-desc">Permanently delete your account and all associated data. This cannot be undone.</div>
        </div>
        <button class="btn-danger" disabled title="Coming soon">Delete Account</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Page ─────────────────────────────────────────────────────────────────── */
.profile-page { width: 100%; max-width: 1400px; }

.page-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
}
.page-title    { font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
.page-subtitle { font-size: 1rem; opacity: 0.7; }

/* ── Top grid ─────────────────────────────────────────────────────────────── */
.top-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  margin-bottom: 24px;
  align-items: start;
}

/* ── Avatar card ──────────────────────────────────────────────────────────── */
.profile-card {
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px; overflow: hidden;
}

.avatar-banner {
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f093fb 100%);
}

.avatar-body {
  display: flex; flex-direction: column; align-items: center;
  padding: 0 20px 24px; text-align: center;
}

.avatar-circle {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff; font-size: 26px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin-top: -36px;
  border: 3px solid;
  border-color: white;
  box-shadow: 0 4px 14px rgba(102,126,234,0.3);
  flex-shrink: 0;
}

.av-name   { font-size: 16px; font-weight: 700; margin: 12px 0 3px; }
.av-email  { font-size: 12px; opacity: 0.55; margin: 0 0 10px; word-break: break-all; }
.av-joined { font-size: 11px; opacity: 0.45; margin-top: 10px; }

.role-badge {
  display: inline-block; padding: 3px 12px; border-radius: 20px;
  background: rgba(102,126,234,0.12); color: #667eea;
  font-size: 11px; font-weight: 700;
}

/* ── Stats ────────────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px; padding: 20px;
  display: flex; gap: 16px;
  transition: all 0.3s ease;
}
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(102,126,234,0.15); }

.stat-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
}
.stat-title { font-size: 13px; opacity: 0.7; margin-bottom: 6px; }
.stat-value { font-size: 28px; font-weight: 700; }

/* ── Section cards (same style as dashboard) ──────────────────────────────── */
.section-card {
  border: 1px solid rgba(102,126,234,0.2);
  border-radius: 12px; margin-bottom: 24px; overflow: hidden;
}

.card-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(102,126,234,0.2);
}
.card-title { font-size: 16px; font-weight: 600; }
.card-body  { padding: 24px; }

/* ── Info grid ────────────────────────────────────────────────────────────── */
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.info-item { display: flex; flex-direction: column; gap: 5px; }
.info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; opacity: 0.4; }
.info-value { font-size: 15px; font-weight: 600; }

/* ── Form ─────────────────────────────────────────────────────────────────── */
.edit-form   { display: flex; flex-direction: column; gap: 16px; }
.form-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group  { display: flex; flex-direction: column; gap: 6px; }
.form-label  { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.5; }
.form-input  {
  padding: 10px 14px; border-radius: 10px; font-size: 14px;
  border: 1.5px solid rgba(102,126,234,0.2);
  background: rgba(102,126,234,0.04); color: inherit;
  outline: none; transition: border-color 0.2s, background 0.2s;
}
.form-input:focus { border-color: #667eea; background: transparent; }
.form-actions { display: flex; gap: 12px; align-items: center; }

/* ── Buttons ──────────────────────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 22px; border-radius: 10px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff; font-size: 14px; font-weight: 600;
  box-shadow: 0 4px 15px rgba(102,126,234,0.3);
  transition: all 0.3s ease;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.4); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  padding: 10px 18px; border-radius: 10px;
  border: 1.5px solid rgba(102,126,234,0.2);
  background: transparent; cursor: pointer; font-size: 13px; font-weight: 600;
  color: inherit; transition: background 0.2s;
}
.btn-ghost:hover { background: rgba(102,126,234,0.07); }

.feedback-msg { font-size: 13px; font-weight: 600; margin: 0; }

/* ── Danger zone ──────────────────────────────────────────────────────────── */
.danger-card { border-color: rgba(239,68,68,0.2); }
.danger-card .card-header { border-bottom-color: rgba(239,68,68,0.1); }

.danger-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.danger-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.danger-desc  { font-size: 13px; opacity: 0.55; }

.btn-danger {
  flex-shrink: 0; padding: 9px 18px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid rgba(239,68,68,0.4);
  background: rgba(239,68,68,0.08); color: #ef4444;
  font-size: 13px; font-weight: 700; transition: background 0.2s;
}
.btn-danger:hover:not(:disabled) { background: rgba(239,68,68,0.15); }
.btn-danger:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .top-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .btn-primary { width: 100%; justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .form-row   { grid-template-columns: 1fr; }
  .danger-row { flex-direction: column; align-items: flex-start; }
}
</style>

