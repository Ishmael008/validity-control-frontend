<template>
  <q-page class="bg-grey-1 q-pa-sm" style="min-height: 100vh;">
    <div class="q-pa-md" style="max-width: 600px; margin: 0 auto;">
      <q-form @submit.prevent="cadastrarProduto" class="q-gutter-md">
        <q-input
          filled
          v-model="ean"
          label="EAN do Produto"
          required
        />
        <q-input
          filled
          v-model="nome"
          label="Nome do Produto"
          required
        />
        <q-input
          filled
          v-model="validade"
          label="Data de Validade"
          type="date"
          required
        />
        <q-input
          filled
          v-model="descricao"
          label="Descrição"
          type="textarea"
          required
        />
        <div class="row justify-end q-gutter-sm">
          <q-btn label="Cadastrar Produto" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MerceariaRegister',
  data() {
    return {
      ean: '',
      nome: '',
      validade: '',
      descricao: ''
    }
  },
  methods: {
    async cadastrarProduto() {
      try {
        const payload = {
          eanOfProduct: this.ean,
          nameOfProduct: this.nome,
          validity: new Date(this.validade).toISOString(), // formato ISO
          description: this.descricao
        }

        const response = await axios.post('https://validity-controll-uyi3.onrender.com/api/1/productcontrol', payload)

        console.log('✅ Produto cadastrado com sucesso:', response.data)
        this.$q.notify({ type: 'positive', message: 'Produto cadastrado com sucesso!' })

        // Limpar campos
        this.ean = ''
        this.nome = ''
        this.validade = ''
        this.descricao = ''
      } catch (error) {
        console.error('❌ Erro no cadastro:', error.response?.data || error.message)
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.title || 'Erro ao cadastrar o produto'
        })
      }
    }
  }
}
</script>


