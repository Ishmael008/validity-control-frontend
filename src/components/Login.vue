<template>
  <q-page class="row items-center justify-center bg-blue-1" style="min-height: 100vh;">
    <q-card class="row shadow-4" style="max-width: 1000px; width: 100%;">
      <div class="col-5 bg-primary text-white flex flex-center column q-pa-xl">
        <div class="text-h4 text-center">Bem-vindo ao Controle de Validade</div>
        <div class="text-subtitle2 text-center q-mt-md">Gerencie seus produtos com praticidade</div>
      </div>

      <div class="col-7 q-pa-xl">
        <div class="text-h6 text-center q-mb-md">Login</div>

        <q-form @submit.prevent="realizarLogin">
          <q-input
            v-model="name"
            label="Nome de Usuário"
            dense
            outlined
            prepend-inner-icon="person"
            class="q-mb-md"
            :disable="carregando"
            :rules="[val => !!val || 'Obrigatório']"
          />
          <q-input
            v-model="password"
            label="Senha"
            type="password"
            dense
            outlined
            prepend-inner-icon="lock"
            class="q-mb-lg"
            :disable="carregando"
            :rules="[val => !!val || 'Obrigatório']"
          />

          <div class="row justify-center">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              :loading="carregando"
              :disable="carregando"
            />
          </div>
        </q-form>

        <div v-if="mensagemErro" class="text-negative text-center q-mt-md">
          {{ mensagemErro }}
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
  name: 'LoginPage', // Nome multi-word para ESLint

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
