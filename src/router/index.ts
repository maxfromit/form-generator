import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/DataPage.vue'),
    },
    {
      path: '/:dataKey/:id?',
      name: 'data-key', // Single name for both routes
      component: () => import('../views/DataPage.vue'),
    },
  ],
})

export default router
