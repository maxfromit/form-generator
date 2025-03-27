import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/DynamicFormPage.vue'),
    },
    {
      path: '/:dataKey/:source?',
      name: 'data-key', // Single name for both routes
      component: () => import('../views/DynamicFormPage.vue'),
    },
  ],
})

export default router
