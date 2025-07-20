<template>
  <div class="q-pa-md">
    <div class="row items-center justify-center q-gutter-md" style="min-height: 100vh;">
      <div class="col-12 col-md-6 q-pa-md bg-primary text-white rounded-borders text-center">
        <div class="text-h5 q-mb-sm" style="word-break: break-word;">
          {{ welcomeMessage }}
        </div>
        <p>Gerencie com facilidade a validade dos seus produtos!</p>
      </div>

      <div class="col-12 col-md-4 q-pa-md bg-white rounded-borders shadow-2">
        <h5 class="text-center">Acesse sua conta</h5>

        <q-input v-model="name" label="Nome" outlined class="q-mb-md" />
        <q-input v-model="password" label="Senha" type="password" outlined class="q-mb-md" />

        <q-btn label="ENTRAR" color="primary" @click="login" class="full-width q-mb-sm" />

        <div class="text-center">
          <p class="text-caption">AINDA NÃO TEM CONTA?</p>
          <q-btn flat label="CADASTRE-SE" color="primary" to="/register" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      password: '',
      welcomeMessage: 'Bem-vindo ao Controle de Validade'
    }
  },
  mounted () {
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      this.welcomeMessage = `Bem-vindo de volta, ${savedName}!`
    }
  },
  methods: {
    async login () {
      try {
        const response = await fetch('https://sua-api.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: this.name, password: this.password })
        })

        if (!response.ok) {
          throw new Error('Login inválido')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('userName', this.name)

        this.$router.push('/produtos-do-dia')
      } catch (error) {
        alert(error.message)
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.2rem;
  }
}
</style>

