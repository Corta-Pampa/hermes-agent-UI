/**
 * Corta skin palette, lifted from corta.fr's own design tokens (style.css
 * `:root` and `:root[data-theme="dark"]`). Where the app needs an opaque colour
 * and the site uses an ink-alpha (`--line`, `--accent-soft`), the value is that
 * alpha composited over the surface it sits on. `presets.ts` turns these into
 * the `corta` DesktopTheme; structural tokens (radius, fills, strokes) live in
 * ./corta.css.
 *
 * Kept free of imports from `@/themes` so the preset table can import it.
 */

import type { DesktopThemeColors } from '@/themes/types'

/** Site `--font`: Stack Sans Text, then its metric-matched Arial fallback. */
export const CORTA_FONT_SANS = '"Stack Sans Text", "Stack Sans Fallback"'

export const CORTA_COLORS: DesktopThemeColors = {
  background: '#fcfcfb', // --surface-bar
  foreground: '#111111', // --ink
  card: '#ffffff', // --surface
  cardForeground: '#111111',
  muted: '#efefeb', // --bg-alt
  mutedForeground: '#6b6b65', // --muted
  popover: '#ffffff',
  popoverForeground: '#111111',
  // The site's primary action is ink, not the green.
  primary: '#111111',
  primaryForeground: '#ffffff', // --on-ink
  secondary: '#efefeb',
  secondaryForeground: '#111111',
  accent: '#eaeeeb', // --accent-soft over --surface-bar
  accentForeground: '#111111',
  border: '#e4e4e2', // --line over --surface-bar
  input: '#d6d6d4', // --line-strong
  ring: '#1d4a38', // --accent
  midground: '#1d4a38',
  midgroundForeground: '#ffffff', // --on-accent
  composerRing: '#111111',
  destructive: '#b42318',
  destructiveForeground: '#ffffff',
  sidebarBackground: '#f7f7f5', // --bg
  sidebarBorder: '#e4e4e2',
  userBubble: '#efefeb',
  userBubbleBorder: '#e4e4e2'
}

export const CORTA_DARK_COLORS: DesktopThemeColors = {
  background: '#161615', // --bg-alt
  foreground: '#ededea', // --ink
  card: '#1b1b1a', // --surface
  cardForeground: '#ededea',
  muted: '#1f1f1d', // --surface-2
  mutedForeground: '#9b9b94', // --muted
  popover: '#1f1f1d',
  popoverForeground: '#ededea',
  primary: '#ededea',
  primaryForeground: '#111110', // --on-ink
  secondary: '#1f1f1d',
  secondaryForeground: '#ededea',
  accent: '#1f2722', // --accent-soft over --bg-alt
  accentForeground: '#ededea',
  border: '#2c2c2a', // --line over --bg-alt
  input: '#383837', // --line-strong
  ring: '#6fbf98', // --accent
  midground: '#6fbf98',
  midgroundForeground: '#0c1d15', // --on-accent
  composerRing: '#ededea',
  destructive: '#f97066',
  destructiveForeground: '#111110',
  sidebarBackground: '#111110', // --bg
  sidebarBorder: '#2c2c2a',
  userBubble: '#1f1f1d',
  userBubbleBorder: '#2c2c2a'
}
