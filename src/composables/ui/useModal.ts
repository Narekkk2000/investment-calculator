import { ref } from 'vue'

/**
 * Minimal, side-effect-free modal state manager.
 *
 * Usage:
 *   const { isOpen, open, close, toggle } = useModal()
 *   <BaseModal v-model="isOpen" />
 */
export function useModal() {
    const isOpen = ref(false)

    function open() {
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
    }

    function toggle() {
        isOpen.value = !isOpen.value
    }

    return { isOpen, open, close, toggle }
}
