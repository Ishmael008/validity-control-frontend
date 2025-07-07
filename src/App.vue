<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Controle de Validade</q-toolbar-title>

        <!-- Botões de navegação no header -->
        <q-btn to="/register" label="Cadastrar" flat />
        <q-btn to="/" label="Login" flat />
        
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'App'
}
</script>
