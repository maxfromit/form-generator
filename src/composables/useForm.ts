import type { FieldDefinition, FormStructure } from '@/components/FormGenerator/types'
import { computed, type Ref } from 'vue'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { useStore } from 'vuex'

const getClearedValues = (formStructure: FormStructure) =>
  formStructure.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const useForm = (currentDataKey: Ref<string>, currentSourceKey?: Ref<string>) => {
  const store = useStore()

  const formValuesFromHardCoded = computed(() =>
    !!hardcodedFormData[currentDataKey.value] && hardcodedFormData[currentDataKey.value]?.values
      ? hardcodedFormData[currentDataKey.value].values
      : [],
  )

  const formValuesFromLocal = computed(() =>
    store.state.localFormValues &&
    store.state.localFormValues[currentDataKey.value]?.values?.length > 0
      ? store.state.localFormValues[currentDataKey.value].values
      : [],
  )

  const currentFormStructure = computed(() =>
    currentDataKey && hardcodedFormData[currentDataKey.value]?.structure
      ? hardcodedFormData[currentDataKey.value].structure
      : [],
  )

  const resolvedFormValues = computed(() => {
    if (currentSourceKey?.value) {
      if (currentSourceKey?.value === 'local')
        if (formValuesFromLocal.value?.length > 0) return [...formValuesFromLocal.value]
    }

    if (formValuesFromHardCoded.value?.length > 0) return [...formValuesFromHardCoded.value]

    return getClearedValues(currentFormStructure.value)
  })

  return {
    resolvedFormValues,
    currentFormStructure,
    formValuesFromLocal,
  }
}

export { useForm }
