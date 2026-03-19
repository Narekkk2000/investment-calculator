<script setup lang="ts">
import { computed } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useInitialInvestment } from '@/composables/features/investment/useInitialInvestment'
import { formatPresetLabel } from '@/utils/formatters'
import { INVESTMENT_CURRENCY_OPTIONS } from '@/constants/investmentOptions'
import type { DepositCurrency } from '@/types/deposit'
import { CURRENCY_SYMBOLS } from '@/constants/currency'

import SectionCard  from '@/components/shared/SectionCard.vue'
import InputField   from '@/components/shared/InputField.vue'
import BaseButton   from '@/components/base/ui/BaseButton.vue'
import BaseFlex     from '@/components/base/layout/BaseFlex.vue'
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue'
import BaseDivider from '@/components/base/ui/BaseDivider.vue'

const store = useInvestmentStore()
const { localValue, validationError, onInput, isPresetActive, selectPreset, presets } = useInitialInvestment()

// Slider: min 0, max 100M — log scale helper for display only
const sliderMin = 0
const sliderMax = 100_000_000

const sliderValue = computed({
  get: () => store.initialAmount,
  set: (val: number) => {
    store.initialAmount   = val
    localValue.value      = String(val)
    validationError.value = ''
  },
})
</script>

<template>
    <BaseFlex col align="start" gap="5">

      <!-- Amount input + currency toggle -->
      <div class="w-full flex flex-col items-start gap-3">
        <ToggleSwitch
          class="self-end"
          
          :options="INVESTMENT_CURRENCY_OPTIONS"
          :model-value="store.currency"
          @update:model-value="(val) => (store.currency = val as DepositCurrency)"
        />

        <InputField
          has-prefix
          label="Մայր գումար"
          type="number"
          inputmode="numeric"
          placeholder="1000000"
          label-margin-bottom="-10px"
          :model-value="localValue"
          :error="validationError"
          @update:model-value="onInput"
        >
          <template #prefix>{{ CURRENCY_SYMBOLS[store.currency] }}</template>
        </InputField>
      </div>

      <!-- Range slider -->
      <div class="w-full">
        <input
          type="range"
          class="w-full h-1 bg-app-content rounded-full appearance-none cursor-pointer"
          :min="sliderMin"
          :max="sliderMax"
          :step="100_000"
          :value="sliderValue"
          style="accent-color: #B9E919"
          @input="sliderValue = Number(($event.target as HTMLInputElement).value)"
        />
        <BaseFlex justify="between" class="mt-1">
          <span class="text-[10px] font-ibm-mono text-app-muted">0</span>
          <span class="text-[10px] font-ibm-mono text-app-muted">100M</span>
        </BaseFlex>
      </div>

      <!-- Preset buttons -->
      <BaseFlex class="self-end rounded-[5-px] p-1 bg-gray-50" gap="2" wrap>
        <BaseButton
          v-for="preset in presets"
          :key="preset"
          variant="preset"
          :active="isPresetActive(preset)"
          @click="selectPreset(preset)"
        >
          {{ formatPresetLabel(preset) }}
        </BaseButton>
      </BaseFlex>

    </BaseFlex>
    <BaseDivider class="mt-3"/>
</template>
