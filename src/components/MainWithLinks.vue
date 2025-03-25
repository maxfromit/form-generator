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
  <div>
    <h1><RouterLink to="/">Form Generator</RouterLink></h1>

    <div style="display: flex">
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
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
  padding-left: 0rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
