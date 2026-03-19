<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  /** Button width, e.g. '56px', 'auto' */
  width?: string
  /** Button height, e.g. '32px' */
  height?: string
  /** Active background */
  activeColor?: string
  /** Active text color */
  activeTextColor?: string
  /** Inactive background */
  inactiveColor?: string
  /** Inactive text color */
  inactiveTextColor?: string
  /** Inactive border color */
  inactiveBorderColor?: string
  /** Border radius */
  radius?: string
  /** Font size */
  fontSize?: string
}>(), {
  active: false,
  width: 'auto',
  height: '32px',
  activeColor: '#092C40',
  activeTextColor: '#fff',
  inactiveColor: 'transparent',
  inactiveTextColor: '#717372',
  inactiveBorderColor: '#e5e7eb',
  radius: '5px',
  fontSize: '13px',
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
      type="button"
      class="font-medium border-[#E0E7EF] cursor-pointer transition-all duration-150 font-arm"
      :style="{
        width,
        height,
        borderRadius: radius,
        fontSize,
        padding: width === 'auto' ? '0 16px' : '0',
        background: active ? activeColor : inactiveColor,
        color: active ? activeTextColor : inactiveTextColor,
        border: active ? 'none' : `1px solid ${inactiveBorderColor}`,
      }"
      @click="emit('click')"
  >
    <slot />
  </button>
</template>
