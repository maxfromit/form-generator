<script setup lang="ts">
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { convertDataKeyToTitle } from '@/utils/formatters'

const router = useRouter()
const route = useRoute()

const dataKey = computed(() =>
  Array.isArray(route.params.dataKey) ? route.params.dataKey[0] : route.params.dataKey,
)
const sourceKey = computed(() => route.params.source ?? null)

const store = useStore()

const formKeys = computed(() => Object.keys(hardcodedFormData))

const formValuesFromHardCoded = computed(() =>
  !!hardcodedFormData[dataKey.value] && hardcodedFormData[dataKey.value].values
    ? hardcodedFormData[dataKey.value].values
    : [],
)

const formValuesFromLocal = computed(() =>
  store.state.localFormValues && store.state.localFormValues[dataKey.value]?.values?.length > 0
    ? store.state.localFormValues[dataKey.value]?.values
    : [],
)

const formStructure = computed(() =>
  dataKey.value && hardcodedFormData[dataKey.value].structure
    ? hardcodedFormData[dataKey.value].structure
    : [],
)

const getClearedValues = () =>
  formStructure.value.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const resolvedFormValues = computed(() => {
  if (sourceKey.value === 'local' && formValuesFromLocal.value?.length > 0) {
    return [...formValuesFromLocal.value]
  }
  if (
    (!sourceKey.value || sourceKey.value !== 'local') &&
    formValuesFromHardCoded.value?.length > 0
  ) {
    return [...formValuesFromHardCoded.value]
  }

  return getClearedValues()
})

const formValues = ref<ValueType[]>([])

watchEffect(() => {
  formValues.value = [...resolvedFormValues.value]
})

const isValuesAndStructureLengthEqual = computed(
  () => formValues.value.length === formStructure.value.length,
)

const saveToStorage = () =>
  store
    .dispatch('saveToLocalStorage', {
      dataKey: dataKey.value,
      formValues: formValues.value,
    })
    .then(() => {
      if (sourceKey.value === 'local') {
        return alert(
          `Data for "${convertDataKeyToTitle(dataKey.value)}" has been saved successfully!`,
        )
      }
      alert(
        `Data for "${convertDataKeyToTitle(dataKey.value)}" has been saved successfully! You will be redirected to the Local Data Set tab`,
      )
      router.push(`/${dataKey.value}/local`)
    })

const reset = () => {
  formValues.value = [...resolvedFormValues.value]
}

const isRawDataMenuShown = ref(false)
</script>

<template>
  <div v-if="!!formKeys?.length" class="flex flex-col flex-grow gap-lg">
    <div class="flex justify-center" v-if="!formStructure || formStructure.length === 0">
      <div>Choose entity to get form</div>
    </div>

    <div v-if="dataKey" class="flex flex-col gap-xs">
      <div class="flex justify-between items-center flex-nowrap gap-md">
        <div>
          <h1>{{ convertDataKeyToTitle(dataKey) }}</h1>
        </div>
        <div>
          <button
            @click="isRawDataMenuShown = !isRawDataMenuShown"
            title="Click to show form raw data"
          >
            {{ !isRawDataMenuShown ? 'Show raw data' : 'Hide raw data' }}
          </button>
        </div>
      </div>

      <div v-if="isRawDataMenuShown" class="flex justify-center">
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
            <code>{{ formStructure }}</code>
          </div>
          <div class="flex flex-col gap-xs">
            <div class="text-bold">Form values:</div>
            <code>{{ resolvedFormValues }}</code>
          </div>
        </div>
      </div>

      <div v-if="formValuesFromLocal.length > 0" class="flex gap-md">
        <nav>
          <RouterLink :to="`/${dataKey}/`">"Fetched" data set</RouterLink>
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
      @reset="reset"
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
          v-if="typeof model[index] !== 'boolean'"
          v-model="model[index]"
          :id="`field-${field.id}`"
        />
      </template>
    </GeneratedForm>
  </div>

  <div v-if="!formKeys?.length" style="color: red">
    <div>No data found</div>
  </div>
</template>

<style scoped>
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
