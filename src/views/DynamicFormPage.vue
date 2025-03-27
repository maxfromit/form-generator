<script setup lang="ts">
import { computed, watch, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'
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

console.log(' store.state.local', store.state?.localFormValues, typeof store.state?.localFormValues)
</script>

<template>
  <div class="flex flex-col flex-grow gap-2">
    <h1 v-if="!formStructure || formStructure.length === 0">Choose entity to get forms</h1>
    <div v-if="dataKey" class="flex flex-col gap-0-2">
      <div class="flex justify-between items-center flex-nowrap">
        <div>
          <h1 class="first-letter-uppercase">{{ dataKey }}</h1>
        </div>
        <div>
          <button @click="clearForm">Clear</button>
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
      @discard="resetToChoosen"
    >
      <!-- Custom slots for specific fields -->
      <template v-slot:[`field_1`]="{ field, index, model }">
        <div>Custom Input 1</div>
        <input v-model="model[index]" :id="`field-${field.id}`" type="text" />
      </template>

      <!-- <template v-slot:[`field_1`]>
        <div>
          Custom Input 1
          {{ formValueToEdit[0] }}
        </div>
        <input v-model="scope.something" :id="`field-1`" type="text" />
      </template>
      <template v-slot:[`textarea2`]>
        <div>Custom Textarea 2</div>
      </template> -->
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
</style>
