<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useModal } from '@/composables/ui/useModal'
import { formatNumber, formatPercent } from '@/utils/format'
import { COLORS } from '@/constants/colors'
import type { DepositCurrency } from '@/types/deposit'
import { CURRENCY_SYMBOLS } from '@/constants/currency'

import BaseText from '@/components/base/text/BaseText.vue'
import BaseFlex from '@/components/base/layout/BaseFlex.vue'

const InvestmentSummaryCardsModal = defineAsyncComponent(
  () => import('@/pages/investmentCalculator/results/modals/InvestmentSummaryCardsModal.vue'),
)

const store = useInvestmentStore()
const { isOpen, open } = useModal()
const hasOpenedModal = ref(false)

function handleExpandClick() {
  hasOpenedModal.value = true
  open()
}

function fmt(value: number): string {
  const sym = CURRENCY_SYMBOLS[store.currency]
  if (value >= 1_000_000_000) return `${sym}${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000)     return `${sym}${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000)         return `${sym}${(value / 1_000).toFixed(1)}K`
  return `${sym}${formatNumber(value, 0)}`
}

interface KpiCard {
  label: string
  value: string
  sub?: string
  color: string
  icon: string
  large?: boolean
}

const cards = computed<KpiCard[]>(() => {
  const s = store.summary
  return [
    {
      label: 'Ընդհանուր արժեք',
      large: true,
      value: fmt(s.totalValue),
      sub: 'Պորտֆելի կանխատեսվող արժեք',
      color: COLORS.ACCENT,
      icon: '◈',
    },
    {
      label: 'Ընդհանուր ներդրում',
      large: true,
      value: fmt(s.totalInvested),
      sub: 'Մայր գումար + Համալրումներ',
      color: COLORS.SECONDARY,
      icon: '◉',
    },
    {
      label: 'Ընդհանուր եկամտաբերություն',
      large: true,
      value: fmt(s.totalReturn),
      sub: `+${s.totalInvested > 0 ? ((s.totalReturn / s.totalInvested) * 100).toFixed(1) : '0.0'}% ներդրվածի վրա`,
      color: COLORS.WARNING,
      icon: '▲',
    },
    {
      label: 'Եկամտաբերության բազմապատկիչ',
      large: true,
      value: `${s.returnMultiple.toFixed(2)}×`,
      sub: 'ընդհանուր արժեք / ներդրված ընդհանուր արժեք',
      color: COLORS.WARNING,
      icon: '◌',
    },
    {
      label: 'Տարեկան բարդ աճի տեմպ',
      value: formatPercent(s.annualReturn),
      sub: 'բարդ տարեկան աճի տեմպը',
      color: COLORS.SECONDARY,
      icon: '〜',
    },
    {
      label: 'Տարեկան փաստացի տոկոսադրույք',
      value: formatPercent(s.effectiveRate),
      sub: 'սպասվող տարեկան տոկոսադրույք',
      color: COLORS.MUTED,
      icon: '◫',
    },
  ]
})
</script>

<template>
  <div class="flex justify-center">

    <!-- ── Cards grid ───────────────────────────────────────────────────────── -->
    <div
        class="w-[550px] border border-[#E8EEF6] rounded-sm p-5 flex flex-col gap-4 transition-all duration-200"
        style="background: #F7F8FA;"
    >
    <div
      v-for="(card, index) in cards"
      :key="card.label"
          class="pb-3 flex justify-between last:border-b-0 last:pb-0"
          :style="index < cards.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.08)' : ''"
    >
      <!-- Icon + label -->
      <BaseFlex gap="8" align="center" justify="between">
          <BaseFlex gap="1.5">
            <BaseText tag="span" variant="kpi-label" rawColor="black">
              {{ card.label }}
            </BaseText>
            <BaseText tag="span" variant="kpi-icon" :rawColor="card.color">
              {{ card.icon }}
            </BaseText>
          </BaseFlex>
      </BaseFlex>

      <BaseFlex gap="2">
      <!-- Value -->
          <BaseText tag="span" :variant="index === 0 ? 'kpi-value-big' : 'kpi-value'" :rawColor="card.color">
            {{ card.value }}
          </BaseText>

      <!-- Sub -->
      <!-- <BaseText tag="span" :variant="index === 0 ? 'kpi-value' : 'footnote'" color="DEEP" class="leading-tight truncate">
        {{ card.sub }}
      </BaseText> -->
    </BaseFlex>
    </div>

    <!-- ── Modal (lazy) ─────────────────────────────────────────────────────── -->
    <InvestmentSummaryCardsModal
      v-if="hasOpenedModal"
      v-model="isOpen"
      :cards="cards"
    />
  </div>
  </div>
</template>
