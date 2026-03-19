<template>
  <button v-bind="$attrs" type="button" :class="computedClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'ghost' | 'preset' | 'card-select' | 'action' | 'toggle'

const props = withDefaults(
    defineProps<{
      variant?: ButtonVariant
      active?: boolean
    }>(),
    {
      variant: 'ghost',
      active: false,
    },
)

defineOptions({ inheritAttrs: false })

const baseMap: Record<ButtonVariant, string> = {
  ghost:
      'px-2.5 py-1 w-[56px] h-[24px] rounded-[3px] text-[12px] transition-all font-arm',
  preset:
      'px-4.5 py-2 h-[24px] flex items-center rounded-[3px] text-sm transition-all duration-150 cursor-pointer font-arm',
  'card-select':
      'text-left p-2 rounded-[3px] transition-all duration-200 cursor-pointer font-arm',
  action:
      'flex items-center gap-2 px-4 py-2 rounded-[3px] text-xs font-medium transition-all duration-200 font-arm',
  toggle:
      'relative z-10 flex-1 py-1 px-3 text-md font-medium transition-colors duration-200 cursor-pointer select-none font-arm',
}

const activeMap: Partial<Record<ButtonVariant, string>> = {
  preset: 'preset-active',
  'card-select': 'card-select-active',
}

const inactiveMap: Partial<Record<ButtonVariant, string>> = {
  preset: 'preset-inactive',
  'card-select': 'card-select-inactive',
}

const computedClass = computed<string>(() => {
  const base = baseMap[props.variant]
  const state = props.active ? activeMap[props.variant] : inactiveMap[props.variant]
  return [base, state].filter(Boolean).join(' ')
})
</script>