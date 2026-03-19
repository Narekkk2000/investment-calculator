<script setup lang="ts">
import { computed } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useContributionAmount } from '@/composables/features/investment/useInitialInvestment'
import { CONTRIBUTION_FREQUENCY_OPTIONS } from '@/constants/investmentOptions'
import type { ContributionFrequency } from '@/types/investment'
import type { DepositCurrency } from '@/types/deposit'
import { COLORS } from '@/constants/colors'
import { CURRENCY_SYMBOLS } from '@/constants/currency'

import SectionCard from '@/components/shared/SectionCard.vue'
import InputField  from '@/components/shared/InputField.vue'
import BaseButton  from '@/components/base/ui/BaseButton.vue'
import BaseText    from '@/components/base/text/BaseText.vue'
import BaseFlex    from '@/components/base/layout/BaseFlex.vue'
import BaseDivider from "@/components/base/ui/BaseDivider.vue";

const store = useInvestmentStore()
const { localValue, validationError, onInput } = useContributionAmount()

const isOneTime = computed(() => store.contributionFreq === 'one-time')

const activeMap = computed(() =>
  Object.fromEntries(
    CONTRIBUTION_FREQUENCY_OPTIONS.map((opt) => [opt.value, store.contributionFreq === opt.value]),
  ),
)
</script>

<template>
  <SectionCard title="Պարբերական վճար">
    <BaseFlex col align="start" gap="12">

      <!-- Frequency selector (4-card grid) -->
      <div class=" grid grid-cols-2 gap-3 w-full">
        <BaseButton
          v-for="opt in CONTRIBUTION_FREQUENCY_OPTIONS"
          :key="opt.value"
          variant="card-select"
          :active="activeMap[opt.value]"
          @click="store.contributionFreq = opt.value as ContributionFrequency"
        >
          <BaseFlex gap="2" class="mb-1">
            <BaseText variant="icon-glyph" :rawColor="activeMap[opt.value] ? COLORS.ACCENT : COLORS.MUTED">
              {{ opt.icon }}
            </BaseText>
            <BaseText variant="card-title" :rawColor="activeMap[opt.value] ? COLORS.CONTENT : COLORS.MUTED">
              {{ opt.label }}
            </BaseText>
          </BaseFlex>
          <BaseText tag="p" variant="footnote" color="MUTED" class="leading-snug">
            {{ opt.description }}
          </BaseText>
        </BaseButton>
      </div>

      <!-- Amount input — hidden when "One-time only" -->
      <Transition class="w-full" name="fade">
        <InputField
          v-if="!isOneTime"
          has-prefix
          label="Պարբերական վճարի չափը"
          type="number"
          inputmode="numeric"
          placeholder="100000"
          label-margin-bottom="-15px"
          :model-value="localValue"
          :error="validationError"
          @update:model-value="onInput"
        >
          <template #prefix>{{ CURRENCY_SYMBOLS[store.currency] }}</template>
        </InputField>
      </Transition>

    </BaseFlex>
    <BaseDivider class="mt-6"/>
  </SectionCard>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
