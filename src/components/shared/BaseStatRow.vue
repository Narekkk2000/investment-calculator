<script setup lang="ts">
interface StatItem {
  value: string
  label: string
  color?: string
}

defineProps<{
  stats: StatItem[]
}>()
</script>

<template>
  <div class="hidden md:flex items-center gap-6">
    <div
        v-for="stat in stats"
        :key="stat.label"
        class="text-center"
    >
      <div
          class="text-lg font-medium font-ibm-mono capitalize"
          :style="{ color: stat.color }"
      >
        {{ stat.value }}
      </div>
      <div class="text-md text-app-muted font-ibm-mono">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>