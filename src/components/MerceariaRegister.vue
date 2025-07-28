<template>
  <q-page class="bg-grey-1 q-pa-md" style="min-height: 100vh;">
    <q-form @submit.prevent="cadastrarProduto">
      <q-input filled v-model="produto.eanOfProduct" label="EAN" required />
      <q-input filled v-model="produto.nameOfProduct" label="Nome do Produto" required />
      <q-input filled v-model="produto.validity" label="Validade" type="date" required />
      <q-input filled v-model="produto.description" label="Descrição" type="textarea" />
      <q-btn label="Cadastrar" color="primary" type="submit" />
    </q-form>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  name: 'MerceariaRegister',
  data() {
    return {
      produto: {
        eanOfProduct: '',
        nameOfProduct: '',
        validity: '',
        description: ''
      }
    }
  },
  methods: {
    async cadastrarProduto() {
      try {
        // Converter a validade para Date (se necessário)
        const payload = {
          ...this.produto,
          validity: new Date(this.produto.validity)
        }

        await axios.post('https://validity-controll-uyi3.onrender.com/api/1/productcontrol', payload, {
          headers: { 'Content-Type': 'application/json' }
        })

        Notify.create({ color: 'positive', message: 'Produto cadastrado com sucesso!' })
        this.produto = { eanOfProduct: '', nameOfProduct: '', validity: '', description: '' }

      } catch (error) {
        console.error('❌ Erro no cadastro:', error.response?.data || error.message)

        Notify.create({
          color: 'negative',
          message: `Erro no cadastro: ${error.response?.data?.Erro || 'Verifique os dados'}`
        })
      }
    }
  }
}
</script>

