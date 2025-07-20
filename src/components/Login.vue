<template>
  <q-page class="q-pa-md flex flex-center bg-blue-1">
    <q-card class="q-pa-none shadow-4 q-responsive" style="width: 100%; max-width: 1000px;">
      <div class="row q-col-gutter-sm">
        <!-- Lado Esquerdo - apenas visível em telas md ou maiores -->
        <div class="col-12 col-md-5 bg-primary text-white flex flex-center column q-pa-xl hidden-xs">
          <div class="text-h5 text-center">Bem-vindo ao Controle de Validade</div>
          <div class="text-subtitle2 text-center q-mt-sm">
            Gerencie com facilidade a validade dos seus produtos!
          </div>
        </div>

        <!-- Lado Direito - formulário -->
        <div class="col-12 col-md-7 q-pa-xl">
          <div class="text-h5 text-center text-primary q-mb-lg">Acesse sua conta</div>

          <q-form @submit.prevent="loginUsuario">
            <q-input
              filled
              v-model="usuario.name"
              label="Nome"
              class="q-mb-md"
              :dense="$q.screen.lt.md"
              prepend-inner-icon="person"
            />
            <q-input
              filled
              v-model="usuario.password"
              label="Senha"
              type="password"
              class="q-mb-lg"
              :dense="$q.screen.lt.md"
              prepend-inner-icon="lock"
            />
            <q-btn label="Entrar" color="primary" class="full-width" type="submit" />

            <div class="q-mt-md text-center">
              <q-btn flat label="Ainda não tem conta? Cadastre-se" @click="$router.push('/register')" />
            </div>
          </q-form>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  name: 'UserLogin', // <- Corrige o erro do ESLint
  data () {
    return {
      usuario: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    async loginUsuario () {
      try {
        const response = await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/Auth/login',
          {
            name: this.usuario.name,
            password: this.usuario.password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const token = response.data.token

        if (token) {
          localStorage.setItem('authToken', token)
          localStorage.setItem('username', this.usuario.name)

          Notify.create({
            message: 'Login realizado com sucesso!',
            color: 'positive'
          })

          this.$router.push('/cadastro/mercearia')
        } else {
          Notify.create({
            message: 'Token inválido.',
            color: 'negative'
          })
        }
      } catch (error) {
        console.error('Erro no login:', error)
        Notify.create({
          color: 'negative',
          message: 'Usuário ou senha inválidos.'
        })
      }
    }
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 16px;
}
</style>

