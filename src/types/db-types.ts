// Type for a single form field in the structure
export type FormField = {
  id: number
  type: 'input' | 'select' | 'checkbox' | 'textarea' // Allowed field types
  label: string
  placeholder?: string // Optional for fields like select or checkbox
  dataType?: 'string' | 'number' // Optional, only for input fields
  options?: string[] // Only for select fields
}

// Type for a single value in the form
export type FormValue = {
  id: number
  value: string | number | boolean // Value can be a string, number, or boolean
}

// Type for the structure and values of a form
export type FormData = {
  structure: FormField[]
  values: FormValue[][]
}

// Type for the entire `form-data` object
export type FormDataCollection = {
  [key: string]: FormData // Key is dynamic (e.g., "customers", "products")
}

export type State = {
  keys: string[] // All keys from the database
  formStructure: FormField[] | null // Structure of the form for a specific key
  formValues: FormValue[] // Array of values for a specific key
  selectedValue: FormValue | null // A specific value by key and ID
}
