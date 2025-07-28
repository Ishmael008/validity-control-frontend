<template>
  <q-page class="bg-grey-1 q-pa-sm" style="min-height: 100vh;">
    <div class="q-pa-md" style="max-width: 600px; margin: 0 auto;">
      <q-form @submit.prevent="finalizarCadastro" class="q-gutter-md">
        <div v-for="(produto, index) in produtos" :key="index" class="q-mb-md q-pa-md bg-white rounded-borders">
          <q-input
            v-model="produto.ean"
            label="Código EAN"
            dense
            outlined
            :rules="[val => !!val || 'Obrigatório']"
            :disable="carregando"
          />
          <q-input
            v-model="produto.name"
            label="Nome do Produto"
            dense
            outlined
            :rules="[val => !!val || 'Obrigatório']"
            :disable="carregando"
          />
          <q-input
            v-model="produto.validity"
            label="Data de Validade"
            type="date"
            dense
            outlined
            :rules="[val => !!val || 'Obrigatório']"
            :disable="carregando"
          />
          <q-input
            v-model="produto.description"
            label="Descrição"
            type="textarea"
            dense
            outlined
            :disable="carregando"
          />
          <q-btn
            label="Remover"
            color="negative"
            dense
            flat
            @click="removerProduto(index)"
            :disable="carregando"
          />
        </div>

        <q-btn
          label="Adicionar Produto"
          color="primary"
          @click="adicionarProduto"
          :disable="carregando"
        />

        <q-btn
          label="Finalizar Cadastro"
          color="positive"
          type="submit"
          :loading="carregando"
          :disable="carregando"
          class="q-mt-lg"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default {
  name: 'MerceariaRegister',
  setup() {
    const $q = useQuasar()
    const nomeUsuario = ref(localStorage.getItem('nomeUsuario') || '')
    const carregando = ref(false)
    const chaveStorage = `produtos_${nomeUsuario.value}`
    const produtos = ref([{ ean: '', name: '', validity: '', description: '' }])

    onMounted(() => {
      const dadosSalvos = localStorage.getItem(chaveStorage)
      if (dadosSalvos) {
        try {
          produtos.value = JSON.parse(dadosSalvos)
        } catch (e) {
          console.error('Erro ao carregar dados salvos:', e)
        }
      }
    })

    watch(produtos, (novo) => {
      localStorage.setItem(chaveStorage, JSON.stringify(novo))
    }, { deep: true })

    function adicionarProduto() {
      produtos.value.push({ ean: '', name: '', validity: '', description: '' })
    }

    function removerProduto(index) {
      produtos.value.splice(index, 1)
    }

    function validarProdutos() {
      for (const [i, produto] of produtos.value.entries()) {
        if (!produto.ean?.trim()) {
          throw new Error(`Produto #${i + 1}: Código EAN é obrigatório.`)
        }
        if (!produto.name?.trim()) {
          throw new Error(`Produto #${i + 1}: Nome do produto é obrigatório.`)
        }
        if (!produto.validity) {
          throw new Error(`Produto #${i + 1}: Data de validade é obrigatória.`)
        }
        const dataValidade = new Date(produto.validity)
        if (isNaN(dataValidade.getTime())) {
          throw new Error(`Produto #${i + 1}: Data de validade inválida.`)
        }
      }
    }

    async function finalizarCadastro() {
      carregando.value = true
      try {
        validarProdutos()
        const token = localStorage.getItem('authToken')

        for (const produto of produtos.value) {
          const payload = {
            eanOfProduct: produto.ean.trim(),
            nameOfProduct: produto.name.trim(),
            validity: new Date(produto.validity).toISOString(),
            description: produto.description ? produto.description.trim() : ''
          }

          console.log('Enviando payload:', payload)

          await axios.post(
            'https://validity-controll-uyi3.onrender.com/api/1/productcontrol',
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
        }

        $q.notify({ type: 'positive', message: 'Produtos cadastrados com sucesso!' })

        produtos.value = [{ ean: '', name: '', validity: '', description: '' }]
        localStorage.removeItem(chaveStorage)

      } catch (error) {
        console.error('Erro no cadastro:', error)
        $q.notify({ type: 'negative', message: error.message || 'Erro ao cadastrar produtos.' })
      } finally {
        carregando.value = false
      }
    }

    return {
      nomeUsuario,
      produtos,
      carregando,
      adicionarProduto,
      removerProduto,
      finalizarCadastro
    }
  }
}
</script>
