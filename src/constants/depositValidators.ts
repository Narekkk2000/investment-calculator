// Max deposit amount

export const MAX_DEPOSIT_AMOUNT = 500_000_000

// Deposit term constants

export const DEPOSIT_TERM_LIMITS = {
  months: { min: 1,  max: 120 },
  years:  { min: 1,  max: 10  },
} as const

// Deposit rate constants

export const DEPOSIT_RATE_LIMITS = {
  min: 0,
  max: 30,
} as const
