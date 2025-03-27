<script setup lang="ts">
import { computed, watch, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
import { hardcodedformData } from '@/const/formData'
const router = useRouter()

const store = useStore()

const dataKey = computed(() => router.currentRoute.value.params.dataKey ?? null)
const valueIndex = computed(() =>
  router.currentRoute.value.params.id ? router.currentRoute.value.params.id : null,
)
store.dispatch('fetchKeys')
const formKeys = computed(() =>
  store.state.keys.length > 0 ? store.state.keys : Object.keys(hardcodedformData),
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
const formStructure = computed(() =>
  store.state.formStructure.length > 0
    ? store.state.formStructure
    : typeof dataKey.value === 'string' && hardcodedformData[dataKey.value].structure
      ? hardcodedformData[dataKey.value].structure
      : [],
)

const formValuesFromDb = computed(() =>
  store.state.fetchedFormValues.length > 0
    ? store.state.fetchedFormValues
    : typeof dataKey.value === 'string' && hardcodedformData[dataKey.value].values
      ? hardcodedformData[dataKey.value].values
      : [],
)

const formValuesFromLocal = computed(() =>
  dataKey.value &&
  store.state.localFormValues[dataKey.value]?.values &&
  store.state.localFormValues[dataKey.value]?.values.length > 0
    ? store.state.localFormValues[dataKey.value]?.values
    : getClearedValues(),
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

const isValuesAndStructureLengthEqual = computed(
  () => formValueToEdit.value.length === formStructure.value.length,
)

const resetToChoosen = () => {
  formValueToEdit.value = [...choosenFormValues.value]
}

const saveToStorage = () => {
  store.dispatch('saveToLocalStorage', {
    dataKey: dataKey.value,
    formValues: formValueToEdit.value,
  })
  router.push(`/${dataKey.value}/`)
}

const clearForm = () => {
  formValueToEdit.value = [...getClearedValues()]
}

// const hasFormChanged = computed(() => {
//   return JSON.stringify(formValueToEdit.value) !== JSON.stringify(choosenFormValues.value)
// })
const isNotBoolean = (value: ValueType) => typeof value !== 'boolean'
</script>

<template>
  <div v-if="formKeys.length > 0" class="flex flex-col flex-grow gap-2">
    <h1 v-if="!formStructure || formStructure.length === 0">Choose entity to get form</h1>
    <div v-if="dataKey" class="flex flex-col gap-0-2">
      <div class="flex justify-between items-center flex-nowrap">
        <div>
          <h1 class="first-letter-uppercase">{{ dataKey }}</h1>
        </div>
        <div>
          <button @click="clearForm" title="Click to clear all fields in the form">Clear</button>
        </div>
      </div>

      <div class="flex gap-1">
        <nav>
          <RouterLink :to="`/${dataKey}/`">Local Data Set</RouterLink>
        </nav>
        <nav>
          <RouterLink :to="`/${dataKey}/fetched`">Fetched Data Set</RouterLink>
        </nav>
      </div>
    </div>
    <div v-if="!isValuesAndStructureLengthEqual" style="color: red">
      Error: Values and structure length are not equal
    </div>
    <GeneratedForm
      v-if="
        !!formStructure &&
        formStructure.length > 0 &&
        !!formValueToEdit &&
        isValuesAndStructureLengthEqual
      "
      :structure="formStructure"
      v-model="formValueToEdit"
      @save="saveToStorage"
      @cancel="resetToChoosen"
    >
      <!-- Custom slots for specific fields -->
      <template v-slot:[`field_1`]="{ field, index, model }">
        <div>Input From Slot 1: {{ field.label }}</div>

        <input v-model="model[index]" :id="`field-${field.id}`" type="text" />
      </template>

      <template v-slot:[`field_4`]="{ field, index, model }">
        <div>Textarea From Slot 4: {{ field.label }}</div>
        <textarea
          v-if="isNotBoolean(model[index])"
          v-model="model[index]"
          :id="`field-${field.id}`"
        />
      </template>
    </GeneratedForm>
  </div>

  <div v-if="formKeys.length === 0" style="color: red">
    <div>No data found</div>
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

input,
textarea,
select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #2da53b;
  border-radius: 8px;
}

input[type='checkbox'] {
  width: auto;
}
</style>
