<template>
  <q-page class="bg-grey-1 q-pa-md" style="min-height: 100vh;">
    <q-card class="q-pa-md shadow-10" style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">Controle de Validade</div>
        <div class="text-subtitle1 text-center q-mb-lg">Confira Produtos Próximos do Vencimento</div>

        <div v-if="produtos.length > 0">
          <div
            v-for="produto in produtos"
            :key="produto.eanOfProduct"
            class="q-pa-sm q-mb-sm bg-grey-3 rounded-borders"
          >
            <div><strong>Nome:</strong> {{ produto.nameOfProduct || 'Indefinido' }}</div>
            <div><strong>EAN:</strong> {{ produto.eanOfProduct || 'Indefinido' }}</div>
            <div><strong>Validade:</strong> {{ formatDate(produto.validity) }}</div>
            <div><strong>Vence em:</strong> {{ produto.daysToMatury ?? 'Indefinido' }} dia(s)</div>
            <div><strong>Descrição:</strong> {{ produto.description || 'Sem descrição' }}</div>

            <div class="row q-mt-sm q-gutter-sm">
              <q-btn
                dense
                color="primary"
                label="Atualizar"
                @click="atualizarProduto(produto)"
              />
              <q-btn
                dense
                color="negative"
                label="Excluir"
                @click="excluirProduto(produto.eanOfProduct)"
              />
            </div>
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
import { Notify } from 'quasar'

export default {
  data() {
    return {
      produtos: []
    }
  },
  mounted() {
    this.carregarProdutos()
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Indefinido'
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    },
    async carregarProdutos() {
      try {
        const response = await fetch('https://validity-controll-1.onrender.com/api/1/productcontrol/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) throw new Error('Erro ao buscar produtos')

        const data = await response.json()
        this.produtos = data

        // Notificação de produtos vencidos
        const vencidos = this.produtos.filter(p => p.daysToMatury <= 0)
        if (vencidos.length > 0) {
          const mensagem = vencidos.length === 1
            ? `O produto "${vencidos[0].nameOfProduct}" já venceu. Deseja enviar um feedback?`
            : `${vencidos.length} produtos já venceram. Deseja enviar feedback sobre algum deles?`

          Notify.create({
            message: mensagem,
            color: 'warning',
            timeout: 7000,
            actions: [
              {
                label: 'Feedback',
                color: 'white',
                handler: () => {
                  this.$router.push(`/feedback/${vencidos[0].eanOfProduct}`)
                }
              },
              { label: 'Fechar', color: 'white' }
            ]
          })
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        Notify.create({
          message: 'Erro ao buscar produtos.',
          color: 'negative'
        })
      }
    },
    excluirProduto(ean) {
      fetch(`https://validity-controll-1.onrender.com/api/1/productcontrol/remove-products?ean=${ean}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (!response.ok) throw new Error('Erro ao excluir produto')
          Notify.create({ message: 'Produto excluído com sucesso', color: 'positive' })
          this.carregarProdutos()
        })
        .catch(error => {
          console.error(error)
          Notify.create({ message: 'Erro ao excluir produto', color: 'negative' })
        })
    },
    atualizarProduto(produto) {
      // Enviar para rota de cadastro com query params
      this.$router.push({
        path: '/cadastro/mercearia',
        query: {
          ean: produto.eanOfProduct
        }
      })
    }
  }
}
</script>
