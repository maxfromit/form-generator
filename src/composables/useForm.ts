import type { FieldDefinition, FormStructure } from '@/components/FormGenerator/types'
import { computed, type Ref } from 'vue'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { useStore } from 'vuex'

const getClearedValues = (formStructure: FormStructure) =>
  formStructure.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const useForm = (dataKey: Ref<string>, sourceKey?: Ref<string>) => {
  const store = useStore()

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
    dataKey && hardcodedFormData[dataKey.value].structure
      ? hardcodedFormData[dataKey.value].structure
      : [],
  )

  const resolvedFormValues = computed(() => {
    if (sourceKey?.value === 'local' && formValuesFromLocal.value?.length > 0) {
      return [...formValuesFromLocal.value]
    }
    if ((!sourceKey || sourceKey.value !== 'local') && formValuesFromHardCoded.value?.length > 0) {
      return [...formValuesFromHardCoded.value]
    }

    return getClearedValues(formStructure.value)
  })

  return {
    resolvedFormValues,
    formStructure,
    formValuesFromLocal,
  }
}

export { useForm }
