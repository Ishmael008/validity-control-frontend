<template>
  <q-page class="bg-grey-1" style="min-height: 100vh;">
    <!-- Botões -->
    <div class="q-pa-md q-gutter-sm row justify-between" style="max-width: 600px; margin: 0 auto;">
      <q-btn color="positive" label="Finalizar o cadastro" @click="finalizarCadastro" />
      <q-btn color="primary" label="Produtos do dia" @click="irParaProdutosDoDia" />
    </div>

    <!-- Formulário -->
    <div class="flex flex-center" style="min-height: calc(100vh - 180px);">
      <q-card class="q-pa-md shadow-10" style="width: 100%; max-width: 600px;">
        <q-card-section>
          <div class="text-h5 text-primary q-mb-md">Cadastro de Produtos - Mercearia</div>

          <q-form @submit.prevent="finalizarCadastro">
            <div
              v-for="(produto, index) in produtos"
              :key="index"
              class="q-mb-md q-pa-md bg-white rounded-borders"
            >
              <q-input
                v-model="produto.eanOfProduct"
                label="Código EAN"
                dense
                outlined
                class="q-mb-sm"
                prepend-inner-icon="qr_code"
                :rules="[val => !!val || 'Obrigatório']"
              />
              <q-input
                v-model="produto.nameOfProduct"
                label="Nome do Produto"
                dense
                outlined
                class="q-mb-sm"
                prepend-inner-icon="label"
                :rules="[val => !!val || 'Obrigatório']"
              />
              <q-input
                v-model="produto.validity"
                label="Data de Validade"
                type="date"
                dense
                outlined
                class="q-mb-sm"
                prepend-inner-icon="event"
                :rules="[val => !!val || 'Obrigatório']"
              />
              <q-input
                v-model="produto.description"
                label="Descrição"
                type="textarea"
                dense
                outlined
                class="q-mb-sm"
                prepend-inner-icon="description"
                :rules="[val => !!val || 'Obrigatório']"
              />

              <div class="q-gutter-sm q-mt-sm">
                <q-btn color="negative" dense flat @click="removerProduto(index)" label="Remover" />
              </div>
              <q-separator class="q-my-md" />
            </div>

            <div class="q-my-md flex justify-center">
              <q-btn color="primary" label="Adicionar Produto" @click="adicionarProduto" />
            </div>

            <div class="q-mt-lg flex justify-center">
              <q-btn label="Finalizar Cadastro" color="positive" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  name: 'MerceariaRegister',
  data() {
    return {
      produtos: [
        { eanOfProduct: '', nameOfProduct: '', validity: '', description: '' }
      ]
    }
  },
  methods: {
    adicionarProduto() {
      this.produtos.push({ eanOfProduct: '', nameOfProduct: '', validity: '', description: '' })
    },
    removerProduto(index) {
      this.produtos.splice(index, 1)
    },
    async finalizarCadastro() {
      try {
        for (const p of this.produtos) {
          if (!p.eanOfProduct || !p.nameOfProduct || !p.validity || !p.description) {
            Notify.create({ color: 'negative', message: 'Preencha todos os campos obrigatórios!' })
            return
          }

          // 🧾 Payload estruturado com campo viewModel e nomes corretos
          const payload = {
            viewModel: {
              eanOfProduct: p.eanOfProduct,
              nameOfProduct: p.nameOfProduct,
              validity: p.validity.slice(0, 10), // formato "YYYY-MM-DD"
              description: p.description
            }
          }

          await axios.post('https://validity-controll-uyi3.onrender.com/api/1/productcontrol', payload)

          Notify.create({
            color: 'positive',
            message: `Produto "${p.nameOfProduct}" cadastrado com sucesso!`
          })
        }

        this.produtos = [{ eanOfProduct: '', nameOfProduct: '', validity: '', description: '' }]
      } catch (error) {
        console.error('❌ Erro ao enviar produto:', error)
        console.error('🧾 Detalhes:', JSON.stringify(error.response?.data, null, 2))
        Notify.create({
          color: 'negative',
          message: 'Erro ao cadastrar produtos.'
        })
      }
    },
    irParaProdutosDoDia() {
      this.$router.push('/produtos-do-dia')
    }
  }
}
</script>
