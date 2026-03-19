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
            <template v-if="chartStyle === 'bar'">Growth Breakdown</template>
            <template v-else>Portfolio Composition</template>
          </BaseHeading>
        </div>

        <div class="flex items-center gap-3">
          <!-- Chart style toggle -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="opt in [{ v: 'bar', l: 'Bar' }, { v: 'pie', l: 'Pie' }]"
              :key="opt.v"
              type="button"
              class="px-2.5 py-1 rounded-md text-xs font-ibm-mono font-semibold transition-all duration-150 cursor-pointer"
              :style="{
                color:      chartStyle === opt.v ? COLORS.ACCENT : COLORS.MUTED,
                border:     chartStyle === opt.v ? '1px solid rgba(185,233,25,0.4)' : '1px solid rgba(99,179,237,0.12)',
                background: chartStyle === opt.v ? 'rgba(185,233,25,0.08)' : 'transparent',
              }"
              @click="chartStyle = opt.v as 'bar' | 'pie'"
            >{{ opt.l }}</button>
          </div>

          <!-- Close -->
          <button
            type="button"
            class="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all duration-150"
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
      </div>
    </template>

    <!-- ── Body ────────────────────────────────────────────────────────────── -->
    <div class="p-5" style="height: 440px">
      <Bar  v-if="chartStyle === 'bar' && breakdown.length > 0" :data="barData"  :options="barOptions" />
      <Pie  v-else-if="chartStyle === 'pie' && totalValue > 0"  :data="pieData"  :options="pieOptions" />
      <div v-else class="flex items-center justify-center h-full text-xs font-ibm-mono" :style="{ color: COLORS.DIM }">
        No data
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale, ArcElement,
} from 'chart.js'
import { COLORS } from '@/constants/colors'
import { CURRENCY_SYMBOLS } from '@/constants/currency'
import type { InvestmentYearRow } from '@/types/investment'
import BaseModal   from '@/components/base/overlays/BaseModal.vue'
import BaseHeading from '@/components/base/text/BaseHeading.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps<{
  modelValue:     boolean
  breakdown:      InvestmentYearRow[]
  totalInvested:  number
  totalReturn:    number
  currency:       string
  initialStyle:   'bar' | 'pie'
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const chartStyle = ref<'bar' | 'pie'>(props.initialStyle)
const totalValue = computed(() => props.totalInvested + props.totalReturn)

const sym = computed(() => CURRENCY_SYMBOLS[props.currency as keyof typeof CURRENCY_SYMBOLS] ?? props.currency)
function fmtT(v: number) {
  return `${sym.value}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v)}`
}
function fmtTick(v: number) {
  if (v >= 1_000_000) return `${sym.value}${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${sym.value}${(v / 1_000).toFixed(0)}K`
  return `${sym.value}${v}`
}

const fontConfig = { family: '\'IBM Plex Mono\', monospace' }

const barData = computed(() => ({
  labels: props.breakdown.map((r) => String(r.period)),
  datasets: [
    {
      label: 'Total Invested',
      data: props.breakdown.map((r) => r.totalInvested),
      backgroundColor: COLORS.SECONDARY,
      borderRadius: 2,
      borderSkipped: 'top' as const,
      stack: 'investment',
    },
    {
      label: 'Growth',
      data: props.breakdown.map((r) => r.interestEarned),
      backgroundColor: COLORS.ACCENT,
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: 'bottom' as const,
      stack: 'investment',
    },
  ],
}))

const barOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
  plugins: {
    legend: { position: 'top' as const, align: 'end' as const, labels: { color: COLORS.MUTED, font: { ...fontConfig, size: 11 }, boxWidth: 10, boxHeight: 10, padding: 12 } },
    tooltip: {
      backgroundColor: COLORS.SURFACE, borderColor: 'rgba(99,179,237,0.2)', borderWidth: 1,
      titleColor: COLORS.MUTED, bodyColor: COLORS.CONTENT,
      titleFont: { ...fontConfig, size: 10 }, bodyFont: { ...fontConfig, size: 11 },
      callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${fmtT(ctx.raw)}` },
    },
  },
  scales: {
    x: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: COLORS.DIM, font: { ...fontConfig, size: 9 }, maxTicksLimit: 15, maxRotation: 0 }, border: { display: false } },
    y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: COLORS.DIM, font: { ...fontConfig, size: 9 }, callback: (v: any) => fmtTick(v) }, border: { display: false } },
  },
}))

const pieData = computed(() => ({
  labels: ['Total Invested', 'Growth'],
  datasets: [{
    data: [props.totalInvested, props.totalReturn],
    backgroundColor: [COLORS.SECONDARY, COLORS.ACCENT],
    borderColor: [COLORS.SURFACE, COLORS.SURFACE],
    borderWidth: 3,
    hoverOffset: 10,
  }],
}))

const pieOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: COLORS.MUTED, font: { ...fontConfig, size: 12 }, boxWidth: 14, boxHeight: 14, padding: 18,
        generateLabels: (chart: any) => {
          const data = chart.data
          if (!data.labels?.length) return []
          const total = (data.datasets[0].data as number[]).reduce((a: number, b: number) => a + b, 0)
          return data.labels.map((label: string, i: number) => {
            const value = data.datasets[0].data[i] as number
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
            return { text: `${label}  ${pct}%`, fillStyle: data.datasets[0].backgroundColor[i], strokeStyle: data.datasets[0].borderColor[i], lineWidth: 1, hidden: false, index: i }
          })
        },
      },
    },
    tooltip: {
      backgroundColor: COLORS.SURFACE, borderColor: 'rgba(99,179,237,0.2)', borderWidth: 1,
      titleColor: COLORS.MUTED, bodyColor: COLORS.CONTENT,
      titleFont: { ...fontConfig, size: 10 }, bodyFont: { ...fontConfig, size: 11 },
      callbacks: {
        label: (ctx: any) => {
          const total = (ctx.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0)
          const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : '0.0'
          return ` ${ctx.label}: ${fmtT(ctx.raw)}  (${pct}%)`
        },
      },
    },
  },
}))
</script>
