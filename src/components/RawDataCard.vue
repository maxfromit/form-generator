<script setup lang="ts">
import type { FormStructure, ValueType } from '@/components/FormGenerator/types'
defineProps<{
  formStructure: FormStructure
  resolvedFormValues: ValueType[]
}>()
</script>

<template>
  <div class="flex justify-center">
    <div
      class="flex flex-col gap-md"
      style="
        max-width: 22rem;
        background: #f9f9f9;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
      "
    >
      <div class="flex flex-col gap-xs">
        <div class="text-bold">Form structure:</div>
        <code>{{ formStructure }}</code>
      </div>
      <div class="flex flex-col gap-xs">
        <div class="text-bold">Form values:</div>
        <code>{{ resolvedFormValues }}</code>
      </div>
    </div>
  </div>
</template>
