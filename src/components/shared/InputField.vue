<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatThousands } from '@/utils/formatters'
import BaseFlex from '@/components/base/layout/BaseFlex.vue'
import BaseText from "@/components/base/text/BaseText.vue";

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label: string
  modelValue: string | number
  type?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  hasPrefix?: boolean
  hasSuffix?: boolean
  error?: string
  labelMarginTop?: string
  labelMarginBottom?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const isFocused = ref(false)

const displayValue = computed(() => {
  if (!props.hasPrefix || isFocused.value) return props.modelValue
  return formatThousands(props.modelValue)
})
</script>

<template>
  <BaseFlex col justify="center" align="start" class="gap-[20px]">
    <BaseText class="ml-2 min-w-36" :style="{ marginTop: labelMarginTop ?? '-30px', marginBottom: labelMarginBottom ?? '0px' }" variant="sub-hint" color="CONTENT">
      {{label}}
    </BaseText>
    <BaseFlex class="relative w-full">
      <div
          v-if="$slots.prefix"
          class="absolute left-0 flex items-center justify-center h-full px-3 pointer-events-none text-[13px] text-app-muted font-ibm-mono"
      >
        <slot name="prefix" />
      </div>
      <input
          v-bind="$attrs"
          :type="hasPrefix ? 'text' : (type ?? 'number')"
          :value="displayValue"
          :placeholder="placeholder"
          :min="min"
          :max="max"
          :step="step ?? 1"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-[16px] md:text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:shadow-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          :class="{
            'pl-8': $slots.prefix,
            'pr-14': $slots.suffix,
          }"
          :aria-invalid="!!error"
          @focus="isFocused = true"
          @blur="isFocused = false; emit('blur')"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value.replace(type === 'number' ? /[^0-9.,]/g : /[^0-9]/g, ''))"
      />
      <div
          v-if="$slots.suffix"
          class="absolute right-0 flex items-center justify-center h-full px-3 pointer-events-none text-xs text-app-muted font-ibm-mono"
          style="min-width: 44px"
      >
        <slot name="suffix" />
      </div>
    </BaseFlex>
    <p
        v-if="error"
        class="mt-1.5 ml-2 text-xs font-ibm-mono"
        style="color: rgba(239, 68, 68, 0.9)"
    >
      {{ error }}
    </p>
  </BaseFlex>
</template>