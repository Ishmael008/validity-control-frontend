<template>
  <q-page class="bg-grey-1" style="min-height: 100vh;">
    <div class="q-pa-md q-gutter-sm row justify-between items-center" style="max-width: 600px; margin: 0 auto;">
      <div class="text-subtitle1">Olá, {{ nomeUsuario }} 👋</div>
      <q-btn color="primary" label="Ver Lista de Produtos" @click="irParaProdutosDoDia" :disable="carregando" />
    </div>

    <div class="flex flex-center" style="min-height: calc(100vh - 180px);">
      <q-card class="q-pa-md shadow-10" style="width: 100%; max-width: 600px;">
        <q-card-section>
          <div class="text-h5 text-primary q-mb-md">Cadastro de Produtos</div>

          <q-form @submit.prevent="finalizarCadastro">
            <div
              v-for="(produto, index) in produtos"
              :key="produto.ean || index"
              class="q-mb-md q-pa-md bg-white rounded-borders"
            >
              <q-input
                v-model="produto.ean"
                label="Código EAN"
                dense outlined
                prepend-inner-icon="qr_code"
                :rules="[val => !!val || 'Obrigatório']"
                :disable="carregando"
              />
              <q-input
                v-model="produto.name"
                label="Nome do Produto"
                dense outlined
                prepend-inner-icon="label"
                :rules="[val => !!val || 'Obrigatório']"
                :disable="carregando"
              />
              <q-input
                v-model="produto.validity"
                label="Data de Validade"
                type="date"
                dense outlined
                prepend-inner-icon="event"
                :rules="[val => !!val || 'Obrigatório']"
                :disable="carregando"
              />
              <q-input
                v-model="produto.description"
                label="Descrição"
                type="textarea"
                dense outlined
                prepend-inner-icon="description"
                :disable="carregando"
              />

              <div class="q-gutter-sm q-mt-sm">
                <q-btn
                  label="Remover"
                  color="negative"
                  dense flat
                  @click="removerProduto(index)"
                  :disable="carregando"
                />
              </div>
              <q-separator class="q-my-md" />
            </div>

            <div class="q-my-md flex justify-center">
              <q-btn
                label="Adicionar Produto"
                color="primary"
                @click="adicionarProduto"
                :disable="carregando"
              />
            </div>

            <div class="q-mt-lg flex justify-center">
              <q-btn
                label="Finalizar Cadastro"
                color="positive"
                type="submit"
                :loading="carregando"
                :disable="carregando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default {
  name: 'MerceariaRegisterPage',

  setup() {
    const $q = useQuasar()
    const nomeUsuario = ref(localStorage.getItem('nomeUsuario') || '')
    const produtos = ref([{ ean: '', name: '', validity: '', description: '' }])
    const carregando = ref(false)

    onMounted(() => {
      const dadosSalvos = localStorage.getItem(`produtos_${nomeUsuario.value}`)
      if (dadosSalvos) produtos.value = JSON.parse(dadosSalvos)
    })

    watch(produtos, (novo) => {
      localStorage.setItem(`produtos_${nomeUsuario.value}`, JSON.stringify(novo))
    }, { deep: true })

    function adicionarProduto() {
      produtos.value.push({ ean: '', name: '', validity: '', description: '' })
    }

    function removerProduto(index) {
      produtos.value.splice(index, 1)
    }

    async function finalizarCadastro() {
      carregando.value = true
      try {
        const token = localStorage.getItem('authToken')
        await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/1/productcontrol',
          produtos.value,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        $q.notify({ type: 'positive', message: 'Cadastro realizado com sucesso!' })
        produtos.value = [{ ean: '', name: '', validity: '', description: '' }]
        localStorage.removeItem(`produtos_${nomeUsuario.value}`)
      } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Erro ao cadastrar produtos.' })
      } finally {
        carregando.value = false
      }
    }

    function irParaProdutosDoDia() {
      window.location.href = '/#/produtos-do-dia'
    }

    return {
      nomeUsuario,
      produtos,
      carregando,
      adicionarProduto,
      removerProduto,
      finalizarCadastro,
      irParaProdutosDoDia
    }
  }
}
</script>
