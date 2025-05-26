import { createRouter, createWebHistory } from 'vue-router'

// 导入特点页面
import Features from '@/views/Features.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        redirect: '/home/reading'
      },
      {
        path: 'reading',
        name: 'Reading',
        component: () => import('../views/Reading.vue')
      },
      {
        path: 'listening',
        name: 'Listening',
        component: () => import('../views/Listening.vue')
      },
      {
        path: 'speaking',
        name: 'Speaking',
        component: () => import('../views/Speaking.vue')
      },
      {
        path: 'writing',
        name: 'Writing',
        component: () => import('../views/Writing.vue')
      },
      {
        path: 'ai-friend',
        name: 'AIFriend',
        component: () => import('../views/AIFriend.vue')
      },
      {
        path: 'method',
        name: 'Method',
        component: () => import('../views/Method.vue')
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('../views/Analysis.vue')
      },
      {
        path: 'membership',
        name: 'Membership',
        component: () => import('../views/Membership.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: '/reading/vocabulary/:id',
        name: 'Vocabulary',
        component: () => import('../views/Vocabulary.vue')
      },
      {
        path: '/reading/essay/:id',
        name: 'Essay',
        component: () => import('../views/Essay.vue')
      },
    ]
  },
  // 为了兼容旧路由，添加重定向
  {
    path: '/reading',
    redirect: '/home/reading'
  },
  {
    path: '/listening',
    redirect: '/home/listening'
  },
  {
    path: '/speaking',
    redirect: '/home/speaking'
  },
  {
    path: '/writing',
    redirect: '/home/writing'
  },
  
  // 添加特点页面路由
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      title: '特点 - FrontierX',
      requiresAuth: false
    }
  },
  
  // 添加价格页面路由 - 使用动态导入而不是静态导入
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('../views/Pricing.vue'),
    meta: {
      title: '价格 - FrontierX',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
