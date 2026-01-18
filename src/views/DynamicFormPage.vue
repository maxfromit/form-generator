<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
import { hardcodedformData } from '@/const/hardcodedformData'

const router = useRouter()

const store = useStore()

const dataKey = computed(() =>
  router.currentRoute.value.params.dataKey &&
  typeof router.currentRoute.value.params.dataKey === 'string'
    ? router.currentRoute.value.params.dataKey
    : null,
)
const valueSource = computed(() => router.currentRoute.value.params.source ?? null)

const formKeys = computed(() => Object.keys(hardcodedformData))

const formStructure = computed(() =>
  dataKey.value && hardcodedformData[dataKey.value].structure
    ? hardcodedformData[dataKey.value].structure
    : [],
)

const formValuesFromHardCoded = computed(() =>
  typeof dataKey.value === 'string' &&
  !!hardcodedformData[dataKey.value] &&
  hardcodedformData[dataKey.value].values
    ? hardcodedformData[dataKey.value].values
    : [],
)

const formValuesFromLocal = computed(() =>
  dataKey.value &&
  store.state.localFormValues &&
  store.state.localFormValues[dataKey.value]?.values?.length > 0
    ? store.state.localFormValues[dataKey.value]?.values
    : [],
)

const chosenFormValues = computed(() => {
  if (valueSource.value === 'local' && formValuesFromLocal.value?.length > 0) {
    return [...formValuesFromLocal.value]
  }
  if (
    (!valueSource.value || valueSource.value !== 'local') &&
    formValuesFromHardCoded.value?.length > 0
  ) {
    return [...formValuesFromHardCoded.value]
  }

  return getClearedValues()
})

const getClearedValues = () =>
  formStructure.value.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const formValues = ref<ValueType[]>([])

watchEffect(() => {
  formValues.value = [...chosenFormValues.value]
})

const isValuesAndStructureLengthEqual = computed(
  () => formValues.value.length === formStructure.value.length,
)

const resetToChosen = () => {
  formValues.value = [...chosenFormValues.value]
}

const saveToStorage = () => {
  store.dispatch('saveToLocalStorage', {
    dataKey: dataKey.value,
    formValues: formValues.value,
  })
  if (valueSource.value === 'local') {
    return alert(`Data for "${getSpacedText(getUppercasedDataKey())}" has been saved successfully!`)
  }

  alert(
    `Data for "${getSpacedText(getUppercasedDataKey())}" has been saved successfully! You will be redirected to the Local Data Set tab`,
  )
  router.push(`/${dataKey.value}/local`)
}

const getUppercasedDataKey = () =>
  dataKey.value ? dataKey.value.charAt(0).toUpperCase() + dataKey.value.slice(1) : ''

const getSpacedText = (text: string) =>
  text && typeof text === 'string' ? text.replace(/-/g, ' ') : ''

const isNotBoolean = (value: ValueType) => typeof value !== 'boolean'

const showRawDataMenu = ref(false)

const toggleRawDataMenu = () => {
  showRawDataMenu.value = !showRawDataMenu.value
}
</script>

<template>
  <div v-if="formKeys.length > 0" class="flex flex-col flex-grow gap-lg">
    <div class="flex justify-center" v-if="!formStructure || formStructure.length === 0">
      <div>Choose entity to get form</div>
    </div>

    <div v-if="dataKey" class="flex flex-col gap-xs">
      <div class="flex justify-between items-center flex-nowrap gap-md">
        <div>
          <h1 class="first-letter-uppercase">{{ getSpacedText(dataKey) }}</h1>
        </div>
        <div>
          <button @click="toggleRawDataMenu" title="Click to show form raw data">
            {{ !showRawDataMenu ? 'Show raw data' : 'Hide raw data' }}
          </button>
        </div>
      </div>

      <div v-if="showRawDataMenu" class="flex justify-center">
        <div
          class="flex flex-col gap-md"
          style="
            max-width: 22rem;
            background: #f9f9f9;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 8px;
          "
        >
          <div class="flex flex-col gap-xs">
            <div class="text-bold">Form structure:</div>
            <div>{{ formStructure }}</div>
          </div>
          <div class="flex flex-col gap-xs">
            <div class="text-bold">Form values:</div>
            <div>{{ chosenFormValues }}</div>
          </div>
        </div>
      </div>

      <div v-if="formValuesFromLocal.length > 0" class="flex gap-md">
        <nav>
          <RouterLink :to="`/${dataKey}/`">Fetched data set</RouterLink>
        </nav>
        <nav>
          <RouterLink :to="`/${dataKey}/local`">Local data set</RouterLink>
        </nav>
      </div>
    </div>

    <div v-if="!isValuesAndStructureLengthEqual" style="color: red">
      Error: values and structure length are not equal
    </div>

    <GeneratedForm
      v-if="
        !!formStructure &&
        formStructure.length > 0 &&
        !!formValues &&
        isValuesAndStructureLengthEqual
      "
      :structure="formStructure"
      v-model="formValues"
      @save="saveToStorage"
      @cancel="resetToChosen"
    >
      <!-- Custom slots for specific fields -->
      <template
        v-if="dataKey === 'animals-with-slots'"
        v-slot:[`field_1`]="{ field, index, model }"
      >
        <div>Input from slot 1: {{ field.label }}</div>

        <input v-model="model[index]" :id="`field-${field.id}`" type="text" />
      </template>

      <template
        v-if="dataKey === 'animals-with-slots'"
        v-slot:[`field_4`]="{ field, index, model }"
      >
        <div>Textarea from slot 4: {{ field.label }}</div>
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

.text-bold {
  font-weight: bold;
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
