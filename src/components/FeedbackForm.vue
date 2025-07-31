<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md shadow-10" style="max-width: 600px; margin: auto;">
      <q-card-section>
        <div class="text-h5 text-center">Feedback do Produto</div>
        <q-form @submit.prevent="enviarFeedback">
          <q-input v-model="question1" label="O produto estava em boas condições?" filled class="q-mb-md" />
          <q-input v-model="question2" label="Você compraria esse produto novamente?" filled class="q-mb-md" />
          <q-btn label="Enviar Feedback" type="submit" color="primary" class="full-width" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const route = useRoute()
const router = useRouter()

const ean = ref('')
const question1 = ref('')
const question2 = ref('')

onMounted(() => {
  ean.value = route.params.ean || ''
})

const enviarFeedback = async () => {
  try {
    await axios.post('https://validity-controll-1.onrender.com/api/1/productcontrol/feedback', {
      eanOfProduct: ean.value,
      questionOfProduct1: question1.value,
      questionOfProduct2: question2.value,
      createdAtProduct: new Date().toISOString()
    })
    Notify.create({ color: 'positive', message: 'Feedback enviado com sucesso!' })
    router.push('/produtos-do-dia')
  } catch (error) {
    Notify.create({ color: 'negative', message: 'Erro ao enviar feedback.' })
  }
}
</script>
