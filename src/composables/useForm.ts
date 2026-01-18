import type { FieldDefinition, FormStructure } from '@/components/FormGenerator/types'
import { computed, type Ref } from 'vue'
import { hardcodedFormData } from '@/const/hardcodedFormData'
import { useStore } from 'vuex'

const getClearedValues = (formStructure: FormStructure) =>
  formStructure.map((field: FieldDefinition) => (field.type === 'checkbox' ? false : null))

const useForm = (dataKey: Ref<string>, sourceKey?: Ref<string>) => {
  const store = useStore()

  const formValuesFromHardCoded = computed(() =>
    !!hardcodedFormData[dataKey.value] && hardcodedFormData[dataKey.value]?.values
      ? hardcodedFormData[dataKey.value].values
      : [],
  )

  const formValuesFromLocal = computed(() =>
    store.state.localFormValues && !!store.state.localFormValues[dataKey.value]?.values?.length
      ? store.state.localFormValues[dataKey.value].values
      : [],
  )

  const formStructure = computed(() =>
    dataKey && hardcodedFormData[dataKey.value]?.structure
      ? hardcodedFormData[dataKey.value].structure
      : [],
  )

  const resolvedFormValues = computed(() => {
    if (sourceKey?.value) {
      if (sourceKey?.value === 'local')
        if (!!formValuesFromLocal.value?.length) return [...formValuesFromLocal.value]
    }

    if (!!formValuesFromHardCoded.value?.length) return [...formValuesFromHardCoded.value]

    return getClearedValues(formStructure.value)
  })

  return {
    resolvedFormValues,
    formStructure,
    formValuesFromLocal,
  }
}

export { useForm }
