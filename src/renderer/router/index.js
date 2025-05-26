import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/TeamsView', component: () => import('../components/BracetsView.vue') },
  { path: '/PlayerStats', component: () => import('../components/PlayerView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
