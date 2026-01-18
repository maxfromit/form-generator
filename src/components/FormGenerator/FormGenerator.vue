<script setup lang="ts">
import type { ValueType, FieldDefinition } from '@/components/FormGenerator/types'

defineProps<{
  structure: FieldDefinition[]
}>()

const model = defineModel<ValueType[]>()

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <form
    @submit.prevent="emit('save')"
    v-if="model"
    class="flex flex-col gap-md flex-grow"
    style="padding-bottom: 1rem"
  >
    <div class="flex flex-col gap-md flex-grow">
      <div v-for="(field, index) in structure" :key="field.id">
        <slot :name="`field_${field.id}`" :field="field" :index="index" :model="model">
          <label :for="`field-${field.id}`">{{ field.label }}</label>

          <input
            v-if="field.type === 'input'"
            v-model="model[index]"
            :id="`field-${field.id}`"
            :type="field.dataType === 'number' ? 'number' : 'text'"
          />

          <textarea
            v-if="typeof model[index] !== 'boolean' && field.type === 'textarea'"
            :id="`field-${field.id}`"
            v-model="model[index]"
          ></textarea>

          <input
            v-if="field.type === 'checkbox'"
            v-model="model[index]"
            type="checkbox"
            :id="`field-${field.id}`"
            :checked="model[index] === 'true' ? true : false"
          />

          <select v-if="field.type === 'select'" :id="`field-${field.id}`" v-model="model[index]">
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </slot>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-md justify-end">
      <button
        type="button"
        @click="emit('reset')"
        title="Click to reset the form data to its initial state"
      >
        Reset
      </button>

      <button
        type="submit"
        title="Click to save the data to local storage and be redirected to the Local Data Set tab"
      >
        Save
      </button>
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
