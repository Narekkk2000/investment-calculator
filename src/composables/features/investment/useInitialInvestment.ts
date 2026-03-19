import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useValidatedNumberField } from '@/composables/utils/useValidatedNumberField'
import { validateLoanAmount } from '@/utils/validators'
import { MAX_INVESTMENT_AMOUNT, MAX_CONTRIBUTION_AMOUNT } from '@/constants/investmentValidators'
import { INVESTMENT_AMOUNT_PRESETS } from '@/constants/investmentOptions'

// ─── Initial investment amount ────────────────────────────────────────────────

export const useInitialInvestment = () => {
  const store = useInvestmentStore()

  const { localValue, validationError, onInput } = useValidatedNumberField({
    source:    () => store.initialAmount,
    commit:    (n) => { store.initialAmount = n },
    validator: (val) => validateLoanAmount(val, MAX_INVESTMENT_AMOUNT),
    parse:     (val) => parseFloat(val.replace(/\./g, '')),
  })

  const isPresetActive = (preset: number) => store.initialAmount === preset

  const selectPreset = (preset: number) => {
    store.initialAmount   = preset
    localValue.value      = String(preset)
    validationError.value = ''
  }

  return { localValue, validationError, onInput, isPresetActive, selectPreset, presets: INVESTMENT_AMOUNT_PRESETS }
}

// ─── Contribution amount ──────────────────────────────────────────────────────

export const useContributionAmount = () => {
  const store = useInvestmentStore()

  const { localValue, validationError, onInput } = useValidatedNumberField({
    source:    () => store.contributionAmount,
    commit:    (n) => { store.contributionAmount = n },
    validator: (val) => validateLoanAmount(val, MAX_CONTRIBUTION_AMOUNT),
    parse:     (val) => parseFloat(val.replace(/\./g, '')),
  })

  return { localValue, validationError, onInput }
}
