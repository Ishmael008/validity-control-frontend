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
import { Notify } from 'quasar'

export default {
  data() {
    return {
      produtos: []
    }
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await fetch('https://validity-controll-1.onrender.com/api/1/productcontrol/day-products')
        const data = await response.json()
        this.produtos = data

        // Checa produtos vencidos
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
    formatDate(data) {
      const d = new Date(data)
      return d.toLocaleDateString('pt-BR')
    },
    async excluirProduto(ean) {
      try {
        const confirm = window.confirm('Tem certeza que deseja excluir este produto?')
        if (!confirm) return

        const response = await fetch(`https://validity-controll-1.onrender.com/api/1/productcontrol/${ean}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Erro ao excluir')

        Notify.create({
          message: 'Produto excluído com sucesso.',
          color: 'positive'
        })

        this.carregarProdutos()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        Notify.create({
          message: 'Erro ao excluir produto.',
          color: 'negative'
        })
      }
    }
  },
  mounted() {
    this.carregarProdutos()
  }
}
</script>
