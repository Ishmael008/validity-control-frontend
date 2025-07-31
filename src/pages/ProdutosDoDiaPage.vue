<template>
  <q-page class="bg-grey-1 q-pa-md" style="min-height: 100vh;">
    <q-card class="q-pa-md shadow-10" style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">Controle de Validade</div>
        <div class="text-subtitle1 text-center q-mb-lg">Confira Produtos Próximos do Vencimento</div>

        <div v-if="produtos.length > 0">
          <div
            v-for="(produto, index) in produtos"
            :key="index"
            class="q-pa-sm q-mb-sm bg-grey-3 rounded-borders"
          >
            <div><strong>Nome:</strong> {{ produto.nameOfProduct || 'Indefinido' }}</div>
            <div><strong>EAN:</strong> {{ produto.eanOfProduct || 'Indefinido' }}</div>
            <div><strong>Validade:</strong> {{ formatDate(produto.validity) }}</div>
            <div><strong>Vence em:</strong> {{ produto.daysToMatury ?? 'Indefinido' }} dia(s)</div>
            <div><strong>Descrição:</strong> {{ produto.description || 'Sem descrição' }}</div>

            <q-btn
              dense
              color="negative"
              label="Excluir"
              class="q-mt-sm"
              @click="excluirProduto(produto.eanOfProduct)"
            />
          </div>
        </div>

        <div v-else class="text-center text-grey q-mt-lg">
          Nenhum produto próximo do vencimento encontrado.
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Voltar" color="primary" @click="$router.push('/cadastro/mercearia')" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  name: 'ProdutosDoDiaPage',
  data() {
    return {
      produtos: [],
      editando: {} // para armazenar campos em edição
    }
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await axios.get('https://validity-controll-1.onrender.com/api/1/productcontrol/products')
        this.produtos = response.data
        // Inicializa o objeto editando para cada produto, assim evita erro no v-model
        this.produtos.forEach(produto => {
          this.$set(this.editando, produto.eanOfProduct, { ...produto })
        })
      } catch (error) {
        console.error(error)
        Notify.create({
          color: 'negative',
          message: 'Erro ao buscar produtos.'
        })
      }
    },
    formatDate(data) {
      if (!data) return 'Indefinido'
      const d = new Date(data)
      if (isNaN(d)) return 'Indefinido'
      return d.toLocaleDateString()
    },
    diasParaVencer(data) {
      if (!data) return 'Indefinido'
      const hoje = new Date()
      const validade = new Date(data)
      const diff = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24))
      return diff < 0 ? 'Vencido' : `${diff} dia(s)`
    },
    async excluirProduto(ean) {
      try {
        await axios.delete(`https://validity-controll-1.onrender.com/api/1/productcontrol/${ean}`)
        Notify.create({ color: 'positive', message: 'Produto excluído com sucesso!' })
        await this.carregarProdutos()
      } catch (error) {
        console.error(error)
        Notify.create({ color: 'negative', message: 'Erro ao excluir produto.' })
      }
    }
  },
  mounted() {
    this.carregarProdutos()
  }
}
</script>
