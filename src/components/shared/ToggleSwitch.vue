<script setup lang="ts">
interface Option {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  options: Option[]
  modelValue: string
  /** Width of each button, e.g. '60px', '5rem' */
  buttonWidth?: string
  /** Height of each button, e.g. '32px', '2rem' */
  buttonHeight?: string
  /** Active button background */
  activeColor?: string
  /** Active button text color */
  activeTextColor?: string
  /** Inactive button background */
  inactiveColor?: string
  /** Inactive button text color */
  inactiveTextColor?: string
  /** Border radius for buttons */
  radius?: string
  /** Font size */
  fontSize?: string
}>(), {
  buttonWidth: 'auto',
  buttonHeight: '24px',
  activeColor: '#83A126',
  activeTextColor: '#fff',
  inactiveColor: '#F3F8FE',
  inactiveTextColor: '#8D8D8D',
  radius: '3px',
  fontSize: '13px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="inline-flex gap-[14px] p-[2px] rounded-sm">
    <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="font-medium cursor-pointer transition-all duration-150 font-ibm-mono"
        :style="{
          width: buttonWidth,
          height: buttonHeight,
          borderRadius: radius,
          fontSize: fontSize,
          padding: buttonWidth === 'auto' ? '0 14px' : '0',
          background: modelValue === option.value ? activeColor : inactiveColor,
          color: modelValue === option.value ? activeTextColor : inactiveTextColor,
        }"
        @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
