<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useModal } from '@/composables/ui/useModal'
import { COLORS } from '@/constants/colors'
import type { DepositCurrency } from '@/types/deposit'
import { CURRENCY_SYMBOLS } from '@/constants/currency'

import BaseBox     from '@/components/base/layout/BaseBox.vue'
import BaseFlex    from '@/components/base/layout/BaseFlex.vue'
import BaseHeading from '@/components/base/text/BaseHeading.vue'
import BaseText    from '@/components/base/text/BaseText.vue'
import BaseButton  from '@/components/base/ui/BaseButton.vue'

const InvestmentChartModal = defineAsyncComponent(
  () => import('@/pages/investmentCalculator/results/modals/InvestmentChartModal.vue'),
)

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// ── Store ─────────────────────────────────────────────────────────────────────

const store = useInvestmentStore()

// ── Chart type toggle (local state — not in store) ────────────────────────────

type ChartStyle = 'bar' | 'pie'
const chartStyle = ref<ChartStyle>('bar')

// ── Expand / modal ────────────────────────────────────────────────────────────

const { isOpen, open } = useModal()
const hasOpenedModal = ref(false)

function handleExpandClick() {
  hasOpenedModal.value = true
  open()
}

// ── Currency formatter ────────────────────────────────────────────────────────

function fmtTick(v: number): string {
  const sym = CURRENCY_SYMBOLS[store.currency]
  if (v >= 1_000_000_000) return `${sym}${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000)     return `${sym}${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)         return `${sym}${(v / 1_000).toFixed(0)}K`
  return `${sym}${v}`
}

function fmtTooltip(v: number): string {
  const sym = CURRENCY_SYMBOLS[store.currency]
  return `${sym}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}`
}

// ── Period label ──────────────────────────────────────────────────────────────

const useMonthly  = computed(() => store.totalMonths < 24)
const periodLabel = computed(() => useMonthly.value ? 'Month' : 'Year')

// ── Bar chart data ────────────────────────────────────────────────────────────

const barChartData = computed(() => ({
  labels: store.breakdown.map((r) => String(r.period)),
  datasets: [
    {
      label: 'Total Invested',
      data: store.breakdown.map((r) => r.totalInvested),
      backgroundColor: COLORS.CONTENT,
      borderRadius: 2,
      borderSkipped: 'top' as const,
      stack: 'investment',
    },
    {
      label: 'Growth',
      data: store.breakdown.map((r) => r.interestEarned),
      backgroundColor: COLORS.SECONDARY,
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: 'bottom' as const,
      stack: 'investment',
    },
  ],
}))

// ── Bar chart options ─────────────────────────────────────────────────────────

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        color: COLORS.MUTED,
        font: { family: '\'IBM Plex Mono\', monospace', size: 11, weight: 500 as any },
        boxWidth: 10,
        boxHeight: 10,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: COLORS.SURFACE,
      borderColor: 'rgba(99,179,237,0.2)',
      borderWidth: 1,
      titleColor: COLORS.MUTED,
      bodyColor: COLORS.CONTENT,
      titleFont: { family: '\'IBM Plex Mono\', monospace', size: 10 },
      bodyFont: { family: '\'IBM Plex Mono\', monospace', size: 11 },
      callbacks: {
        title: (items: any[]) => `${periodLabel.value} ${items[0].label}`,
        label: (ctx: any) => ` ${ctx.dataset.label}: ${fmtTooltip(ctx.raw)}`,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: COLORS.DIM,
        font: { family: '\'IBM Plex Mono\', monospace', size: 9 },
        maxTicksLimit: 12,
        maxRotation: 0,
      },
      border: { display: false },
    },
    y: {
      stacked: true,
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: COLORS.DIM,
        font: { family: '\'IBM Plex Mono\', monospace', size: 9 },
        callback: (v: any) => fmtTick(v),
      },
      border: { display: false },
    },
  },
}))

// ── Pie chart data ────────────────────────────────────────────────────────────

