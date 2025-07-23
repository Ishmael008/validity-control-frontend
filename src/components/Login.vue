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
import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      password: '',
      carregando: false,
      mensagemErro: ''
    }
  },
  methods: {
    async realizarLogin() {
      this.carregando = true
      this.mensagemErro = ''

      try {
        const response = await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/1/login',
          {
            name: this.name,
            password: this.password
          }
        )

        const token = response.data.token
        localStorage.setItem('authToken', token)
        localStorage.setItem('nomeUsuario', this.name)

        this.$router.push('/cadastro-produtos')
      } catch (error) {
        if (!error.response) {
          this.mensagemErro = 'Erro de conexão. Tente novamente mais tarde.'
        } else if (error.response.status === 401) {
          this.mensagemErro = 'Usuário ou senha inválidos.'
        } else {
          this.mensagemErro = 'Erro ao fazer login.'
        }
        console.error(error)
      } finally {
        this.carregando = false
      }
    }
  }
}
</script>
