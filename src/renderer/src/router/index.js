import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../components/HomeView.vue') },
  {
    path: '/TeamsView',
    component: () => import('../components/BracetsView.vue'),
    meta: { title: 'Brackets View' }
  },
  {
    path: '/PlayerStats',
    component: () => import('../components/PlayerView.vue'),
    meta: { title: 'Players Stats' }
  },
  {
    path: '/TodayMatches',
    component: () => import('../components/TodayMatchesView.vue'),
    meta: { title: "Today's Matches" }
  },
  {
    path: '/Settings',
    component: () => import('../components/SettingsView.vue'),
    meta: { title: 'Settings' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
