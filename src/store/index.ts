import { createStore } from 'vuex'
import axios from 'axios'
import { useStorage } from '@vueuse/core'
import type { FormData, State, FormValue, FormField, FormDataCollection } from '@/types/db-types'

export default createStore({
  state: {
    keys: [] as string[], // All keys from the database
    formStructure: null as FormField[] | null, // Structure of the form for a specific key
    formValues: [] as FormValue[], // Values fetched from db.json
    local: useStorage<Record<string, { values: FormValue[] }>>('localData', {}), // Automatically synced with localStorage
  },
  mutations: {
    setKeys(state: State, keys: string[]) {
      state.keys = keys
    },
    setFormStructure(state: State, structure: FormField[]) {
      state.formStructure = structure
    },
    setFormValues(state: State, values: FormValue[]) {
      state.formValues = values
    },
    setLocalValues(state: State, { dataKey, values }: { dataKey: string; values: FormValue[] }) {
      if (!state.local[dataKey]) {
        state.local[dataKey] = { values: [] }
      }
      state.local[dataKey].values = values
    },
  },
  actions: {
    // 1. Fetch all keys from the database
    async fetchKeys({ commit }) {
      try {
        const response = await axios.get<FormDataCollection>('http://localhost:4000/form-data')
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
        const response = await axios.get<FormDataCollection>(`http://localhost:4000/form-data/`)
        const dataByKey = response.data[key]
        commit('setFormStructure', dataByKey.structure) // Set the form structure
        commit('setFormValues', dataByKey.values) // Set the form values from db.json
      } catch (error) {
        console.error(`Error fetching data for key "${key}":`, error)
      }
    },

    // 3. Save formValues to localStorage by dataKey
    saveToLocalStorage(
      { state },
      { dataKey, formValues }: { dataKey: string; formValues: FormValue[] },
    ) {
      if (!state.local[dataKey]) {
        state.local[dataKey] = { values: [] }
      }
      state.local[dataKey].values = formValues
      console.log(`Data saved to localStorage under key "${dataKey}"`, formValues)
    },

    // 4. Clear localStorage for a specific dataKey
    clearLocalStorage({ state }, dataKey: string) {
      if (state.local[dataKey]) {
        delete state.local[dataKey]
      }
      console.log(`LocalStorage cleared for key "${dataKey}"`)
    },
  },
})
