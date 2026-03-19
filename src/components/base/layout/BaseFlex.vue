<template>
  <component :is="tag" :class="flexClass" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AlignValue = '' | 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type JustifyValue = '' | 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'

const props = withDefaults(
  defineProps<{
    /** HTML tag to render. Defaults to 'div'. */
    tag?: string
    /** items-* alignment. Defaults to 'center' (most common in codebase). */
    align?: AlignValue
    /** justify-* alignment. Defaults to '' (no justify class). */
    justify?: JustifyValue
    /** gap-* value as a string, e.g. '3', '1.5'. Defaults to '' (no gap). */
    gap?: string
    /** flex-wrap. Defaults to false. */
    wrap?: boolean
    /** flex-col direction. Defaults to false (row). */
    col?: boolean
  }>(),
  {
    tag: 'div',
    align: 'center',
    justify: '',
    gap: '',
    wrap: false,
    col: false,
  },
)

defineOptions({ inheritAttrs: false })

const flexClass = computed<string>(() => {
  const classes: string[] = ['flex']
  if (props.col) classes.push('flex-col')
  if (props.align) classes.push(`items-${props.align}`)
  if (props.justify) classes.push(`justify-${props.justify}`)
  if (props.gap) classes.push(`gap-${props.gap}`)
  if (props.wrap) classes.push('flex-wrap')
  return classes.join(' ')
})
</script>
