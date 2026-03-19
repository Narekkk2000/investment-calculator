import type { TermUnit, Currency } from '@/types/common'
import type { ContributionFrequency, CompoundFrequency } from '@/types/investment'

// ─── Initial Investment ───────────────────────────────────────────────────────

export const INVESTMENT_AMOUNT_PRESETS = [100000, 500000, 1000000, 5000000, 10000000] as const

// ─── Currency ───────────────────────────────────────────────────────────────

export const INVESTMENT_CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'AMD', label: 'AMD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

// ─── Investment Term ──────────────────────────────────────────────────────────

export const INVESTMENT_TERM_UNIT_OPTIONS: { value: TermUnit; label: string }[] = [
  { value: 'years',  label: 'Տարիներ'  },
  { value: 'months', label: 'Ամիսներ' },
]

export const INVESTMENT_TERM_PRESETS: { value: number; unit: TermUnit; label: string }[] = [
  { value: 1,  unit: 'years', label: '1 տ'  },
  { value: 3,  unit: 'years', label: '3 տ'  },
  { value: 5,  unit: 'years', label: '5 տ'  },
  { value: 10, unit: 'years', label: '10 տ' },
  { value: 20, unit: 'years', label: '20 տ' },
  { value: 30, unit: 'years', label: '30 տ' },
]

// ─── Expected Return Rate ─────────────────────────────────────────────────────

export interface ReturnRatePreset {
  value: number
  label: string
  description: string
}

export const RETURN_RATE_PRESETS: ReturnRatePreset[] = [
  { value: 4,  label: '4%',  description: 'Conservative' },
  { value: 7,  label: '7%',  description: 'Moderate'     },
  { value: 10, label: '10%', description: 'Aggressive'   },
  { value: 12, label: '12%', description: 'Optimistic'   },
]

// ─── Contribution Frequency ───────────────────────────────────────────────────

export interface ContributionFrequencyOption {
  value: ContributionFrequency
  icon: string
  label: string
  description: string
  periodsPerYear: number
}

export const CONTRIBUTION_FREQUENCY_OPTIONS: ContributionFrequencyOption[] = [
  {
    value: 'monthly',
    icon: '◈',
    label: 'Ամսական',
    description: 'Ավելացնել միջոցներ ամեն ամիս',
    periodsPerYear: 12,
  },
  {
    value: 'quarterly',
    icon: '◉',
    label: 'Եռամսյակային',
    description: 'Ավելացնել միջոցներ ամեն եռամսյակ',
    periodsPerYear: 4,
  },
  {
    value: 'annually',
    icon: '◎',
    label: 'Տարեկան',
    description: 'Ավելացնել միջոցներ տարին մեկ անգամ',
    periodsPerYear: 1,
  },
  {
    value: 'one-time',
    icon: '◍',
    label: 'Միանվագ',
    description: 'Առանց պարբերական վճարումների',
    periodsPerYear: 0,
  },
]

// ─── Compound Frequency ───────────────────────────────────────────────────────

export interface CompoundFrequencyOption {
  value: CompoundFrequency
  icon: string
  label: string
  description: string
  periodsPerYear: number
}

export const COMPOUND_FREQUENCY_OPTIONS: CompoundFrequencyOption[] = [
  {
    value: 'daily',
    icon: '◈',
    label: 'Օրական',
    description: 'Compounded every day.',
    periodsPerYear: 365,
  },
  {
    value: 'monthly',
    icon: '◉',
    label: 'Ամսական',
    description: 'Compounded once per month.',
    periodsPerYear: 12,
  },
  {
    value: 'quarterly',
    icon: '◎',
    label: 'Եռամսյակային',
    description: 'Compounded every quarter.',
    periodsPerYear: 4,
  },
  {
    value: 'annually',
    icon: '◍',
    label: 'Տարեկան',
    description: 'Compounded once per year.',
    periodsPerYear: 1,
  },
]
