<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderWithLinks from './components/HeaderWithLinks.vue'
</script>

<template>
  <header>
    <HeaderWithLinks />
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