const pieChartData = computed(() => ({
  labels: ['Total Invested', 'Growth'],
  datasets: [
    {
      data: [store.summary.totalInvested, store.summary.totalReturn],
      backgroundColor: [COLORS.CONTENT, COLORS.SECONDARY],
      borderColor: [COLORS.SURFACE, COLORS.SURFACE],
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
}))

// ── Pie chart options ─────────────────────────────────────────────────────────

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 },
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: COLORS.MUTED,
        font: { family: '\'IBM Plex Mono\', monospace', size: 11, weight: 500 as any },
        boxWidth: 12,
        boxHeight: 12,
        padding: 16,
        generateLabels: (chart: any) => {
          const data = chart.data
          if (!data.labels?.length) return []
          const total = (data.datasets[0].data as number[]).reduce((a: number, b: number) => a + b, 0)
          return data.labels.map((label: string, i: number) => {
            const value = data.datasets[0].data[i] as number
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
            return {
              text: `${label}  ${pct}%`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].borderColor[i],
              lineWidth: 1,
              hidden: false,
              index: i,
            }
          })
        },
      },
    },
    tooltip: {
      backgroundColor: COLORS.SURFACE,
      borderColor: 'rgba(99,179,237,0.2)',
      borderWidth: 1,
      titleColor: COLORS.MUTED,
      bodyColor: COLORS.CONTENT,
      titleFont: { family: '\'IBM Plex Mono\', monospace', size: 10 },
      bodyFont: { family: '\'IBM Plex Mono\', monospace', size: 11 },
      callbacks: {
        label: (ctx: any) => {
          const total = (ctx.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0)
          const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : '0.0'
          return ` ${ctx.label}: ${fmtTooltip(ctx.raw)}  (${pct}%)`
        },
      },
    },
  },
}))
</script>

<template>
  <div class="relative">

    <!-- Expand button -->
    <button
      type="button"
      aria-label="Expand chart"
      class="absolute -top-7 right-0 flex items-center justify-center w-6 h-6 rounded-md cursor-pointer transition-all duration-150"
      style="background: rgba(99,179,237,0.05); border: 1px solid rgba(99,179,237,0.1); color: #3C5801;"
      @mouseenter="($event.currentTarget as HTMLButtonElement).style.color = '#B9E919'"
      @mouseleave="($event.currentTarget as HTMLButtonElement).style.color = '#3C5801'"
      @click="handleExpandClick"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    </button>

  <BaseBox overflow>
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <BaseFlex
      justify="between"
      align="center"
      class="px-5 py-3"
      style="border-bottom: 1px solid rgba(99,179,237,0.07)"
    >
      <BaseHeading :level="3" variant="section-title" color="MUTED">
        <template v-if="chartStyle === 'bar'">
          Growth Breakdown · {{ useMonthly ? 'Monthly' : 'Yearly' }}
        </template>
        <template v-else>
          Portfolio Composition
        </template>
      </BaseHeading>

      <!-- Chart style toggle -->
      <BaseFlex gap="1.5" align="center">
        <BaseButton
          variant="toggle"
          :style="{
            color:  COLORS.MUTED,
            border: chartStyle === 'bar'
              ? '1px solid rgba(185,233,25,0.4)'
              : '1px solid rgba(99,179,237,0.12)',
            background: chartStyle === 'bar'
              ? 'rgba(185,233,25,0.08)'
              : 'transparent',
          }"
          @click="chartStyle = 'bar'"
        >
          Bar
        </BaseButton>
        <BaseButton
          variant="toggle"
          :style="{
            color:  COLORS.MUTED,
            border: chartStyle === 'pie'
              ? '1px solid rgba(185,233,25,0.4)'
              : '1px solid rgba(99,179,237,0.12)',
            background: chartStyle === 'pie'
              ? 'rgba(185,233,25,0.08)'
              : 'transparent',
          }"
          @click="chartStyle = 'pie'"
        >
          Pie
        </BaseButton>
      </BaseFlex>
    </BaseFlex>

    <!-- ── Chart body ──────────────────────────────────────────────────────── -->
    <div class="p-5" style="height: 300px">
      <!-- Bar chart -->
      <Bar
        v-if="chartStyle === 'bar' && store.breakdown.length > 0"
        :data="barChartData"
        :options="barChartOptions"
      />

      <!-- Pie chart -->
      <Pie
        v-else-if="chartStyle === 'pie' && store.summary.totalValue > 0"
        :data="pieChartData"
        :options="pieChartOptions"
      />

      <!-- Empty state -->
      <BaseText
        v-else
        tag="div"
        variant="hint"
        color="DEEP"
        class="flex items-center justify-center h-full"
      >
        Enter investment details to see chart
      </BaseText>
    </div>
  </BaseBox>

  <InvestmentChartModal
    v-if="hasOpenedModal"
    v-model="isOpen"
    :breakdown="store.breakdown"
    :total-invested="store.summary.totalInvested"
    :total-return="store.summary.totalReturn"
    :currency="store.currency"
    :initial-style="chartStyle"
  />

  </div>
</template>
