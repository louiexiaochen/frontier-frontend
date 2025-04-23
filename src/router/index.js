import { createRouter, createWebHistory } from 'vue-router'

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
      }
    ]
  },
  {
    path: '/vocabulary/:id',
    name: 'Vocabulary',
    component: () => import('../views/Vocabulary.vue')
  },
  {
    path: '/essay/:id',
    name: 'Essay',
    component: () => import('../views/Essay.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
