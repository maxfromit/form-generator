import { createStore } from 'vuex'
import axios from 'axios'
import { useStorage, StorageSerializers } from '@vueuse/core'

import type { ValueType, FormCollection, FieldDefinition } from '@/components/FormGenerator/types'

type State = {
  keys: string[] // All keys from the database
  formStructure: FieldDefinition[] | null // Structure of the form for a specific key
  fetchedFormValues: ValueType[] // Array of values for a specific key
  // localFormValues: RemovableRef<Record<string, { values: ValueType[] }> | null> // Reactive and synced with localStorage
  localFormValues: Record<string, { values: ValueType[] }> | null // Reactive and synced with localStorage
}

const state: State = {
  keys: [], // All keys from the database
  formStructure: [], // Structure of the form for a specific key
  fetchedFormValues: [], // Values fetched from db.json
  localFormValues: useStorage('localData', null, undefined, {
    serializer: StorageSerializers.object,
  }), // Automatically synced with localStorage

  // localFormValues: useStorage('localData', null), // Automatically synced with localStorage
}

export default createStore({
  state, // Use the pre-defined state object
  mutations: {
    setKeys(state: State, keys: string[]) {
      state.keys = keys
    },
    setFormStructure(state: State, structure: FieldDefinition[]) {
      state.formStructure = structure
    },
    setFormValues(state: State, values: ValueType[]) {
      state.fetchedFormValues = values
    },
    clearFetchedForm(state: State) {
      state.formStructure = [] // Reset formStructure to null
      state.fetchedFormValues = [] // Reset formStructure to null
    },
  },
  actions: {
    // 1. Fetch all keys from the database
    async fetchKeys({ commit }) {
      try {
        const response = await axios.get<FormCollection>('http://localhost:4000/form-data')
        const keys = Object.keys(response.data)
        commit('setKeys', keys)
      } catch (error) {
        console.error('Error fetching keys:', error)
      }
    },

    // 2. Fetch data structure and values by key from db.json
    async fetchDataByKey({ commit }, key: string) {
      console.log('Fetching data from db.json for key:', key)

      try {
        const response = await axios.get<FormCollection>(`http://localhost:4000/form-data/`)
        const dataByKey = response.data[key]
        commit('setFormStructure', dataByKey.structure) // Set the form structure
        commit('setFormValues', dataByKey.values) // Set the form values from db.json
      } catch (error) {
        console.error(`Error fetching data for key "${key}":`, error)
      }
    },

    // 3. Save formValues to localStorage by dataKey
    saveToLocalStorage(
      { state }: { state: State },
      { dataKey, formValues }: { dataKey: string; formValues: ValueType[] },
    ) {
      console.log('typeof state.localFormValues', typeof state.localFormValues)
      if (!state.localFormValues) {
        state.localFormValues = {} // Initialize as an empty object
      }

      // Check if the specific dataKey does not exist and initialize it
      if (!state.localFormValues[dataKey]) {
        state.localFormValues[dataKey] = { values: [] }
      }

      // Update the values for the given dataKey
      state.localFormValues[dataKey].values = formValues

      console.log(`Data saved to localStorage under key "${dataKey}"`, formValues)
    },

    // 4. Clear localStorage for a specific dataKey
    clearLocalStorage({ state }, dataKey: string) {
      if (state.localFormValues[dataKey]) {
        delete state.localFormValues[dataKey]
      }
      console.log(`LocalStorage cleared for key "${dataKey}"`)
    },
  },
})
