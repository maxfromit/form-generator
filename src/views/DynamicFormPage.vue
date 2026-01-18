<script setup lang="ts">
import type { ValueType } from '@/components/FormGenerator/types'
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { convertDataKeyToTitle } from '@/utils/formatters'
import { useForm } from '@/composables/useForm'

const router = useRouter()
const route = useRoute()

const dataKey = computed(() =>
  Array.isArray(route.params.dataKey) ? route.params.dataKey[0] : route.params.dataKey,
)
const sourceKey = computed(() =>
  Array.isArray(route.params.source) ? route.params.source[0] : (route.params.source ?? null),
)

const store = useStore()

const formKeys = Object.keys(hardcodedFormData)

const { formStructure, resolvedFormValues, formValuesFromLocal } = useForm(dataKey, sourceKey)

const currentFormValues = ref<ValueType[]>([])

watchEffect(() => {
  currentFormValues.value = [...resolvedFormValues.value]
})

const isValuesAndStructureLengthEqual = computed(
  () => currentFormValues.value?.length === formStructure.value?.length,
)

const saveToStorage = () =>
  store
    .dispatch('saveToLocalStorage', {
      dataKey: dataKey.value,
      formValues: currentFormValues.value,
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

const resetToResolved = () => {
  currentFormValues.value = [...resolvedFormValues.value]
}

const isRawDataVisible = ref(false)
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
          <button @click="isRawDataVisible = !isRawDataVisible" title="Click to show form raw data">
            {{ !isRawDataVisible ? 'Show raw data' : 'Hide raw data' }}
          </button>
        </div>
      </div>

      <div v-if="isRawDataVisible" class="flex justify-center">
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
      v-if="!!formStructure?.length && !!currentFormValues && isValuesAndStructureLengthEqual"
      :structure="formStructure"
      v-model="currentFormValues"
      @save="saveToStorage"
      @reset="resetToResolved"
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
