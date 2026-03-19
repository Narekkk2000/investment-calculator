import type { Currency } from '@/types/common'

/** Single source-of-truth map from currency code → display symbol. */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AMD: '֏',
  USD: '$',
  EUR: '€',
}
