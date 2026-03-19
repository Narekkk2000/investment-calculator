<template>
  <Teleport to="body">
    <Transition name="bm" appear>
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <!-- Backdrop — fades only -->
        <div
          class="bm-backdrop absolute inset-0 backdrop-blur-sm"
          style="background: rgba(8, 11, 20, 0.78)"
          @click="handleBackdropClick"
        />

        <!-- Panel — fades + scales + translates -->
        <div
          ref="panelRef"
          tabindex="-1"
          class="bm-panel relative w-full flex flex-col rounded-2xl outline-none"
          :style="panelStyle"
        >
          <!-- Header slot (optional) -->
          <div v-if="$slots.header" class="flex-shrink-0">
            <slot name="header" :close="close" />
          </div>

          <!-- Body slot — the only scrollable region -->
          <div class="flex-1 overflow-y-auto min-h-0">
            <slot :close="close" />
          </div>

          <!-- Footer slot (optional) -->
          <div v-if="$slots.footer" class="flex-shrink-0">
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' |  'full'

const props = withDefaults(
  defineProps<{
    /** v-model: controls open/closed state */
    modelValue: boolean
    /** Maximum width of the panel. Defaults to 'lg'. */
    maxWidth?: MaxWidth
    /** Close when the backdrop is clicked. Defaults to true. */
    closeOnBackdrop?: boolean
    /** Close when Escape is pressed. Defaults to true. */
    closeOnEscape?: boolean
    /** Explicit width as a percentage (e.g. 80 → "80%"). Overrides maxWidth when set. */
    width?: number
    /** Explicit height in pixels (e.g. 600 → "600px"). Overrides maxHeight when set. */
    height?: number
  }>(),
  {
    maxWidth: 'lg',
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// ── Refs ────────────────────────────────────────────────────────────────────

const panelRef = ref<HTMLElement | null>(null)
/** The element that had focus when the modal opened; restored on close. */
let triggerElement: HTMLElement | null = null

// ── Panel sizing ─────────────────────────────────────────────────────────────

const MAX_WIDTH_MAP: Record<MaxWidth, string> = {
  sm: '20%',
  md: '30%',
  lg: '45%',
  xl: '60%',
  '2xl': '70%',
  '3xl': '80%',
  full: '100%',
}

const panelStyle = computed(() => ({
  maxWidth: MAX_WIDTH_MAP[props.maxWidth],
  maxHeight: '90vh',
  ...(props.width  !== undefined && { width:  `${props.width}%`   }),
  ...(props.height !== undefined && { height: `${props.height}px` }),
  background: 'var(--color-app-bg)',
  border: '1px solid rgba(99, 179, 237, 0.12)',
  boxShadow: '0 25px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,179,237,0.06)',
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function close() {
  emit('update:modelValue', false)
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) close()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEscape) close()
}

// ── Body scroll lock ─────────────────────────────────────────────────────────

function lockBodyScroll() {
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.overflow = ''
}

// ── Escape key management ─────────────────────────────────────────────────────

function addEscapeListener() {
  document.addEventListener('keydown', handleKeydown)
}

function removeEscapeListener() {
  document.removeEventListener('keydown', handleKeydown)
}

// ── Open / close side-effects ─────────────────────────────────────────────────

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      // Capture the element that triggered the open so we can restore focus later
      if (document.activeElement instanceof HTMLElement) {
        triggerElement = document.activeElement
      }
      lockBodyScroll()
      addEscapeListener()
      // Wait for Vue to render the panel before moving focus into it
      await nextTick()
      panelRef.value?.focus()
    } else {
      unlockBodyScroll()
      removeEscapeListener()
      // Restore focus to where the user was before opening
      triggerElement?.focus()
      triggerElement = null
    }
  },
)

// ── Safety cleanup — never leave scroll locked or listeners dangling ──────────

onUnmounted(() => {
  unlockBodyScroll()
  removeEscapeListener()
})
</script>

<!--
  Non-scoped styles required so the descendant selectors
  (.bm-enter-from .bm-backdrop etc.) work across the Teleport boundary.
  All class names are prefixed "bm-" to avoid collisions.
-->
<style>
/* ── Backdrop: opacity fade only ─────────────────────────────────────────── */
.bm-enter-from .bm-backdrop,
.bm-leave-to   .bm-backdrop { opacity: 0; }

.bm-enter-active .bm-backdrop { transition: opacity 250ms ease; }
.bm-leave-active .bm-backdrop { transition: opacity 200ms ease; }

/* ── Panel: opacity + scale + translateY ─────────────────────────────────── */
.bm-enter-from .bm-panel,
.bm-leave-to   .bm-panel {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

/* Enter: natural slight-overshoot spring */
.bm-enter-active .bm-panel {
  transition:
    opacity   250ms ease,
    transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Leave: quicker, simpler ease (faster exits feel more responsive) */
.bm-leave-active .bm-panel {
  transition:
    opacity   200ms ease,
    transform 200ms ease;
}
</style>
