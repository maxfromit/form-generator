<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { hardcodedformData } from '@/const/hardcodedformData'

const formKeys = Object.keys(hardcodedformData)
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <h1><RouterLink to="/">Form Generator</RouterLink></h1>
    <div class="flex gap-1">
      <nav v-for="dataKey in formKeys" :key="dataKey" style="text-transform: uppercase">
        <RouterLink :to="`/${dataKey}`">{{ dataKey.replace(/-/g, ' ') }}</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.gap-1 {
  gap: 1rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
}

nav a.router-link-active {
  color: var(--color-text);
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

nav a.router-link-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
}
</style>
