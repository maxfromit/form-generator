import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'data-key-local-storage',
      component: () => import('../views/DataPage.vue'),
    },
    {
      path: '/:dataKey',
      name: 'data-key',
      component: () => import('../views/DataPage.vue'),
    },
    {
      path: '/:dataKey/:id',
      name: 'data-key-id',
      component: () => import('../views/DataPage.vue'),
    },
  ],
})

export default router
