import {formatPresetLabel} from "@/utils/formatters";
import {LOAN_TERM_LIMITS, INTEREST_RATE_LIMITS} from "@/constants/validators";
import { DEPOSIT_TERM_LIMITS, DEPOSIT_RATE_LIMITS } from '@/constants/depositValidators'
import type { TermUnit } from '@/types/common'

// Primitive checks

export const isEmpty = (val: string): boolean => val === ''

export const toNumber = (val: string): number =>
    parseFloat(val.replace(/\./g, ''))

export const isValidNumber = (n: number): boolean => !isNaN(n)

export const isPositive = (n: number): boolean => n > 0

export const isNonNegative = (n: number): boolean => n >= 0

export const isWithinMax = (n: number, max: number): boolean => n <= max

// Composed validators

/**
 * Generic amount validator — used for both loan and deposit amounts.
 * Pass the appropriate max constant per feature.
 */
export const validateLoanAmount = (val: string, max: number): string => {
    if (isEmpty(val)) return 'Amount is required'
    const n = toNumber(val)
    if (!isValidNumber(n) || !isPositive(n)) return 'Amount must be greater than 0'
    if (!isWithinMax(n, max)) return `Amount cannot exceed ${formatPresetLabel(max)}`
    return ''
}

/**
 * Validates loan term value against min/max constraints for the given unit.
 */
export const validateLoanTerm = (val: string, unit: TermUnit): string => {
    if (isEmpty(val)) return 'Term is required'
    const n = toNumber(val)
    if (!isValidNumber(n) || !isPositive(n)) return 'Term must be greater than 0'
    const { min, max } = LOAN_TERM_LIMITS[unit]
    if (n < min) return `Minimum term is ${min} ${unit}`
    if (n > max) return `Maximum term is ${max} ${unit}`
    return ''
}

/**
 * Validates interest rate value against min/max constraints for the given type.
 */
export const validateInterestRate = (val: string, type: 'annual' | 'monthly'): string => {
    if (isEmpty(val)) return 'Rate is required'

    const n = toNumber(val)
    if (!isValidNumber(n) || n < 0) return 'Rate must be 0 or greater'

    const { min, max } = INTEREST_RATE_LIMITS[type]
    if (n < min) return `Minimum ${type} rate is ${min}%`
    if (n > max) return `Maximum ${type} rate is ${max}%`

    return ''
}

export const validatePositiveNumber = (val: string): string => {
    if (isEmpty(val)) return 'Value is required'
    const n = toNumber(val)
    if (!isValidNumber(n) || !isNonNegative(n)) return 'Value must be 0 or greater'
    return ''
}

// ─── Deposit validators ───────────────────────────────────────────────────────

// validateDepositAmount: identical logic to validateLoanAmount — reuse it directly
// with MAX_DEPOSIT_AMOUNT. No separate function needed.
export { validateLoanAmount as validateDepositAmount }

/**
 * Validates deposit term against deposit-specific min/max limits.
 * Separate from validateLoanTerm because DEPOSIT_TERM_LIMITS differ from LOAN_TERM_LIMITS.
 */
export const validateDepositTerm = (val: string, unit: TermUnit): string => {
    if (isEmpty(val)) return 'Term is required'
    const n = toNumber(val)
    if (!isValidNumber(n) || !isPositive(n)) return 'Term must be greater than 0'
    const { min, max } = DEPOSIT_TERM_LIMITS[unit]
    if (n < min) return `Minimum term is ${min} ${unit}`
    if (n > max) return `Maximum term is ${max} ${unit}`
    return ''
}

/**
 * Validates a deposit interest rate (decimal-aware, uses parseFloat not toNumber).
 */
export const validateDepositRate = (val: string): string => {
    if (isEmpty(val)) return 'Rate is required'
    const n = parseFloat(val)
    if (!isValidNumber(n) || n < DEPOSIT_RATE_LIMITS.min) return 'Rate must be 0 or greater'
    if (n > DEPOSIT_RATE_LIMITS.max) return `Rate cannot exceed ${DEPOSIT_RATE_LIMITS.max}%`
    return ''
}
