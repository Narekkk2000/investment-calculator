// ─── Initial Investment amount ────────────────────────────────────────────────

export const MAX_INVESTMENT_AMOUNT = 100_000_000

// ─── Investment term ──────────────────────────────────────────────────────────

export const INVESTMENT_TERM_LIMITS = {
  months: { min: 1,  max: 600 }, // 1 month … 50 years
  years:  { min: 1,  max: 50  }, // 1 year  … 50 years
} as const

// ─── Expected annual return rate ──────────────────────────────────────────────

export const INVESTMENT_RATE_LIMITS = {
  min: 0,
  max: 100,
} as const

// ─── Regular contribution ─────────────────────────────────────────────────────

export const MAX_CONTRIBUTION_AMOUNT = 100_000_000
