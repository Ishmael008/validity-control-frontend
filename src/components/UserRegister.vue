<template>
  <q-page class="flex flex-center bg-blue-1">
    <q-card class="q-pa-xl shadow-10 bg-white" style="width: 400px; max-width: 90vw;">
      <div class="text-center q-mb-md">
        
        <h2 class="text-primary q-mt-md">Bem-vindo ao Controle de Validade</h2>
        <p class="text-subtitle2">Faça seu cadastro abaixo</p>
      </div>

      <q-form @submit.prevent="cadastrarUsuario" class="q-gutter-md">
        <q-input
          filled
          v-model="usuario.name"
          label="Nome"
          lazy-rules
          :rules="[val => !!val || 'Nome é obrigatório']"
        />
        <q-input
          filled
          v-model="usuario.email"
          label="Email"
          type="email"
          lazy-rules
          :rules="[val => !!val || 'Email é obrigatório']"
        />

        <q-btn label="Cadastrar" color="primary" type="submit" class="full-width" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'
import axios from 'axios'

export default {
  name: 'UserRegister',
  data() {
    return {
      usuario: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    async cadastrarUsuario() {
      try {
        await axios.post('https://localhost:7005/api/1/Usuario', this.usuario)
        Notify.create({
         
          message: 'Usuário cadastrado com sucesso!'
        })
        this.$router.push('/register')
        this.usuario.name = ''
        this.usuario.email = ''
      } catch (error) {
        Notify.create({

          message: 'Erro ao cadastrar usuário.'
        })
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
