// Type for a single form field in the structure
export type FieldDefinition = {
  id: number
  type: 'input' | 'select' | 'checkbox' | 'textarea' // Allowed field types
  label: string
  placeholder?: string // Optional for fields like select or checkbox
  dataType?: 'string' | 'number' // Optional, only for input fields
  options?: string[] // Only for select fields
}

export type FormStructure = FieldDefinition[]

// Type for a single value in the form
export type ValueType = string | number | boolean | null // Value can be a string, number, or boolean

export type FormModel = ValueType[]

// Type for the structure and values of a form
export type Form = {
  structure: FormStructure
  values: ValueType[]
}

// Type for the entire `form-data` object
export type FormCollection = {
  [key: string]: Form // Key is dynamic (e.g., "customers", "products")
}
