import type { PaymentScheduleRow } from '@/types/loan'
import { formatCurrency } from '@/utils/format'
import { COLORS } from '@/constants/colors'

// ─── Sampling ────────────────────────────────────────────────────────────────

/**
 * Returns a reduced sample of rows for rendering performance on large schedules.
 * Full data is preserved in the store; only the visual representation is thinned.
 */
export function sampleSchedule(rows: PaymentScheduleRow[]): PaymentScheduleRow[] {
  const n = rows.length
  if (n === 0) return []
  if (n <= 60) return rows
  const step = n <= 120 ? 3 : 6
  return rows.filter((_, i) => i % step === 0 || i === n - 1)
}

// ─── Payment Breakdown Chart (Stacked Bar) ───────────────────────────────────

export function buildPaymentChartData(rows: PaymentScheduleRow[]) {
  return {
    labels: rows.map((r) => `${r.month}`),
    datasets: [
      {
        label: 'Principal',
        data: rows.map((r) => r.principal),
        backgroundColor: COLORS.SECONDARY,
        borderRadius: 2,
        borderSkipped: false,
      },
      {
        label: 'Interest',
        data: rows.map((r) => r.interest),
        backgroundColor: COLORS.WARNING,
        borderRadius: 2,
        borderSkipped: false,
      },
      {
        label: 'Commissions',
        data: rows.map((r) => r.totalCommissions),
        backgroundColor: COLORS.ACCENT,
        borderRadius: 2,
        borderSkipped: false,
      },
    ],
  }
}

export function buildPaymentChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: COLORS.MUTED,
          font: { family: '\'IBM Plex Mono\', monospace', size: 12, weight: 500 },
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
          title: (items: any[]) => `Month ${items[0].label}`,
          label: (ctx: any) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
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
          callback: (v: any) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
        },
        border: { display: false },
      },
    },
  }
}

// ─── Balance Over Time Chart (Line) ──────────────────────────────────────────

export function buildBalanceChartData(rows: PaymentScheduleRow[]) {
  return {
    labels: rows.map((r) => `${r.month}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: rows.map((r) => r.balance),
        borderColor: COLORS.ACCENT,
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart
          const { ctx: canvasCtx, chartArea } = chart
          if (!chartArea) return 'rgba(185,233,25,0.1)'
          const gradient = canvasCtx.createLinearGradient(
            0, chartArea.top, 0, chartArea.bottom,
          )
          gradient.addColorStop(0, 'rgba(185,233,25,0.25)')
          gradient.addColorStop(1, 'rgba(185,233,25,0.01)')
          return gradient
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLORS.ACCENT,
        pointHoverBorderColor: COLORS.CONTENT,
        pointHoverBorderWidth: 2,
      },
    ],
  }
}

export function buildBalanceChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: COLORS.SURFACE,
        borderColor: 'rgba(99,179,237,0.2)',
        borderWidth: 1,
        titleColor: COLORS.MUTED,
        bodyColor: COLORS.ACCENT,
        titleFont: { family: '\'IBM Plex Mono\', monospace', size: 10 },
        bodyFont: { family: '\'IBM Plex Mono\', monospace', size: 12 },
        callbacks: {
          title: (items: any[]) => `Month ${items[0].label}`,
          label: (ctx: any) => ` Balance: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
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
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: COLORS.DIM,
          font: { family: '\'IBM Plex Mono\', monospace', size: 9 },
          callback: (v: any) =>
            v >= 1000000
              ? `$${(v / 1000000).toFixed(1)}M`
              : v >= 1000
              ? `$${(v / 1000).toFixed(0)}k`
              : `$${v}`,
        },
        border: { display: false },
      },
    },
  }
}
