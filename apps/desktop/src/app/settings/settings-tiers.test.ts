/**
 * Simple mode may rest administration pages out of the Settings nav, but it
 * must never strand the person: the page Settings opens on, and the page that
 * holds the Simple/Advanced switch, stay listed in Simple.
 */

import { describe, expect, it } from 'vitest'

import { INTERFACE_MODES, shownInMode } from '@/store/interface-mode'

import { SETTING_IDS, settingDefinition } from './settings-manifest'
import { defaultSettingsView, settingsTier } from './settings-tiers'

const shownIn = (mode: (typeof INTERFACE_MODES)[number], view: string) =>
  shownInMode(mode)({ tier: settingsTier(view) })

describe('settings tiers', () => {
  it.each(INTERFACE_MODES)('%s mode lists the page Settings opens on', mode => {
    expect(shownIn(mode, defaultSettingsView(mode))).toBe(true)
  })

  it('keeps the interface-mode switch reachable from Simple', () => {
    const view = 'config:appearance'

    expect(settingDefinition(view, SETTING_IDS.appearance.interfaceMode)).toBeDefined()
    expect(shownIn('simple', view)).toBe(true)
  })

  it('lists every page in Advanced', () => {
    for (const view of ['config:model', 'providers', 'gateway', 'keys', 'about']) {
      expect(shownIn('advanced', view)).toBe(true)
    }
  })
})
