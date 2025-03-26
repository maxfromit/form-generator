<script setup lang="ts">
import { computed, watch, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { FormModel, ValueType, FieldDefinition } from '@/components/FormGenerator/types'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
const router = useRouter()

const store = useStore()

const dataKey = computed(() => router.currentRoute.value.params.dataKey ?? null)
const valueIndex = computed(() =>
  router.currentRoute.value.params.id ? router.currentRoute.value.params.id : null,
)

watch(
  () => dataKey.value,
  (newKey) => {
    if (newKey) {
      store.dispatch('fetchDataByKey', dataKey.value)
    }
    if (!newKey) store.commit('clearFetchedForm')
  },
  { immediate: true },
)
console.log('store.state.localFormValues', store.state.localFormValues)
const formStructure = computed(() => store.state.formStructure ?? [])
const formValuesFromDb = computed(() => store.state.fetchedFormValues ?? [])
const formValuesFromLocal = computed(() =>
  dataKey.value ? store.state.localFormValues[dataKey.value]?.values || [] : [],
)

const choosenFormValues = computed(() => {
  if (valueIndex.value === 'fetched' && formValuesFromDb.value.length > 0) {
    return [...formValuesFromDb.value]
  }
  // if (!valueIndex.value && formValuesFromLocal.value.length > 0) {
  return [...formValuesFromLocal.value]
  // }
  // return getClearedValues()
})

const getClearedValues = () =>
  formStructure.value.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const formValueToEdit = ref<ValueType[]>([])

watchEffect(() => {
  formValueToEdit.value = [...choosenFormValues.value]
})

const saveToStorage = (dataValue: FormModel) => {
  formValueToEdit.value = [...dataValue]
  store.dispatch('saveToLocalStorage', {
    dataKey: dataKey.value,
    formValues: formValueToEdit.value,
  })
  router.push(`/${dataKey.value}/`)
}

const clearForm = () => {
  formValueToEdit.value = [...getClearedValues()]
}

console.log(' store.state.local', store.state?.localFormValues, typeof store.state?.localFormValues)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem">
    <div style="display: flex; flex-direction: column; gap: 0.2rem">
      <div style="display: flex; justify-content: space-between; flex-wrap: nowrap">
        <div>
          <h1 v-if="dataKey" style="text-transform: uppercase">{{ dataKey }}</h1>
          <div v-if="!formStructure || formStructure.length === 0">Choose entity to get forms</div>
        </div>
        <div>
          <button @click="clearForm">Clear</button>
        </div>
      </div>

      <div style="display: flex; gap: 1rem">
        <nav>
          <RouterLink :to="`/${dataKey}/`">Local Data Set</RouterLink>
        </nav>
        <nav>
          <RouterLink :to="`/${dataKey}/fetched`">Fetched Data Set</RouterLink>
        </nav>
      </div>
    </div>

    <GeneratedForm
      v-if="!!formStructure && formStructure.length > 0 && !!formValueToEdit"
      :structure="formStructure"
      v-model="formValueToEdit"
      @save="saveToStorage"
    >
      <!-- Custom slots for specific fields -->
      <template v-slot:[`field_1`]>
        <div>
          Custom Input 1
          {{ formValueToEdit[0] }}
        </div>
      </template>
      <template v-slot:[`textarea2`]>
        <div>Custom Textarea 2</div>
      </template>
    </GeneratedForm>
  </div>
</template>

<style scoped>
nav a.router-link-active {
  color: var(--color-text);
}

nav a.router-link-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
