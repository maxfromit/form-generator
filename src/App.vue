<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainWithLinks from './components/MainWithLinks.vue'
</script>

<template>
  <header>
    <MainWithLinks />
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
