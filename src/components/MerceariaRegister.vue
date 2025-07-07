<template>
  <q-page class="bg-grey-1" style="min-height: 100vh;">
    <!-- Botão no topo -->
    <div class="q-pa-md q-gutter-sm row justify-end" style="max-width: 600px; margin: 0 auto;">
      <q-btn color="primary" label="Ver Lista de Produtos" @click="irParaProdutosDoDia" />
    </div>

    <!-- Formulário para cadastrar vários produtos -->
    <div class="flex flex-center" style="min-height: calc(100vh - 180px);">
      <q-card class="q-pa-md shadow-10" style="width: 100%; max-width: 600px;">
        <q-card-section>
          <div class="text-h5 text-primary q-mb-md">Cadastro de Produtos</div>

          <q-form @submit.prevent="finalizarCadastro">
            <div
              v-for="(produto, index) in produtos"
              :key="index"
              class="q-mb-md q-pa-md bg-white rounded-borders"
            >
              <q-input
                v-model="produto.ean"
                label="Código EAN"
                dense
                outlined
                class="q-mb-sm"
                prepend-inner-icon="qr_code"
                :rules="[val => !!val || 'Obrigatório']"
              />
              <q-input
                v-model="produto.name"
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
              />
              <div class="q-gutter-sm q-mt-sm">
                <q-btn
                  color="negative"
                  dense
                  flat
                  @click="removerProduto(index)"
                  label="Remover"
                />
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
        { ean: '', name: '', validity: '', description: '' }
      ]
    }
  },
  methods: {
    adicionarProduto() {
      this.produtos.push({ ean: '', name: '', validity: '', description: '' })
    },
    removerProduto(index) {
      this.produtos.splice(index, 1)
    },
    async finalizarCadastro() {
      try {
        // Validação básica
        for (const p of this.produtos) {
          if (!p.ean || !p.name || !p.validity) {
            Notify.create({
              color: 'negative',
              message: 'Preencha todos os campos obrigatórios!'
            })
            return
          }
        }

        // Envia cada produto individualmente
        for (const produto of this.produtos) {
          await axios.post(
            'https://localhost:7005/api/1/productcontrol',
            produto,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        }

        Notify.create({
          color: 'positive',
          message: 'Todos os produtos foram cadastrados com sucesso!'
        })

        // Limpa o formulário
        this.produtos = [{ ean: '', name: '', validity: '', description: '' }]
      } catch (error) {
        console.error(error)
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
