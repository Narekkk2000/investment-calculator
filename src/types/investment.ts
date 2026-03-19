export type { TermUnit as InvestmentTermUnit } from '@/types/common'
export type { Currency as InvestmentCurrency } from '@/types/common'

// ─── Contribution Frequency ───────────────────────────────────────────────────
export type ContributionFrequency = 'monthly' | 'quarterly' | 'annually' | 'one-time'

// ─── Compound Frequency ───────────────────────────────────────────────────────
export type CompoundFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually'

// ─── Year-by-year breakdown row (for the chart) ───────────────────────────────
export interface InvestmentYearRow {
  period: number        // year or month number (label for x-axis)
  totalInvested: number // cumulative principal + contributions up to this point
  interestEarned: number // cumulative compound growth above invested amount
}

// ─── Summary snapshot ─────────────────────────────────────────────────────────
export interface InvestmentSummary {
  totalInvested: number      // initial + all contributions
  totalValue: number         // final portfolio value
  totalReturn: number        // totalValue - totalInvested
  returnMultiple: number     // totalValue / totalInvested  (e.g. 2.4)
  annualReturn: number       // CAGR %
  effectiveRate: number      // same as annualReturn for display (%)
}
