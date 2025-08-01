<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <div class="text-h6">Enviar Feedback para o produto</div>
        <div class="text-subtitle2 text-primary">EAN: {{ ean }}</div>
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="question1" label="Achou o produto?" />
        <q-input filled v-model="question2" label="Algum comentário adicional?" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Enviar" color="primary" @click="enviarFeedback" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { Notify } from 'quasar'

export default {
  data() {
    return {
      ean: this.$route.params.ean,
      question1: '',
      question2: ''
    }
  },
  methods: {
    async enviarFeedback() {
      try {
        const response = await fetch('https://validity-controll-1.onrender.com/api/1/productcontrol/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            eanOfProduct: this.ean,
            questionOfProduct1: this.question1,
            questionOfProduct2: this.question2,
            createdAtProduct: new Date().toISOString()
          })
        })

        if (!response.ok) throw new Error('Erro ao enviar feedback')

        Notify.create({
          message: 'Feedback enviado com sucesso!',
          color: 'positive'
        })

        this.$router.push('/')
      } catch (error) {
        console.error(error)
        Notify.create({
          message: 'Erro ao enviar feedback.',
          color: 'negative'
        })
      }
    }
  }
}
</script>
