<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-lg">Cadastro de Produtos - Mercearia</div>

    <q-btn label="Finalizar o cadastro" color="primary" @click="finalizarCadastro" class="q-mb-md" :loading="carregando" />
    <q-btn label="Produtos do dia" color="secondary" @click="irParaProdutosDoDia" class="q-ml-sm q-mb-md" />

    <q-separator class="q-my-md" />

    <div v-for="(produto, index) in produtos" :key="index" class="q-mb-lg">
      <q-card flat bordered class="q-pa-md">
        <q-input v-model="produto.ean"
                 label="EAN"
                 inputmode="numeric"
                 type="text"
                 @input="produto.ean = produto.ean.replace(/[^0-9]/g, '')"
                 maxlength="13"
                 filled
                 class="q-mb-sm" />

        <q-input v-model="produto.name" label="Nome" filled class="q-mb-sm" />
        <q-input v-model="produto.validity" label="Validade" type="date" filled class="q-mb-sm" />
        <q-input v-model="produto.description" label="Descrição" filled class="q-mb-sm" />

        <q-btn label="Remover" color="negative" @click="removerProduto(index)" v-if="produtos.length > 1" />
      </q-card>
    </div>

    <q-btn label="Adicionar Produto" color="primary" outline @click="adicionarProduto" />
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

    // Recuperar produtos salvos localmente ao carregar a página
    onMounted(() => {
      const dadosSalvos = localStorage.getItem(`produtos_${nomeUsuario.value}`)
      if (dadosSalvos) {
        try {
          produtos.value = JSON.parse(dadosSalvos)
        } catch (e) {
          console.error('Erro ao carregar dados salvos:', e)
        }
      }
    })

    // Salvar progresso local automaticamente
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

        const payload = {
          produtos: produtos.value
        }

        await axios.post(
          'https://validity-controll-uyi3.onrender.com/api/1/ProductControl',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        $q.notify({ color: 'positive', message: 'Cadastro realizado com sucesso!' })
        produtos.value = [{ ean: '', name: '', validity: '', description: '' }]
        localStorage.removeItem(`produtos_${nomeUsuario.value}`)
      } catch (err) {
        console.error(err)
        $q.notify({ color: 'negative', message: 'Erro ao cadastrar produtos.' })
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

<style scoped>
.q-page {
  max-width: 800px;
  margin: auto;
}
</style>
