import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Plateau from '@/views/Plateau.vue'
import Mathieu from '@/views/Mathieu.vue'
import Test from '@/views/TestComponent.vue'
import Lobby from '@/views/Lobby.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/plateau', name: 'Plateau', component: Plateau },
  { path: '/mathieu', name: 'Mathieu', component: Mathieu },
  { path: '/test', name: 'Test', component: Test },
  { path: '/lobby', name: 'Lobby', component: Lobby }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router