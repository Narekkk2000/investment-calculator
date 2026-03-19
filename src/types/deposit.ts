export type { TermUnit as DepositTermUnit } from '@/types/common'
export type { Currency as DepositCurrency } from '@/types/common'
export type ReceivingType = 'monthly' | 'quarterly' | 'semi-annual' | 'at-maturity'

export interface DepositSummary {
  totalInterest: number
  totalAmount: number
  effectiveAnnualRate: number
  periodicIncome: number
}
