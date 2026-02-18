import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import F_layout from '@/layouts/f_layout.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import admin_layout from '@/layouts/admin_layout.vue'
import dashboard from '@/views/admin/dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      children:[
        {
          path:'',
          name:'dashboard',
          component:dashboard
        },

      ]
    },
  ],
})

export default router
