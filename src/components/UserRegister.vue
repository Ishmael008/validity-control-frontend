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
          v-model="usuario.password"
          :type="mostrarSenha ? 'text' : 'password'"
          label="Senha"
          lazy-rules
          :rules="[val => !!val || 'Senha é obrigatória']"
        >
          <template v-slot:append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

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
        password: ''
      },
      mostrarSenha: false
    }
  },
  methods: {
    async cadastrarUsuario() {
      try {
        // Cria um FormData para enviar como multipart/form-data
        const formData = new FormData()
        formData.append('name', this.usuario.name)
        formData.append('password', this.usuario.password)

        // Faz a requisição POST com FormData (FromForm no backend)
        await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/Auth/login',
          formData
        )

        Notify.create({
          message: 'Usuário cadastrado com sucesso!',
          color: 'positive'
        })

        this.$router.push('/login')

        // Limpa os campos
        this.usuario.name = ''
        this.usuario.password = ''
      } catch (error) {
        Notify.create({
          message:
            'Erro ao cadastrar usuário. Esse nome já existe ou há um erro no servidor!',
          color: 'negative'
        })
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.q-card {
  min-height: 500px;
  width: 90%;
  max-width: 1000px;
  border-radius: 16px;
}
</style>
