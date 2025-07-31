<template>
  <q-page class="bg-grey-1 q-pa-md" style="min-height: 100vh;">
    <div class="text-h5 q-mb-md">Controle de Validade</div>
    <div class="text-subtitle1 q-mb-lg">Confira Produtos Próximos do Vencimento</div>

    <div v-for="(produto, index) in produtos" :key="produto.eanOfProduct" class="q-mb-md">
      <q-card>
        <q-card-section>
          <div class="text-subtitle2">Produto {{ index + 1 }}</div>
          <q-input v-model="editando[produto.eanOfProduct].name" label="Nome" filled dense class="q-mb-sm" />
          <q-input v-model="editando[produto.eanOfProduct].validity" label="Validade" type="date" filled dense class="q-mb-sm" />
          <q-input v-model="editando[produto.eanOfProduct].description" label="Descrição" filled dense class="q-mb-sm" />
          <div class="text-caption">EAN: {{ produto.eanOfProduct }}</div>
          <div class="text-caption">Vence em: {{ produto.daysUntilExpiration }} dia(s)</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Atualizar"
            @click="atualizarProduto(produto.eanOfProduct)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const produtos = ref([])
const editando = ref({})

const carregarProdutos = async () => {
  try {
    const response = await axios.get('https://validity-controll-1.onrender.com/api/1/productcontrol/products')
    produtos.value = response.data

    editando.value = {}
    produtos.value.forEach(produto => {
      editando.value[produto.eanOfProduct] = {
        name: produto.name,
        validity: produto.validity,
        description: produto.description
      }
    })
  } catch (error) {
    console.error(error)
    Notify.create({
      color: 'negative',
      message: 'Erro ao buscar produtos.'
    })
  }
}

const atualizarProduto = async (ean) => {
  try {
    const dadosAtualizados = {
      ...editando.value[ean],
      ean: ean
    }

    await axios.put(`https://validity-controll-1.onrender.com/api/1/productcontrol/${ean}`, dadosAtualizados)

    Notify.create({
      color: 'positive',
      message: 'Produto atualizado com sucesso!'
    })

    carregarProdutos()
  } catch (error) {
    console.error(error)
    Notify.create({
      color: 'negative',
      message: 'Erro ao atualizar produto.'
    })
  }
}

onMounted(() => {
  carregarProdutos()
})
</script>

<style scoped>
.text-subtitle2 {
  font-weight: 500;
}
</style>
