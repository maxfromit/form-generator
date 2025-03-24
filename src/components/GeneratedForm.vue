<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormField, FormValue } from '@/types/db-types'

// Props
const props = defineProps<{
  formStructure: FormField[]
}>()

// Emit updated values back to the parent

const emit = defineEmits<{
  (e: 'update:modelValue', formValue: FormValue[]): void
}>()

const formValueToEdit = defineModel<FormValue[]>('formValueToEdit', {
  default: [],
})

// Clone `modelValue` for editing
const formValueToEditClone = ref<FormValue[]>([])

// Watch for changes in the original `modelValue` and reset the clone
watch(
  () => formValueToEdit.value,
  (newValue) => {
    formValueToEditClone.value = JSON.parse(JSON.stringify(newValue))
  },
  { immediate: true },
)

// Save changes and emit updated values
const saveChanges = () => {
  emit('update:modelValue', [...formValueToEditClone.value])
}

// Discard changes and reset the clone to the original values
const discardChanges = () => {
  formValueToEditClone.value = [...formValueToEdit.value]
}

// Helper to dynamically determine the component type
const getFieldComponent = (type: string) => {
  switch (type) {
    case 'input':
      return 'input'
    case 'textarea':
      return 'textarea'
    case 'checkbox':
      return 'input' // Checkbox is still an input element
    case 'select':
      return 'select'
    default:
      return 'input'
  }
}

// Helper to get attributes for a field
const getFieldAttributes = (field: FormField) => {
  const attributes: Record<string, any> = {
    placeholder: field.placeholder || '',
  }

  if (field.type === 'checkbox') {
    attributes.type = 'checkbox'
    console.log('getModelValue(field.id)', getModelValue(field.id))
    attributes.checked = getModelValue(field.id) === 'true' ? true : false
  } else if (field.type === 'input') {
    attributes.type = field.dataType === 'number' ? 'number' : 'text'
  } else if (field.type === 'select') {
    attributes.options = field.options || []
  }

  return attributes
}

function getFieldById(id: number) {
  console.log('formValueToEditClone.value', formValueToEditClone.value)

  return formValueToEditClone.value.find((item) => item.id === id)
}

function getModelValue(fieldId: number) {
  const field = getFieldById(fieldId)
  return field ? field.value : null
}

function updateModelValue(fieldId: number, newValue: any, type: string) {
  const field = getFieldById(fieldId)
  if (field) {
    if (type === 'checkbox') {
      field.value = newValue === 'true' ? 'false' : 'true'
    } else {
      field.value = newValue
    }
  }
}
</script>

<template>
  <form @submit.prevent="saveChanges" v-if="formValueToEditClone.length > 0">
    <!-- Render dynamic form fields -->
    formValueToEditClone {{ formValueToEditClone }} formValueToEdit.value
    <div v-for="field in props.formStructure" :key="field.id" class="form-field">
      <label :for="`field-${field.id}`">{{ field.label }}</label>

      <!-- Dynamic input types -->

      <component
        :is="getFieldComponent(field.type)"
        :id="`field-${field.id}`"
        :value="getModelValue(field.id)"
        @input="(event) => updateModelValue(field.id, event.target.value, field.type)"
        v-bind="getFieldAttributes(field)"
      >
        <!-- Render options for select fields -->
        <option
          v-if="field.type === 'select'"
          v-for="option in field.options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </component>
    </div>

    <!-- Buttons -->
    <div class="form-actions">
      <button type="button" @click="discardChanges">Discard</button>
      <button type="submit">Save</button>
    </div>
  </form>
</template>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type='checkbox'] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type='button'] {
  background-color: #f44336;
  color: white;
}

button[type='submit'] {
  background-color: #4caf50;
  color: white;
}
</style>
