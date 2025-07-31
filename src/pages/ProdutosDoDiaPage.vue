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

<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-h5 q-mb-md">Produtos do Dia</div>

    <q-table
      :rows="produtos"
      :columns="colunas"
      row-key="ean"
      flat
      bordered
      dense
    >
      <template v-slot:body-cell="props">
        <q-tr :props="props">
          <q-td>{{ props.row.ean }}</q-td>
          <q-td v-if="editando && produtoEditando.ean === props.row.ean">
            <q-input v-model="produtoEditando.name" dense />
          </q-td>
          <q-td v-else>{{ props.row.name }}</q-td>

          <q-td v-if="editando && produtoEditando.ean === props.row.ean">
            <q-input v-model="produtoEditando.validity" dense type="date" />
          </q-td>
          <q-td v-else>{{ formatDate(props.row.validity) }}</q-td>

          <q-td v-if="editando && produtoEditando.ean === props.row.ean">
            <q-input v-model="produtoEditando.description" dense />
          </q-td>
          <q-td v-else>{{ props.row.description }}</q-td>

          <q-td>
            <div v-if="editando && produtoEditando.ean === props.row.ean">
              <q-btn dense color="green" icon="check" @click="atualizarProduto" />
              <q-btn dense color="red" icon="close" flat @click="cancelarEdicao" />
            </div>
            <div v-else>
              <q-btn dense color="primary" icon="edit" @click="editarProduto(props.row)" />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
      produtoEditando: null,
      editando: false,
      colunas: [
        { name: 'ean', label: 'EAN', align: 'left', field: 'ean' },
        { name: 'name', label: 'Nome', align: 'left' },
        { name: 'validity', label: 'Validade', align: 'left' },
        { name: 'description', label: 'Descrição', align: 'left' },
        { name: 'acoes', label: 'Ações', align: 'center' }
      ]
    }
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await axios.get('https://validity-controll-1.onrender.com/api/1/productcontrol/products')
        this.produtos = response.data
      } catch (error) {
        console.error(error)
        Notify.create({
          color: 'negative',
          message: 'Erro ao buscar produtos.'
        })
      }
    },
    editarProduto(produto) {
      this.produtoEditando = { ...produto }
      this.editando = true
    },
    async atualizarProduto() {
      try {
        const payload = {
          ean: this.produtoEditando.ean.trim(),
          name: this.produtoEditando.name.trim(),
          validity: new Date(this.produtoEditando.validity).toISOString(),
          description: this.produtoEditando.description?.trim() || ''
        }

        await axios.put(
          `https://validity-controll-1.onrender.com/api/1/productcontrol/${this.produtoEditando.ean}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        )

        Notify.create({ color: 'positive', message: 'Produto atualizado com sucesso!' })
        this.produtoEditando = null
        this.editando = false
        this.carregarProdutos()
      } catch (error) {
        console.error(error)
        Notify.create({ color: 'negative', message: 'Erro ao atualizar o produto.' })
      }
    },
    cancelarEdicao() {
      this.produtoEditando = null
      this.editando = false
    },
    formatDate(data) {
      if (!data) return 'Indefinido'
      const d = new Date(data)
      return isNaN(d) ? 'Indefinido' : d.toLocaleDateString()
    }
  },
  mounted() {
    this.carregarProdutos()
  }
}
</script>

<style scoped>
.q-table .q-td {
  vertical-align: middle;
}
</style>
