export const COLORS = {
  BG:           '#FFFFFF',
  SURFACE:      '#EBFEE6',
  ACCENT:       '#B9E919',
  ACCENT_BRIGHT:'#C0F100',
  WARNING:      '#F1CE64',
  SECONDARY:    '#3D7811',
  CONTENT:      '#05302D',
  MUTED:        '#717372',
  DIM:          '#3C5801',
  DEEP:         '#05302D',
  SUBTLE:       '#E2F1BA',
  WHITE:        '#ffffff',
} as const

export type ColorName = keyof typeof COLORS
