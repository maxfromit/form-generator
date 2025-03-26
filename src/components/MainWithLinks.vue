<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
store.dispatch('fetchKeys')
// onMounted(() => {
//   store.dispatch('fetchFormData')
// })

const formKeys = computed(() => store.state.keys)
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <h1><RouterLink to="/">Form Generator</RouterLink></h1>

    <div style="display: flex; gap: 1rem">
      <nav v-for="dataKey in formKeys" :key="dataKey" style="text-transform: uppercase">
        <RouterLink :to="`/${dataKey}`">{{ dataKey }}</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}

nav a:last-of-type {
  border-right: 0;
  padding-right: 0rem;
}

nav a.router-link-active {
  color: var(--color-text);
}

nav a.router-link-active:hover {
  background-color: transparent;
}
</style>
