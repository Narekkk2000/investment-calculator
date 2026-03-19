import { computed } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useValidatedNumberField } from '@/composables/utils/useValidatedNumberField'
import type { TermUnit } from '@/types/common'
import { INVESTMENT_TERM_LIMITS } from '@/constants/investmentValidators'
import { INVESTMENT_TERM_PRESETS } from '@/constants/investmentOptions'

// ─── Validator ────────────────────────────────────────────────────────────────

function validateInvestmentTerm(val: string, unit: TermUnit): string {
  if (val === '') return 'Term is required'
  const n = parseFloat(val)
  if (isNaN(n) || n <= 0) return 'Term must be greater than 0'
  const { min, max } = INVESTMENT_TERM_LIMITS[unit]
  if (n < min) return `Minimum term is ${min} ${unit}`
  if (n > max) return `Maximum term is ${max} ${unit}`
  return ''
}

// ─── Composable ───────────────────────────────────────────────────────────────

export const useInvestmentTerm = () => {
  const store = useInvestmentStore()

  const { localValue, validationError, onInput } = useValidatedNumberField({
    source:    () => store.termValue,
    commit:    (n) => { store.termValue = n },
    validator: (val) => validateInvestmentTerm(val, store.termUnit),
  })

  // ── Unit toggle ───────────────────────────────────────────────────────────

  const onUnitChange = (val: string) => {
    const newUnit = val as TermUnit
    const current = parseFloat(localValue.value)

    if (!isNaN(current)) {
      if (newUnit === 'months' && store.termUnit === 'years') {
        const converted     = current * 12
        store.termValue     = converted
        localValue.value    = String(converted)
      } else if (newUnit === 'years' && store.termUnit === 'months') {
        const converted     = Math.round(current / 12)
        store.termValue     = converted
        localValue.value    = String(converted)
      }
    }

    store.termUnit = newUnit
  }

  // ── Preset buttons (always in years — convert if needed) ──────────────────

  const isPresetActive = (presetYears: number) =>
    store.termUnit === 'years'
      ? store.termValue === presetYears
      : store.totalMonths === presetYears * 12

  const selectPreset = (presetYears: number) => {
    if (store.termUnit === 'years') {
      store.termValue  = presetYears
      localValue.value = String(presetYears)
    } else {
      const asMonths   = presetYears * 12
      store.termValue  = asMonths
      localValue.value = String(asMonths)
    }
    validationError.value = ''
  }

  // ── Step ──────────────────────────────────────────────────────────────────

  const termStep = computed(() => store.termUnit === 'years' ? 1 : 3)

  // ── Hint ──────────────────────────────────────────────────────────────────

  const termHint = computed(() =>
    store.termUnit === 'months'
      ? `= ${Math.round((store.totalMonths / 12) * 10) / 10} տարիներ ընդհանուր`
      : `= ${store.totalMonths} ամիսներ ընդհանուր`,
  )

  return {
    localValue,
    validationError,
    termStep,
    termHint,
    onInput,
    onUnitChange,
    isPresetActive,
    selectPreset,
    presets: INVESTMENT_TERM_PRESETS,
  }
}
