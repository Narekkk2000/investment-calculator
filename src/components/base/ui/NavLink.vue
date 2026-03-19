<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { COLORS } from '@/constants/colors'

const props = defineProps<{
  to: string
  label: string
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

<template>
  <RouterLink
    :to="to"
    class="px-3 py-1.5 rounded-md text-lg font-bold font-ibm-mono transition-all duration-150"
    :style="{
      color:      isActive ? COLORS.BG : COLORS.MUTED,
      background: isActive ? COLORS.DEEP : 'transparent',
      border:     isActive ? '1px solid rgba(185,233,25,0.35)' : '1px solid transparent',
    }"
  >{{ label }}</RouterLink>
</template>
