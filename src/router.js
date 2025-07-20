import { createRouter, createWebHashHistory} from 'vue-router'

import UserRegister from './components/UserRegister.vue'
import MerceariaRegister from './components/MerceariaRegister.vue'
import ProdutosDoDiaPage from './pages/ProdutosDoDiaPage.vue'
import Login from './components/Login.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: UserRegister },
  { path: '/cadastro/mercearia', component: MerceariaRegister },
  { path: '/produtos-do-dia', component: ProdutosDoDiaPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
