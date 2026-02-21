<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  isSidebarOpen: boolean
  isMobile: boolean
}>()

const emit = defineEmits(['closeSidebar'])
const route = useRoute()
const router = useRouter()

const projectId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})

// Which project tab is active
const activeProjectTab = computed(() => (route.query.tab as string) ?? 'overview')

// Dashboard should only be active on exactly /admin (not /admin/anything)
const isDashboardActive = computed(() => route.name === 'dashboard')

function handleMenuClick() {
  emit('closeSidebar')
}

function goToTab(tab: string) {
  if (!projectId.value) return
  router.push({ path: `/admin/projects/${projectId.value}`, query: { tab } })
  emit('closeSidebar')
}
</script>

<template>
  <aside :class="['admin-sidebar', { open: isSidebarOpen, collapsed: !isSidebarOpen && !isMobile }]">
    <nav class="sidebar-nav">

      <!-- Main -->
      <div class="nav-group">
        <span class="nav-group-label">Main</span>
        <router-link
          to="/admin"
          class="nav-item"
          :class="{ 'router-link-active': isDashboardActive }"
          active-class=""
          exact-active-class=""
          @click="handleMenuClick"
        >
          <span class="nav-icon">📊</span>
          <span class="nav-label">Dashboard</span>
        </router-link>
        <router-link to="/admin/projects" class="nav-item" @click="handleMenuClick">
          <span class="nav-icon">📁</span>
          <span class="nav-label">Projects</span>
        </router-link>
      </div>

      <!-- Current Project (only when inside a project) -->
      <div v-if="projectId" class="nav-group">
        <span class="nav-group-label">Current Project</span>
        <button
          v-for="tab in [
            { key: 'overview',  icon: '📋', label: 'Overview'  },
            { key: 'phases',    icon: '🗂️', label: 'Phases'    },
            { key: 'features',  icon: '🎯', label: 'Features'  },
            { key: 'members',   icon: '👥', label: 'Members'   },
            { key: 'activity',  icon: '📜', label: 'Activity'  },
          ]"
          :key="tab.key"
          class="nav-item nav-btn"
          :class="{ 'router-link-active': activeProjectTab === tab.key }"
          @click="goToTab(tab.key)"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Account -->
      <div class="nav-group">
        <span class="nav-group-label">Account</span>
        <router-link to="/admin/profile" class="nav-item" @click="handleMenuClick">
          <span class="nav-icon">👤</span>
          <span class="nav-label">Profile</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item" @click="handleMenuClick">
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">Settings</span>
        </router-link>
      </div>

    </nav>
  </aside>
</template>

<style scoped>
.nav-group {
  padding: 8px 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}
.nav-group:last-child { border-bottom: none; }

.nav-group-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.4;
  padding: 4px 16px 2px;
  white-space: nowrap;
  overflow: hidden;
}

/* Hide group labels when sidebar is collapsed (icon-only mode) */
.admin-sidebar.collapsed .nav-group-label {
  display: none;
}

/* Button-style nav items (for project tabs) */
.nav-btn {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}
</style>

