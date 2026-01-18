<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { hardcodedFormData } from '@/const/hardcodedFormData'

const formKeys = Object.keys(hardcodedFormData)
</script>

<template>
  <div class="flex flex-col gap-xs pb-xs">
    <h1><RouterLink to="/">Form Generator</RouterLink></h1>
    <div class="flex flex-row flex-wrap gap-md">
      <nav v-for="dataKey in formKeys" :key="dataKey" class="text-nowrap uppercase">
        <RouterLink :to="`/${dataKey}`">{{ dataKey.replace(/-/g, ' ') }}</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}
</style>
