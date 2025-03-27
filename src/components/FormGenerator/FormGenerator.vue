<script setup lang="ts">
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'

// Props
defineProps<{
  structure: FieldDefinition[]
}>()

const model = defineModel<ValueType[]>()

// Emit updated values back to the parent
const emit = defineEmits<{
  (e: 'save'): void
  (e: 'discard'): void
}>()
</script>

<template>
  model {{ model }}
  <form
    @submit.prevent="emit('save')"
    v-if="model"
    class="flex flex-col gap-1 flex-grow"
    style="padding-bottom: 1rem"
  >
    <!-- Render dynamic form fields -->
    <div class="flex flex-col gap-1 flex-grow">
      <div v-for="(field, index) in structure" :key="field.id">
        <!-- Scoped slot -->
        <slot :name="`field_${field.id}`" :field="field" :index="index" :model="model">
          <!-- Default content if no slot is provided -->
          <label :for="`field-${field.id}`">{{ field.label }}</label>

          <!-- Input field -->
          <input
            v-if="field.type === 'input'"
            v-model="model[index]"
            :id="`field-${field.id}`"
            :type="field.dataType === 'number' ? 'number' : 'text'"
          />

          <!-- Textarea field -->
          <textarea
            v-if="typeof model[index] !== 'boolean' && field.type === 'textarea'"
            :id="`field-${field.id}`"
            v-model="model[index]"
          ></textarea>

          <!-- Checkbox field -->
          <input
            v-if="field.type === 'checkbox'"
            v-model="model[index]"
            type="checkbox"
            :id="`field-${field.id}`"
            :checked="model[index] === 'true' ? true : false"
          />

          <!-- Select field -->
          <select v-if="field.type === 'select'" :id="`field-${field.id}`" v-model="model[index]">
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </slot>
      </div>
    </div>
    <!-- Buttons -->

    <div class="flex gap-1 justify-end">
      <button type="button" @click="emit('discard')">Discard</button>
      <button type="submit">Save</button>
    </div>
  </form>
</template>

<style scoped>
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

button[type='button'] {
  background-color: #f44336;
  color: white;
}

button[type='submit'] {
  background-color: #4caf50;
  color: white;
}
</style>
