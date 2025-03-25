<script setup lang="ts">
import { defineComponent, computed, onMounted, watch, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { FormData, FormValue, FormField, FormDataCollection } from '@/types/db-types'
import GeneratedForm from '@/components/GeneratedForm.vue'
const router = useRouter()

const store = useStore()

const dataKey = computed(() => router.currentRoute.value.params.dataKey)
const valueIndex = computed(() =>
  router.currentRoute.value.params.id && typeof router.currentRoute.value.params.id === 'string'
    ? parseInt(router.currentRoute.value.params.id, 10)
    : null,
)

watch(
  () => dataKey.value,
  (newKey) => {
    if (newKey) {
      store.dispatch('fetchDataByKey', dataKey.value)
    }
  },
  { immediate: true },
)
console.log('fetchDataByKey', store)
const formStructure = computed(() => store.state.formStructure ?? [])
const formValuesFromDb = computed(() => store.state.formValues ?? [])
const formValuesFromLocal = computed(() =>
  dataKey.value ? store.state.local[dataKey.value]?.values || [] : [],
)

const choosenFormValues = computed(() => {
  if (valueIndex.value !== null && formValuesFromDb.value.length > 0) {
    return formValuesFromDb.value[valueIndex.value]
  }
  if (formValuesFromLocal.value.length > 0) {
    return formValuesFromLocal.value
  }
  // Generate default form values based on formStructure
  return formStructure.value.map((field: FormField) => ({
    id: field.id,
    value: field.type === 'checkbox' ? false : null, // Default value for checkboxes is false, otherwise null
  }))
})

const formValueToEdit = ref<FormValue[]>([])

watchEffect(() => {
  formValueToEdit.value = [...choosenFormValues.value]
})

const navigateToNew = () => {
  router.push(`/${dataKey.value}/new`)
}

const saveToStorage = (dataValue: FormValue[]) => {
  console.log('data', dataValue)
  formValueToEdit.value = [...dataValue]
  // Dispatch the Vuex action with dataKey and formValues
  store.dispatch('saveToLocalStorage', {
    dataKey: dataKey.value, // Pass the current dataKey
    formValues: formValueToEdit.value, // Pass the updated formValues
  })
}

const clearStorage = () => {
  store.dispatch('clearLocalStorage', dataKey.value)
}
</script>

<template>
  <div>
    <div>store.state {{ store.state }}</div>
    <div>formValueToEdit {{ formValueToEdit }}</div>
    <h1 v-if="dataKey">{{ dataKey }}</h1>
    <h1 v-if="!valueIndex">
      {{ !!formStructure && formStructure.length > 0 ? 'Saved data' : 'No choosen form' }}
    </h1>
    <button @click="navigateToNew">Create New</button>
    <button @click="clearStorage">Clear LocalStorage</button>
    <div>formStructure {{ formStructure }}</div>

    <div>formValuesFromDb {{ formValuesFromDb }}</div>
    <div>choosenFormValues {{ choosenFormValues }}</div>
    <div>valueIndex.value {{ valueIndex }}</div>
    <nav v-for="(value, index) in formValuesFromDb" :key="index">
      <RouterLink :to="`/${dataKey}/${index}`">Form {{ index + 1 }}</RouterLink>
    </nav>
    <GeneratedForm
      v-if="!!formStructure && formStructure.length > 0 && !!formValueToEdit"
      :formStructure="formStructure"
      v-model:formValueToEdit="formValueToEdit"
      @save="saveToStorage"
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
