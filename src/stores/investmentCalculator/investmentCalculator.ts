import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TermUnit, Currency } from '@/types/common'
import type {
  ContributionFrequency,
  CompoundFrequency,
  InvestmentYearRow,
  InvestmentSummary,
} from '@/types/investment'
import { COMPOUND_FREQUENCY_OPTIONS, CONTRIBUTION_FREQUENCY_OPTIONS } from '@/constants/investmentOptions'

// O(1) lookup maps — built once at module load
const compoundPeriodsMap = new Map<string, number>(
  COMPOUND_FREQUENCY_OPTIONS.map((o) => [o.value, o.periodsPerYear])
)
const contributionPeriodsMap = new Map<string, number>(
  CONTRIBUTION_FREQUENCY_OPTIONS.map((o) => [o.value, o.periodsPerYear])
)

export const useInvestmentStore = defineStore('investmentCalculator', () => {

  // ─── Input State ─────────────────────────────────────────────────────────────

  const initialAmount        = ref<number>(1_000_000)
  const currency             = ref<Currency>('AMD')

  const contributionAmount   = ref<number>(100_000)
  const contributionFreq     = ref<ContributionFrequency>('monthly')

  const termValue            = ref<number>(10)
  const termUnit             = ref<TermUnit>('years')

  const returnRate           = ref<number>(7)      // annual % (e.g. 7 = 7%)

  const compoundFreq         = ref<CompoundFrequency>('monthly')

  // ─── Derived: totalMonths ─────────────────────────────────────────────────────

  const totalMonths = computed<number>(() => {
    const raw = termUnit.value === 'years'
      ? Math.round(termValue.value * 12)
      : Math.round(termValue.value)
    return Math.max(1, raw)
  })

  // ─── Derived: compound periods per year (n) ────────────────────────────────

  const compoundN = computed<number>(() => {
    return compoundPeriodsMap.get(compoundFreq.value) ?? 12
  })

  // ─── Derived: contribution periods per year ────────────────────────────────

  const contributionPeriodsPerYear = computed<number>(() => {
    return contributionPeriodsMap.get(contributionFreq.value) ?? 0
  })

  // ─── Core calculation ─────────────────────────────────────────────────────────
  //
  //  A  = P * (1 + r/n)^(n*t)          — initial lump sum growth
  //  FV = PMT * (((1 + r/n)^(n*t) - 1) / (r/n))   — future value of contributions
  //  Total = A + FV
  //
  //  r = annual rate as decimal
  //  n = compound periods per year
  //  t = years

  // ─── Derived: breakdown (year-by-year or month-by-month) ─────────────────────

  const breakdown = computed<InvestmentYearRow[]>(() => {
    const P   = initialAmount.value
    const r   = returnRate.value / 100
    const n   = compoundN.value
    const months = totalMonths.value
    const years  = months / 12

    // Use monthly breakdown when term < 2 years, otherwise yearly
    const useMonthly = months < 24

    const periods = useMonthly ? months : Math.ceil(years)
    const rows: InvestmentYearRow[] = []

    const PMT    = contributionFreq.value === 'one-time' ? 0 : contributionAmount.value
    const pmtN   = contributionPeriodsPerYear.value   // payments per year

    for (let p = 1; p <= periods; p++) {
      const t = useMonthly ? p / 12 : p   // t in years at this period

      // Initial investment growth: A = P * (1 + r/n)^(n*t)
      const A = r === 0
        ? P
        : P * Math.pow(1 + r / n, n * t)

      // Contribution FV: only when there are contributions
      let FV = 0
      if (PMT > 0 && pmtN > 0 && r > 0) {
        // FV of annuity using compound frequency:
        // FV = PMT * (((1 + r/n)^(n*t) - 1) / (r/n))  when pmtN === compoundN
        // General form: FV = PMT * ((1+r/n)^(n*t) - 1) / (r/n)
        // adjusted for payment frequency ratio
        const factor = (Math.pow(1 + r / n, n * t) - 1) / (r / n)
        // Scale by payments per compound period
        FV = PMT * factor * (pmtN / n)
      } else if (PMT > 0 && pmtN > 0 && r === 0) {
        FV = PMT * t * pmtN
      }

      // Total invested (cumulative principal + contributions)
      const totalInvested = P + PMT * Math.round(t * pmtN)

      // Total portfolio value
      const totalValue = A + FV

      // Interest is always non-negative (clamp floating-point artifacts)
      const interestEarned = Math.max(0, totalValue - totalInvested)

      rows.push({
        period: p,
        totalInvested,
        interestEarned,
      })
    }

    return rows
  })

  // ─── Derived: summary ─────────────────────────────────────────────────────────

  const summary = computed<InvestmentSummary>(() => {
    const empty: InvestmentSummary = {
      totalInvested: initialAmount.value,
      totalValue: initialAmount.value,
      totalReturn: 0,
      returnMultiple: 1,
      annualReturn: returnRate.value,
      effectiveRate: returnRate.value,
    }

    if (breakdown.value.length === 0) return empty

    const last = breakdown.value[breakdown.value.length - 1]
    const totalInvested  = last.totalInvested
    const totalValue     = totalInvested + last.interestEarned
    const totalReturn    = totalValue - totalInvested
    const returnMultiple = totalInvested > 0 ? totalValue / totalInvested : 1

    const years = totalMonths.value / 12
    // CAGR: (totalValue / totalInvested)^(1/years) - 1
    const annualReturn = years > 0 && totalInvested > 0
      ? (Math.pow(totalValue / totalInvested, 1 / years) - 1) * 100
      : returnRate.value

    return {
      totalInvested,
      totalValue,
      totalReturn,
      returnMultiple,
      annualReturn,
      effectiveRate: returnRate.value,
    }
  })

  return {
    // State
    initialAmount,
    currency,
    contributionAmount,
    contributionFreq,
    termValue,
    termUnit,
    returnRate,
    compoundFreq,
    // Getters
    totalMonths,
    compoundN,
    contributionPeriodsPerYear,
    breakdown,
    summary,
  }
})
