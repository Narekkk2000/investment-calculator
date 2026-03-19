import { ref } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useValidatedNumberField } from '@/composables/utils/useValidatedNumberField'
import { INVESTMENT_RATE_LIMITS } from '@/constants/investmentValidators'
import { RETURN_RATE_PRESETS } from '@/constants/investmentOptions'

// ─── Validator ────────────────────────────────────────────────────────────────

function validateReturnRate(val: string): string {
  if (val === '') return 'Rate is required'
  const n = parseFloat(val)
  if (isNaN(n) || n < INVESTMENT_RATE_LIMITS.min) return 'Rate must be 0 or greater'
  if (n > INVESTMENT_RATE_LIMITS.max) return `Rate cannot exceed ${INVESTMENT_RATE_LIMITS.max}%`
  return ''
}

// ─── Composable ───────────────────────────────────────────────────────────────

export const useReturnRate = () => {
  const store = useInvestmentStore()

  /**
   * Tracks the currently selected preset value (null when the user typed a custom value).
   * Selecting a preset sets this; typing in the input clears it.
   */
  const activePreset = ref<number | null>(store.returnRate)

  const { localValue, validationError, onInput: _onInput } = useValidatedNumberField({
    source:    () => store.returnRate,
    commit:    (n) => { store.returnRate = n },
    validator: validateReturnRate,
  })

  // Wrap onInput so that free-typing clears the preset selection
  const onInput = (val: string) => {
    activePreset.value = null
    _onInput(val)
  }

  // ── Preset buttons ────────────────────────────────────────────────────────

  const isPresetActive = (preset: number) => activePreset.value === preset

  const selectPreset = (preset: number) => {
    activePreset.value    = preset
    store.returnRate      = preset
    localValue.value      = String(preset)
    validationError.value = ''
  }

  return {
    localValue,
    validationError,
    onInput,
    isPresetActive,
    selectPreset,
    presets: RETURN_RATE_PRESETS,
  }
}
