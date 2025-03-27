import { createStore } from 'vuex'
import { useStorage, StorageSerializers } from '@vueuse/core'

import type { ValueType, FormCollection, FieldDefinition } from '@/components/FormGenerator/types'

type State = {
  localFormValues: Record<string, { values: ValueType[] }> | null // Reactive and synced with localStorage
}

const state: State = {
  localFormValues: useStorage('localData', null, undefined, {
    serializer: StorageSerializers.object,
  }),
}

export default createStore({
  state,

  actions: {
    saveToLocalStorage(
      { state }: { state: State },
      { dataKey, formValues }: { dataKey: string; formValues: ValueType[] },
    ) {
      if (!state.localFormValues) {
        state.localFormValues = {} // Initialize as an empty object
      }

      if (!state.localFormValues[dataKey]) {
        state.localFormValues[dataKey] = { values: [] }
      }

      state.localFormValues[dataKey].values = formValues
      console.log(`Data saved to localStorage under key "${dataKey}"`, formValues)
    },
  },
})
