<template>
  <component
    :is="'h' + level"
    :class="[variantClass, colorClass, $attrs.class]"
    v-bind="filteredAttrs"
  ><slot /></component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { type ColorName } from '@/constants/colors'

type HeadingVariant = 'app-title' | 'section-title'

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4
    variant?: HeadingVariant
    color?: ColorName
  }>(),
  {
    level: 2,
    variant: 'section-title',
  }
)

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>
  return rest
})

const variantClass = computed<string>(() => {
  const map: Record<HeadingVariant, string> = {
    'app-title': 'text-lg font-bold leading-none font-arm',
    'section-title': 'text-md font-bold font-arm'
  }
  return map[props.variant]
})

const colorClass = computed<string>(() => {
  if (!props.color) return ''
  const map: Record<ColorName, string> = {
    BG: 'text-app-bg',
    SURFACE: 'text-app-surface',
    ACCENT: 'text-app-accent',
    ACCENT_BRIGHT: 'text-app-accent-bright',
    WARNING: 'text-app-warn',
    SECONDARY: 'text-app-secondary',
    CONTENT: 'text-app-content',
    MUTED: 'text-app-muted',
    DIM: 'text-app-dim',
    DEEP: 'text-app-deep',
    SUBTLE: 'text-app-subtle',
    WHITE: 'text-white',
  }
  return map[props.color] ?? ''
})
</script>
