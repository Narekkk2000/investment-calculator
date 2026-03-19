<template>
  <BaseModal
    :model-value="modelValue"
    max-width="2xl"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <template #header="{ close }">
      <div
        class="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style="border-bottom: 1px solid rgba(99,179,237,0.1)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-1 h-5 rounded-full"
            style="background: linear-gradient(to bottom, #B9E919, rgba(185,233,25,0.2))"
          />
          <BaseHeading :level="2" variant="section-title" color="CONTENT">
            Investment Summary
          </BaseHeading>
        </div>
        <button
          type="button"
          class="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all duration-150 font-ibm-mono"
          style="background: rgba(99,179,237,0.06); border: 1px solid rgba(99,179,237,0.12); color: #717372;"
          aria-label="Close"
          @mouseenter="($event.currentTarget as HTMLButtonElement).style.color = '#B9E919'"
          @mouseleave="($event.currentTarget as HTMLButtonElement).style.color = '#717372'"
          @click="close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </template>

    <!-- ── Body ────────────────────────────────────────────────────────────── -->
    <div class="p-6">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div
          v-for="(card, i) in cards"
          :key="card.label"
          :class="['rounded-xl py-3 px-5 flex flex-col justify-center gap-2 transition-all duration-200', i < 4 ? 'min-h-40' : 'min-h-28']"
          style="background: var(--color-app-bg); border: 1px solid rgba(99,179,237,0.09);"
        >
          <div class="flex items-center gap-2">
            <BaseText tag="span" variant="kpi-icon-modal" :rawColor="card.color">{{ card.icon }}</BaseText>
            <BaseText tag="span" variant="kpi-label-modal" color="CONTENT">{{ card.label }}</BaseText>
          </div>
          <div class="text-2xl font-semibold leading-tight font-ibm-mono" :style="{ color: card.color }">
            {{ card.value }}
          </div>
          <BaseText tag="div" variant="footnote-modal" color="MUTED" class="leading-tight">{{ card.sub }}</BaseText>
        </div>
      </div>
    </div>

    <!-- ── Footer ──────────────────────────────────────────────────────────── -->
    <template #footer>
      <div class="px-6 py-3" style="border-top: 1px solid rgba(99,179,237,0.07)">
        <BaseText tag="p" variant="footnote" color="DEEP">
          All values are indicative and based on current input parameters.
        </BaseText>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal   from '@/components/base/overlays/BaseModal.vue'
import BaseHeading from '@/components/base/text/BaseHeading.vue'
import BaseText    from '@/components/base/text/BaseText.vue'

export interface KpiCard {
  label:  string
  value:  string
  sub?:   string
  color:  string
  icon:   string
  large?: boolean
}

defineProps<{ modelValue: boolean; cards: KpiCard[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
