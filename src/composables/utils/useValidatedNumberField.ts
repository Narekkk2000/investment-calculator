import { ref, watch, Ref } from 'vue'
import { useDebounce } from '@/composables/utils/useDebounce'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidatedNumberFieldConfig {
    /** Returns current value from the store — watched for external changes */
    source: () => number
    /** Writes validated number back to the store */
    commit: (n: number) => void
    /** Returns error message string or empty string if valid */
    validator: (val: string) => string
    /** How to parse the raw string to number. Defaults to parseFloat */
    parse?: (val: string) => number
    /** Debounce delay in ms. Defaults to 300 */
    delay?: number
}

interface ValidatedNumberFieldReturn {
    localValue: Ref<string>
    validationError: Ref<string>
    onInput: (val: string) => void
}

// ─── Composable ───────────────────────────────────────────────────────────────

export const useValidatedNumberField = (
    {
        source,
        commit,
        validator,
        parse = (val: string) => parseFloat(val),
        delay = 300
    }: ValidatedNumberFieldConfig): ValidatedNumberFieldReturn => {

    const { debounce } = useDebounce(delay)

    const localValue = ref(String(source()))
    const validationError = ref('')

    watch(source, (val) => { localValue.value = String(val) }, { immediate: false })

    const onInput = (val: string) => {
        localValue.value = val
        const normalized = val.replace(',', '.')
        validationError.value = validator(normalized)
        if (validationError.value) return
        const n = parse(normalized)
        debounce(() => commit(n))
    }

    return {
        localValue,
        validationError,
        onInput,
    }
}