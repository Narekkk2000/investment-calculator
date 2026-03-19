<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref, computed } from "vue"
import { cn } from "@/lib/utils"
import { formatThousands } from "@/utils/formatters"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
  label?: string
  error?: string
  format?: boolean
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string): void
}>()

const isFocused = ref(false)

const displayValue = computed(() => {
  if (!props.format || isFocused.value) return props.modelValue
  return formatThousands(props.modelValue as string|number)
})

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "")
  emits("update:modelValue", raw)
}

</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label">{{ label }}</label>
    <div class="relative flex items-center">
      <span
          v-if="$slots.prefix"
          class="absolute left-3 text-sm text-muted-foreground pointer-events-none"
      >
        <slot name="prefix" />
      </span>
      <input
          data-slot="input"
          :value="displayValue"
          :aria-invalid="!!error"
          @input="onInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :class="cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:shadow-sm',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          $slots.prefix && 'pl-7',
          props.class,
        )"
      >
    </div>
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>