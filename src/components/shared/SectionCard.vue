<script setup lang="ts">
import BaseHeading from '@/components/base/text/BaseHeading.vue'
import BaseFlex from '@/components/base/layout/BaseFlex.vue'

defineProps<{
  title?: string
  padding?: string
}>()
</script>
<template>
  <section class="space-y-4">
    <BaseFlex
      v-if="title"
      gap="2"
      class="pb-1"
    >
      <BaseHeading :level="3" variant="section-title">
        {{ title }}
      </BaseHeading>
    </BaseFlex>
    <div :class="padding ?? ''">
      <slot />
    </div>
  </section>
</template>
