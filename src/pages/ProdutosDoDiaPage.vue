<template>
  <q-page class="bg-grey-2 q-pa-md" style="min-height: 100vh;">
    <div class="text-h5 text-center q-mb-md text-primary">Controle de Validade</div>
    <div class="text-subtitle1 text-center q-mb-lg">Confira Produtos Próximos do Vencimento</div>

    <q-separator class="q-my-md" />

    <div class="q-gutter-md row items-stretch justify-center">
      <q-card
        v-for="produto in produtos"
        :key="produto.ean"
        class="my-card col-xs-12 col-sm-6 col-md-4"
        flat
        bordered
        style="max-width: 350px;"
      >
        <q-card-section>
          <div class="text-h6">{{ produto.name }}</div>
          <div class="text-subtitle2">EAN: {{ produto.ean }}</div>
          <div class="text-body2">Validade: {{ produto.validity || 'Indefinido' }}</div>
          <div class="text-body2">Vence em: {{ produto.remainingDays }} dia(s)</div>
          <div class="text-caption q-mt-sm">Descrição: {{ produto.description }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            label="Atualizar"
            color="primary"
            flat
            @click="atualizarProduto(produto)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'

const produtos = ref([])

const carregarProdutos = async () => {
  try {
    const response = await fetch('https://validity-controll-1.onrender.com/api/1/productcontrol/proximos-vencimento')
    const data = await response.json()
    produtos.value = data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    Notify.create({
      type: 'negative',
      message: 'Erro ao carregar os produtos do dia.'
    })
  }
}

const atualizarProduto = async (produto) => {
  try {
    const response = await fetch(`https://validity-controll-1.onrender.com/api/1/productcontrol/${produto.ean}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produto)
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar produto')
    }

    const atualizado = await response.json()

    // Atualiza produto na lista local
    const index = produtos.value.findIndex(p => p.ean === produto.ean)
    if (index !== -1) {
      produtos.value[index] = atualizado
    }

    Notify.create({
      type: 'positive',
      message: `Produto "${produto.name}" atualizado com sucesso!`
    })
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    Notify.create({
      type: 'negative',
      message: `Erro ao atualizar o produto "${produto.name}".`
    })
  }
}

onMounted(() => {
  carregarProdutos()
})
</script>

<style scoped>
.my-card {
  transition: box-shadow 0.2s ease-in-out;
}
.my-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
