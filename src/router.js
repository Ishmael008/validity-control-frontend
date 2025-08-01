// src/router.js

import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from './components/Login.vue'
import UserRegister from './components/UserRegister.vue'
import MerceariaRegisterPage from './components/MerceariaRegister.vue'
import ProdutosDoDiaPage from './pages/ProdutosDoDiaPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: UserRegister },
  { path: '/cadastro/mercearia', component: MerceariaRegisterPage },
  { path: '/produtos-do-dia', component: ProdutosDoDiaPage },
  {
    path: '/feedback/:ean?',
    component: () => import('./pages/FeedbackForm.vue') // corrigido aqui
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
