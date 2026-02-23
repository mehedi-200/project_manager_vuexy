<script setup lang="ts">
import Header from '@/components/admin/header.vue'
import Sidebar from '@/components/admin/sidebar.vue'
import Footer from '@/components/admin/footer.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AppNotification from '@/components/ui/AppNotification.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme.ts'

const { isDark, setDark } = useTheme()
const isSidebarOpen = ref(false)
const isMobile = ref(false)

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = true
  } else {
    isSidebarOpen.value = false
  }
}

const darkFunction = (dark: boolean) => {
  setDark(dark)
}

const sideBarOpen = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleOutsideClick = (event: MouseEvent) => {
  const sidebar = document.querySelector('.admin-sidebar')
  const sidebarToggle = document.querySelector('.sidebar-toggle')
  
  if (isMobile.value && isSidebarOpen.value) {
    if (sidebar && !sidebar.contains(event.target as Node) && 
        sidebarToggle && !sidebarToggle.contains(event.target as Node)) {
      isSidebarOpen.value = false
    }
  }
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}
</script>

<template>
  <div :class="['admin-layout', { dark: isDark }]" @click="handleOutsideClick">
    <Header @myFunction="darkFunction" @isSiderbar="sideBarOpen"/>
    
    <div class="admin-content-wrapper">
      <Sidebar 
        :isSidebarOpen="isSidebarOpen" 
        :isMobile="isMobile"
        @closeSidebar="closeSidebarOnMobile"
      />

      <div v-if="isMobile && isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>

      <main :class="['admin-main', { 'sidebar-collapsed': !isSidebarOpen }]">
        <router-view style="flex:1;display:flex;flex-direction:column;"></router-view>
      </main>
    </div>

    <Footer/>
    <ConfirmModal />
    <AppNotification />
  </div>
</template>

<style src="../assets/admin_layout.css"></style>
