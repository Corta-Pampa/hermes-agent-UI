import { brandCatalog } from '@/brand/copy'

import { ar } from './ar'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { ja } from './ja'
import { ru } from './ru'
import type { Locale, Translations } from './types'
import { zh } from './zh'
import { zhHant } from './zh-hant'

// Corta: product name and vocabulary are layered over every locale (src/brand/copy.ts).
export const TRANSLATIONS: Record<Locale, Translations> = brandCatalog({
  en,
  zh,
  'zh-hant': zhHant,
  ja,
  ar,
  ru,
  fr,
  de,
  es
})
