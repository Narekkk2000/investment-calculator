<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  vertical?: boolean
  thickness?: string | number
  colorVariant?: keyof typeof themeColors
}>()

// Theme colors
const themeColors = {
  accent: 'var(--color-app-accent)',
  accentBright: 'var(--color-app-accent-bright)',
  warn: 'var(--color-app-warn)',
  secondary: 'var(--color-app-secondary)',
  content: 'var(--color-app-content)',
  muted: 'var(--color-app-muted)',
  mutedLight: 'var(--color-app-muted-light)',
  dim: 'var(--color-app-dim)',
  deep: 'var(--color-app-deep)',
  subtle: 'var(--color-app-subtle)',
} as const

// Compute thickness (ensure px if number)
const thicknessValue = computed(() =>
    typeof props.thickness === 'number' ? `${props.thickness}px` : props.thickness ?? '1px'
)

// Compute color
const dividerColor = computed(() =>
    props.colorVariant ? themeColors[props.colorVariant] : '#dee2e6'
)
</script>

<template>
  <div
      :style="
      props.vertical
        ? `width: ${thicknessValue}; height: 100%; background: ${dividerColor}`
        : `height: ${thicknessValue}; width: 100%; background: ${dividerColor}`
    "
      class="rounded-lg"
  />
</template>