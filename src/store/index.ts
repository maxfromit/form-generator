import { createStore } from 'vuex'
import axios from 'axios'
import type { FormData, State, FormValue, FormField, FormDataCollection } from '@/types/db-types'

export default createStore({
  state: {
    keys: [] as string[], // All keys from the database
    formStructure: null as FormField[] | null, // Structure of the form for a specific key
    formValues: [] as FormValue[], // Array of values for a specific key
    selectedValue: null as FormValue | null, // A specific value by key and ID
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
    setSelectedValue(state: State, value: FormValue) {
      state.selectedValue = value
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

    // 2. Fetch data structure and values by key
    async fetchDataByKey({ commit }, key: string) {
      console.log('key:', key)

      try {
        const response = await axios.get<FormDataCollection>(`http://localhost:4000/form-data/`)
        const dataBykey = response.data[key]
        commit('setFormStructure', dataBykey.structure)
        commit('setFormValues', dataBykey.values)
      } catch (error) {
        console.error(`Error fetching data for key "${key}":`, error)
      }
    },

    // 3. Fetch a specific value by key and ID
    async fetchValueByKeyAndId({ commit }, { key, id }: { key: string; id: number }) {
      try {
        const response = await axios.get<FormDataCollection>(`http://localhost:4000/form-data/`)
        const dataByKey = response.data[key] // Extract the data for the specific key
        const value = dataByKey.values.find((item: any) => item.id === id) // Find the specific value by ID
        commit('setSelectedValue', value)
      } catch (error) {
        console.error(`Error fetching value for key "${key}" and ID "${id}":`, error)
      }
    },
    // Load data from localStorage
    loadFromLocalStorage({ commit }) {
      const formStructure = localStorage.getItem('formStructure')
      const formValues = localStorage.getItem('formValues')

      if (formStructure && formValues) {
        console.log('formStructure:', formStructure)
        console.log('formValues:', formValues)
        commit('setFormStructure', JSON.parse(formStructure))
        commit('setFormValues', JSON.parse(formValues))
        console.log('Data loaded from localStorage:', {
          formStructure: JSON.parse(formStructure),
          formValues: JSON.parse(formValues),
        })
      } else {
        console.log('No data found in localStorage.')
      }
    },
    saveToLocalStorage(
      { commit },
      { formValues, formStructure }: { formValues: FormValue[]; formStructure: FormField[] },
    ) {
      // Save formStructure and formValues to localStorage
      localStorage.setItem('formStructure', JSON.stringify(formStructure))
      localStorage.setItem('formValues', JSON.stringify(formValues))

      console.log('Data saved to localStorage:', {
        formStructure,
        formValues,
      })
    },
    // Clear localStorage and reset Vuex state
    clearLocalStorage({ commit }) {
      localStorage.removeItem('formStructure')
      localStorage.removeItem('formValues')
      commit('setFormStructure', null)
      commit('setFormValues', [])
      console.log('LocalStorage cleared and Vuex state reset.')
    },
  },
})
