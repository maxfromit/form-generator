<script setup lang="ts">
import type { ValueType } from '@/components/FormGenerator/types'
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { convertDataKeyToTitle } from '@/utils/formatters'
import { useForm } from '@/composables/useForm'
import GeneratedForm from '@/components/FormGenerator/FormGenerator.vue'
import RawDataCard from '@/components/RawDataCard.vue'

const router = useRouter()
const route = useRoute()

const currentDataKey = computed(() =>
  Array.isArray(route.params.dataKey) ? route.params.dataKey[0] : route.params.dataKey,
)
const currentSourceKey = computed(() =>
  Array.isArray(route.params.source) ? route.params.source[0] : (route.params.source ?? null),
)

const store = useStore()

const availableFormDataKeys = Object.keys(hardcodedFormData)

const { currentFormStructure, resolvedFormValues, formValuesFromLocal } = useForm(
  currentDataKey,
  currentSourceKey,
)

const currentFormValues = ref<ValueType[]>([])

watchEffect(() => {
  currentFormValues.value = [...resolvedFormValues.value]
})

const isValuesAndStructureLengthEqual = computed(
  () => currentFormValues.value?.length === currentFormStructure.value?.length,
)

const saveToStorage = () =>
  store
    .dispatch('saveToLocalStorage', {
      dataKey: currentDataKey.value,
      formValues: currentFormValues.value,
    })
    .then(() => {
      if (currentSourceKey.value === 'local') {
        return alert(
          `Data for "${convertDataKeyToTitle(currentDataKey.value)}" has been saved successfully!`,
        )
      }
      alert(
        `Data for "${convertDataKeyToTitle(currentDataKey.value)}" has been saved successfully! You will be redirected to the Local Data Set tab`,
      )
      router.push(`/${currentDataKey.value}/local`)
    })

const resetToResolved = () => {
  currentFormValues.value = [...resolvedFormValues.value]
}

const isRawDataVisible = ref(false)
</script>

<template>
  <div v-if="availableFormDataKeys?.length > 0" class="flex flex-col flex-grow gap-lg">
    <template v-if="currentFormStructure?.length > 0">
      <div v-if="currentDataKey" class="flex flex-col gap-xs">
        <div class="flex justify-between items-center flex-nowrap gap-md">
          <div>
            <h1>{{ convertDataKeyToTitle(currentDataKey) }}</h1>
          </div>
          <div>
            <button
              @click="isRawDataVisible = !isRawDataVisible"
              title="Click to show form raw data"
            >
              {{ !isRawDataVisible ? 'Show raw data' : 'Hide raw data' }}
            </button>
          </div>
        </div>

        <RawDataCard
          v-if="isRawDataVisible"
          :formStructure="currentFormStructure"
          :resolvedFormValues="resolvedFormValues"
        />

        <div v-if="formValuesFromLocal?.length > 0" class="flex gap-md">
          <nav>
            <RouterLink :to="`/${currentDataKey}/`">"Fetched" data set</RouterLink>
          </nav>
          <nav>
            <RouterLink :to="`/${currentDataKey}/local`">Local data set</RouterLink>
          </nav>
        </div>
      </div>

      <template v-if="isValuesAndStructureLengthEqual">
        <GeneratedForm
          v-if="currentFormValues?.length > 0"
          :structure="currentFormStructure"
          v-model="currentFormValues"
          @save="saveToStorage"
          @reset="resetToResolved"
        >
          <!-- Custom slots for specific fields -->
          <template
            v-if="currentDataKey === 'animals-with-slots'"
            v-slot:[`field_1`]="{ field, index, model }"
          >
            <div>Input from slot 1: {{ field.label }}</div>

            <input v-model="model[index]" :id="`field-${field.id}`" type="text" />
          </template>

          <template
            v-if="currentDataKey === 'animals-with-slots'"
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

        <div v-else class="flex justify-center" style="color: red">
          Error: there are no form values
        </div>
      </template>

      <div v-else style="color: red">Error: values and structure length are not equal</div>
    </template>

    <div v-else class="flex justify-center">
      <div>Choose entity to get form</div>
    </div>
  </div>

  <div v-if="!availableFormDataKeys?.length" style="color: red">
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
