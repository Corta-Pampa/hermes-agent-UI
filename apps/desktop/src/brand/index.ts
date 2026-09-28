/**
 * Corta brand layer — the one place the desktop learns it ships as Corta.
 *
 * Hermes Agent is the upstream engine; everything user-facing that says who we
 * are (name, skin, default interface mode, copy) is decided here so upstream
 * merges touch as few Hermes files as possible. See
 * docs/CORTA_DESKTOP_BRANDING.md at the repository root.
 */

export const BRAND = {
  /** Product name shown to people. */
  productName: 'Corta',
  /** Upstream engine name, kept for credits and technical surfaces. */
  upstreamName: 'Hermes',
  /** Built-in skin painted when nothing is persisted. */
  defaultSkin: 'corta',
  /** A cabinet opens on the conversation, not on the machinery. */
  defaultInterfaceMode: 'simple'
} as const
