import { onUnmounted } from 'vue'

export const useDebounce = (delay = 300) => {
    let timer: ReturnType<typeof setTimeout>

    const debounce = (fn: () => void) => {
        clearTimeout(timer)
        timer = setTimeout(fn, delay)
    }

    onUnmounted(() => clearTimeout(timer))

    return { debounce }
}