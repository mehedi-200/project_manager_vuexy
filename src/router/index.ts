import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import F_layout from '@/layouts/f_layout.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import admin_layout from '@/layouts/admin_layout.vue'
import dashboard from '@/views/admin/dashboard.vue'
import NotFound from '@/views/NotFound.vue'
import Forbidden from '@/views/Forbidden.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'F_layout',
      component: F_layout,
      children:[
        {
          path:'',
          name:'home',
          component:HomeView
        },
        {
          path:'login',
          name:'login',
          component:Login
        },
        {
          path:'register',
          name:'register',
          component:Register
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin_layout',
      component: admin_layout,
      meta: { requiresAuth: true },
      children:[
        {
          path:'',
          name:'dashboard',
          component:dashboard
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/views/admin/projects/ProjectListPage.vue')
        },
        {
          path: 'projects/:id',
          name: 'project-details',
          component: () => import('@/views/admin/projects/ProjectDetailsPage.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          meta: { requiresAuth: true },
          component: () => import('@/views/admin/ProfilePage.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          meta: { requiresAuth: true },
          component: () => import('@/views/admin/SettingsPage.vue')
        },
      ]
    },
    {
      path: '/403',
      name: 'forbidden',
      component: Forbidden
    },
    // Catch-all — must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'forbidden' })
  } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
