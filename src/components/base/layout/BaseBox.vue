<template>
  <component
    :is="tag"
    class="rounded-xl"
    :class="[overflow && 'overflow-hidden']"
    style="border: 1px solid rgba(99,179,237,0.1)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Card-like container used throughout the app.
 * Provides: rounded-xl + bg-app-surface + 1px blue-tinted border.
 * Use overflow prop for chart/table containers that need overflow-hidden.
 */
withDefaults(
  defineProps<{
    tag?: string
    overflow?: boolean
  }>(),
  {
    tag: 'div',
    overflow: false,
  },
)

defineOptions({ inheritAttrs: false })
</script>
