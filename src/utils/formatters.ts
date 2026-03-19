import { formatCurrency } from '@/utils/format'
import { COLORS } from '@/constants/colors'

/**
 * Returns the formatted display value for a schedule table cell.
 * Month column renders as a plain integer; all others as currency.
 */
export function cellValue(row: Record<string, number>, key: string): string {
  if (key === 'month') return String(row[key])
  return formatCurrency(row[key])
}

/**
 * Returns the hex color for a schedule table column.
 * Columns are color-coded to match the stacked bar chart legend.
 */
export function cellColor(key: string): string {
  switch (key) {
    case 'principal':        return COLORS.SECONDARY
    case 'interest':         return COLORS.WARNING
    case 'totalCommissions': return COLORS.ACCENT
    case 'balance':          return COLORS.ACCENT
    default:                 return COLORS.CONTENT
  }
}

/**
 * Formats a number with dot-separated thousands groups.
 * Used in prefixed inputs to improve readability (e.g. 1000000 → 1.000.000).
 */
export const formatThousands = (value: string | number): string => {
  const num = Number(value)
  if (isNaN(num)) return String(value)
  return num.toLocaleString('de-DE').replace(/,/g, '.')
}

/**
 * Formats a preset number into a short human-readable label.
 * e.g. 1000 → "1K", 1000000 → "1M"
 */
export const formatPresetLabel = (value: number): string => {
  if (value >= 1_000_000) return `${value / 1_000_000}M`
  if (value >= 1_000) return `${value / 1_000}K`
  return String(value)
}



export const formatRate = (value: number, decimals = 4): string => {
  return `${(value * 100).toFixed(decimals)}%`
}