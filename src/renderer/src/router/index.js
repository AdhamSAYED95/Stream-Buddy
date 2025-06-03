import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../components/HomeView.vue') },
  { path: '/TeamsView', component: () => import('../components/BracetsView.vue') },
  { path: '/PlayerStats', component: () => import('../components/PlayerView.vue') },
  { path: '/TodayMatches', component: () => import('../components/TodayMatchesView.vue') },
  { path: '/Settings', component: () => import('../components/SettingsView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
