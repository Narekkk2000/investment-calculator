export interface PaymentScheduleRow {
  month: number
  payment: number
  principal: number
  interest: number
  oneTimeCommission: number
  monthlyCommission: number
  annualCommission: number
  totalCommissions: number
  balance: number
}

export interface LoanSummary {
  totalPayment: number
  totalPrincipal: number
  totalInterest: number
  totalCommissions: number
  totalOverpayment: number
  firstMonthPayment: number
  lastMonthPayment: number
  effectiveRate: number
}

export interface CommissionInput {
  percent: number
  amount: number
}

export type { TermUnit as LoanTermUnit } from '@/types/common'
export type InterestRateType = 'annual' | 'monthly'
export type RepaymentType = 'annuity' | 'differentiated'
