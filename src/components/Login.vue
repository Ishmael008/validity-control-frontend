<template>
  <q-page class="q-pa-md flex flex-center bg-blue-1">
    <q-card class="q-pa-none shadow-4 q-responsive" style="width: 100%; max-width: 1000px;">
      <div class="row q-col-gutter-sm">
        <!-- Lado Esquerdo - apenas visível em telas md ou maiores -->
        <div class="col-12 col-md-5 bg-primary text-white flex flex-center column q-pa-xl hidden-xs">
          <div class="text-h4 text-center">Bem-vindo ao Controle de Validade</div>
          <div class="text-subtitle1 text-center q-mt-sm">
            Gerencie os produtos com praticidade
          </div>
        </div>

        <!-- Lado Direito - formulário -->
        <div class="col-12 col-md-7 q-pa-xl">
          <div class="text-h5 text-center text-primary q-mb-lg">Acesse sua conta</div>

          <q-form @submit.prevent="realizarLogin">
            <q-input
              filled
              v-model="name"
              label="Nome de Usuário"
              class="q-mb-md"
              :dense="$q.screen.lt.md"
              rounded
              standout="bg-primary text-white"
              prepend-inner-icon="person"
              :disable="carregando"
              :rules="[val => !!val || 'Obrigatório']"
            />
            <q-input
              filled
              v-model="password"
              label="Senha"
              type="password"
              class="q-mb-lg"
              :dense="$q.screen.lt.md"
              rounded
              standout="bg-primary text-white"
              prepend-inner-icon="lock"
              :disable="carregando"
              :rules="[val => !!val || 'Obrigatório']"
            />

            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              class="full-width q-mb-md"
              :loading="carregando"
              :disable="carregando"
              unelevated
              rounded
            />

            <div v-if="mensagemErro" class="text-negative text-center q-mt-md">
              {{ mensagemErro }}
            </div>
          </q-form>

          <div class="q-mt-md text-center">
            <q-btn
              flat
              label="Ainda não tem conta? Cadastre-se"
              @click="$router.push('/register')"
              class="text-primary"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  name: 'LoginPage',

  setup() {
    const router = useRouter()
    const name = ref('')
    const password = ref('')
    const carregando = ref(false)
    const mensagemErro = ref('')

    async function realizarLogin() {
      mensagemErro.value = ''
      carregando.value = true

      try {
        const response = await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/Auth/login',
          {
            name: name.value,
            password: password.value
          }
        )

        const token = response.data.token
        if (token) {
          localStorage.setItem('authToken', token)
          localStorage.setItem('nomeUsuario', name.value)

          Notify.create({ type: 'positive', message: 'Login realizado com sucesso!' })
          await router.push('/cadastro/mercearia')
        } else {
          mensagemErro.value = 'Token inválido.'
        }
      } catch (error) {
        if (!error.response) {
          mensagemErro.value = 'Erro de conexão. Tente novamente mais tarde.'
        } else if (error.response.status === 401) {
          mensagemErro.value = 'Usuário ou senha inválidos.'
        } else {
          mensagemErro.value = 'Erro ao fazer login.'
        }
        console.error(error)
      } finally {
        carregando.value = false
      }
    }

    return {
      name,
      password,
      carregando,
      mensagemErro,
      realizarLogin
    }
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 16px;
}

.q-btn:hover {
  filter: brightness(1.05);
}

.text-primary {
  font-weight: 500;
}
</style>