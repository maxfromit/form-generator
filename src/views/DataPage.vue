<script setup lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { FormData, FormValue, FormField, FormDataCollection } from '@/types/db-types'
import GeneratedForm from '@/components/GeneratedForm.vue'
const router = useRouter()

const store = useStore()

const dataKey = computed(() => router.currentRoute.value.params.dataKey)
const valueIndex = computed(() => router.currentRoute.value.params.id)

watch(
  dataKey,
  (newKey) => {
    if (newKey) {
      store.dispatch('fetchDataByKey', newKey)
    } else {
      // If dataKey is null, load data from localStorage
      store.dispatch('loadFromLocalStorage')
    }
  },
  { immediate: true },
)
console.log('fetchDataByKey', store.state.formStructure)
const formStructure = computed(() => store.state.formStructure)
const formValues = computed(() => store.state.formValues)

const choosenFormValues = computed(() =>
  store.state.formValues.length === 0
    ? [...([] as FormValue[])]
    : valueIndex.value
      ? store.state.formValues[valueIndex.value]
      : store.state.formValues,
)

const formValueToEdit = ref<FormValue[]>([])

watch(
  choosenFormValues,
  (newValues) => {
    formValueToEdit.value = newValues
  },
  { immediate: true },
)

const navigateToNew = () => {
  router.push(`/${dataKey.value}/new`)
}

const saveToStorage = (updatedValues: FormValue[]) => {
  console.log('saveToStorage', updatedValues)
  // Dispatch the Vuex action with emitted formValues and computed formStructure
  store.dispatch('saveToLocalStorage', {
    formValues: updatedValues,
    formStructure: formStructure.value,
  })
}

const clearStorage = () => {
  store.dispatch('clearLocalStorage')
}
</script>

<template>
  <div>
    <h1>dataKey {{ dataKey }}</h1>

    <button @click="navigateToNew">Create New</button>
    <button @click="clearStorage">Clear LocalStorage</button>
    formValues {{ formValues }}
    <nav v-for="(value, index) in formValues" :key="index">
      <RouterLink :to="`/${dataKey}/${index}`">Form {{ index + 1 }}</RouterLink>
    </nav>
    <GeneratedForm
      :formStructure="formStructure"
      :formValueToEdit="formValueToEdit"
      @update:modelValue="saveToStorage"
    />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
