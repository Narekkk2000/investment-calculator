// Max loan amount

export const MAX_LOAN_AMOUNT = 100_000_000


// Loan term constants

export const LOAN_TERM_LIMITS = {
    months: { min: 3, max: 360 },
    years:  { min: 1, max: 30  },
}

export const INTEREST_RATE_LIMITS = {
    annual: { min: 0.1, max: 50 },    // 0.1% to 50% annual
    monthly: { min: 0.01, max: 10 }   // ~0.01% to ~10% monthly
} as const