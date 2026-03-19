<template>
  <component
    :is="tag"
    :class="[variantClass, colorClass, $attrs.class]"
    :style="rawColor ? { color: rawColor } : undefined"
    v-bind="filteredAttrs"
  ><slot /></component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { COLORS, type ColorName } from '@/constants/colors'

type TextVariant =
  | 'hint'
  | 'description'
  | 'footnote'
    | 'footnote-modal'
  | 'subtitle'
  | 'sub-hint'
  | 'affix'
  | 'kpi-label'
    | 'kpi-label-modal'
  | 'kpi-value'
  | 'kpi-value-big'
  | 'card-title'
  | 'icon-glyph'
  | 'kpi-icon'
    | 'kpi-icon-modal'

const props = withDefaults(
  defineProps<{
    tag?: string
    variant?: TextVariant
    color?: ColorName
    rawColor?: string
  }>(),
  {
    tag: 'span',
    variant: 'hint',
  }
)

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>
  return rest
})

const variantClass = computed<string>(() => {
  const map: Record<TextVariant, string> = {
    hint: 'text-xs font-arm',
    description: 'text-md leading-relaxed font-arm',
    footnote: 'text-[11px] font-arm',
    'footnote-modal': 'text-sm font-arm',
    subtitle: 'text-sm font-arm',
    'sub-hint': 'block text-[14px] font-[700] font-arm',
    affix: 'text-xs pointer-events-none font-arm',
    'kpi-label': 'text-[14px]  truncate font-arm',
    'kpi-icon': 'text-sm leading-none',
    'kpi-label-modal': 'text-md uppercase tracking-widest truncate font-arm',
    'kpi-icon-modal': 'text-md leading-none',
    'kpi-value': 'text-base font-semibold leading-tight truncate font-arm',
    'kpi-value-big': 'text-xl font-bold leading-tight truncate font-arm',
    'card-title': 'text-xl md:text-sm font-bold font-arm',
    'icon-glyph': 'text-2xl leading-none',
  }
  return map[props.variant]
})

const colorClass = computed<string>(() => {
  if (!props.color || props.rawColor) return ''
  const map: Record<ColorName, string> = {
    BG:           'text-app-bg',
    SURFACE:      'text-app-surface',
    ACCENT:       'text-app-accent',
    ACCENT_BRIGHT:'text-app-accent-bright',
    WARNING:      'text-app-warn',
    SECONDARY:    'text-app-secondary',
    CONTENT:      'text-app-content',
    MUTED:        'text-app-muted',
    DIM:          'text-app-dim',
    DEEP:         'text-app-deep',
    SUBTLE:       'text-app-subtle',
    WHITE:        'text-white',
  }
  return map[props.color] ?? ''
})
</script>
