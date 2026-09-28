/**
 * The Corta copy overlay is a contract between the upstream catalogs and the
 * product name: whatever strings upstream adds, a person never reads "Hermes"
 * as the app's name — except where it names something Corta does not own —
 * and every message keeps the shape the app calls it with.
 *
 * vitest.setup.ts runs the upstream suite on the upstream catalog; this file
 * applies the real overlay to it.
 */

import { describe, expect, it, vi } from 'vitest'

import { TRANSLATIONS as UPSTREAM } from '@/i18n/catalog'
import type { Locale } from '@/i18n/types'

import type * as CopyModule from './copy'

const { brandCatalog, brandText } = await vi.importActual<typeof CopyModule>('./copy')

const BRANDED = brandCatalog(UPSTREAM)
const LOCALES = Object.keys(UPSTREAM) as Locale[]

const UPSTREAM_NAMES =
  /Hermes Cloud|Hermes(?:[- ]plugin)?[- ][Cc]atalog\w*|(?:catalogue|catálogo)(?: de plugins)?(?: de)? Hermes/g

function leaves(value: unknown, path = ''): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return [[path, value], ...value.flatMap((entry, index) => leaves(entry, `${path}.${index}`))]
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
  }

  return [[path, value]]
}

describe('Corta copy overlay', () => {
  it.each(LOCALES)('%s: no plain string names the app Hermes', locale => {
    const leaks = leaves(BRANDED[locale])
      .filter(([path]) => !/(^|\.)ssh[A-Z]/.test(path))
      .filter(([, text]) => typeof text === 'string' && text.replace(UPSTREAM_NAMES, '').includes('Hermes'))

    expect(leaks).toEqual([])
  })

  it.each(LOCALES)('%s: keeps every key, value kind, message arity and list length', locale => {
    const branded = new Map(leaves(BRANDED[locale]))

    for (const [path, value] of leaves(UPSTREAM[locale])) {
      const next = branded.get(path)

      expect({ path, kind: typeof next }).toEqual({ path, kind: typeof value })

      if (typeof value === 'function') {
        expect({ path, arity: (next as () => unknown).length }).toEqual({ path, arity: value.length })
      }

      if (Array.isArray(value)) {
        expect({ path, length: (next as unknown[]).length }).toEqual({ path, length: value.length })
      }
    }
  })

  it('renames formatted messages without touching the values passed in', () => {
    expect(BRANDED.en.sidebar.noMatch('Hermes minutes')).toContain('Hermes minutes')
    expect(BRANDED.en.sidebar.storageCorrupt.body('Hermes notes')).toMatch(/^Corta can't read .* for Hermes notes\./)
  })

  it('keeps the grammar of the sentence it renames', () => {
    expect(brandText("Hermes' background service")).toBe("Corta's background service")
    expect(brandText("l'installation d'Hermes")).toBe("l'installation de Corta")
    expect(brandText('Sign in to Hermes Cloud to start Hermes Desktop')).toBe('Sign in to Hermes Cloud to start Corta')
  })
})
