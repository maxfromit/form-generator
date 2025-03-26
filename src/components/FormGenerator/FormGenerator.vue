<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FieldDefinition, FormModel, FormStructure } from '@/components/FormGenerator/types'

// Props
defineProps<{
  structure: FormStructure
}>()

const model = defineModel<FormModel>()

// Emit updated values back to the parent

const emit = defineEmits<{
  (e: 'save', formValue: FormModel): void
}>()

// Clone `modelValue` for editing
const formValueToEditClone = ref<FormModel>([])

// Watch for changes in the original `modelValue` and reset the clone
watch(
  () => model.value,
  (newValue) => {
    if (!!newValue) formValueToEditClone.value = JSON.parse(JSON.stringify(newValue))
  },
  { immediate: true, deep: true },
)

const isDiscardDisabled = computed(() => {
  return JSON.stringify(formValueToEditClone.value) === JSON.stringify(model.value)
})

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
const getFieldAttributes = (field: FieldDefinition) => {
  const attributes: Record<string, any> = {
    placeholder: field.placeholder || '',
  }

  if (field.type === 'checkbox') {
    attributes.type = 'checkbox'
    attributes.checked = getModelValue(field.id) === 'true' ? true : false
  } else if (field.type === 'input') {
    attributes.type = field.dataType === 'number' ? 'number' : 'text'
  } else if (field.type === 'select') {
    attributes.options = field.options || []
  }

  return attributes
}

function getFieldByIndex(index: number) {
  return formValueToEditClone.value[index]
}

function getModelValue(index: number) {
  return formValueToEditClone.value[index] ?? null
}

function updateModelValue(index: number, newValue: any, type: string) {
  if (type === 'checkbox') {
    formValueToEditClone.value[index] = newValue === 'true' ? 'false' : 'true'
  } else {
    formValueToEditClone.value[index] = newValue
  }
}

// Save changes and emit updated values
const saveChanges = () => {
  console.log('emit formValueToEditClone.value', formValueToEditClone.value)
  emit('save', formValueToEditClone.value)
}

// Discard changes and reset the clone to the original values
const discardChanges = () => {
  formValueToEditClone.value = [...model.value]
}
</script>

<template>
  <form @submit.prevent="saveChanges">
    <!-- Render dynamic form fields -->
    <div v-for="(field, index) in structure" :key="field.id" class="form-field">
      <slot :name="`field_${field.id}`">
        <!-- Default content if no slot is provided -->
        <label :for="`field-${field.id}`">{{ field.label }}</label>

        <!-- Dynamic input types -->
        <component
          :is="getFieldComponent(field.type)"
          :id="`field-${field.id}`"
          :value="getModelValue(index)"
          @input="(event) => updateModelValue(index, event.target.value, field.type)"
          v-bind="getFieldAttributes(field)"
        >
          <!-- Render options for select fields -->
          <template v-if="field.type === 'select'">
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </template>
        </component>
      </slot>
    </div>

    <!-- Buttons -->
    <div class="form-actions">
      <button type="button" @click="discardChanges" :disabled="isDiscardDisabled">Discard</button>
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
