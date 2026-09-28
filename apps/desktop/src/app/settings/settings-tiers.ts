import type { InterfaceMode, InterfaceTier } from '@/store/interface-mode'

import type { SettingsView } from './types'

// Settings rows that administer the machinery (models, providers, gateways,
// keys, runtime) rather than shape everyday use. Simple mode rests them out of
// the nav the way it rests the terminal: the pages stay one search, ⌘K or deep
// link away, and Advanced lists everything. Rows not named here show in both.
const ADVANCED_VIEWS: ReadonlySet<string> = new Set([
  'config:model',
  'config:workspace',
  'config:safety',
  'config:browser',
  'config:memory',
  'config:advanced',
  'vault',
  'billing',
  'providers',
  'gateway',
  'keybinds',
  'keys',
  'sessions'
])

export const settingsTier = (view: string): InterfaceTier | undefined =>
  ADVANCED_VIEWS.has(view) ? 'advanced' : undefined

/** The page Settings opens on when the URL names none. */
export const defaultSettingsView = (mode: InterfaceMode): SettingsView =>
  mode === 'simple' ? 'config:appearance' : 'config:model'
