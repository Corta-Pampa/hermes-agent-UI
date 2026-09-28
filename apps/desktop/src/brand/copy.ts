/**
 * Corta copy over the upstream catalogs.
 *
 * `brandCatalog` runs once over every locale in i18n/catalog.ts: it renames the
 * product (Hermes → Corta) everywhere it names the app, then layers the Corta
 * vocabulary on top. Doing it here instead of editing each locale file keeps
 * upstream catalog merges conflict-free, and brands strings upstream adds later.
 *
 * Not a blind replace: upstream services and catalogs keep their real name,
 * SSH/remote-install copy keeps naming the `hermes` runtime it talks to, and a
 * string passed INTO a message (a session title, a profile name) is never
 * rewritten.
 */

import { mergeTranslations, type TranslationOverride } from '@hermes/shared/i18n'

import type { Locale, Translations } from '@/i18n/types'

import { BRAND } from '.'

const NAME = BRAND.productName

/** Names of things Corta does not own: the hosted service and the plugin catalog. */
const KEEP =
  /Hermes Cloud|Hermes(?:[- ]plugin)?[- ][Cc]atalog\w*|(?:catalogue|catálogo)(?: de plugins)?(?: de)? Hermes/g

const RENAMES: ReadonlyArray<[RegExp, string]> = [
  [/\bHermes (?:Agent|Desktop)\b/g, NAME],
  // English possessive: "Hermes' installation" → "Corta's installation".
  [/\bHermes' /g, `${NAME}'s `],
  // French elision: "d'Hermes" → "de Corta".
  [/\b([dD])['’]Hermes\b/g, `$1e ${NAME}`],
  [/\bHermes\b/g, NAME]
]

/** Keys whose copy describes the remote `hermes` install itself. */
const TECHNICAL_KEY = /^ssh/

// Private-use sentinel around held spans; never appears in catalog copy.
const MARK = ''
const HELD = /(\d+)/g

/** Rename the product in one string. `literal` spans (user data) pass through untouched. */
export function brandText(text: string, literal: readonly string[] = []): string {
  if (!text.includes(BRAND.upstreamName)) {
    return text
  }

  const kept: string[] = []
  const hold = (span: string) => `${MARK}${kept.push(span) - 1}${MARK}`
  let out = text

  for (const span of literal) {
    out = out.split(span).join(hold(span))
  }

  out = out.replace(KEEP, hold)

  for (const [pattern, replacement] of RENAMES) {
    out = out.replace(pattern, replacement)
  }

  return out.replace(HELD, (_, index: string) => kept[Number(index)] ?? '')
}

function brandValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return brandText(value)
  }

  if (typeof value === 'function') {
    const format = value as (...args: unknown[]) => unknown

    const branded = (...args: unknown[]) => {
      const out = format(...args)

      return typeof out === 'string'
        ? brandText(
            out,
            args.filter((arg): arg is string => typeof arg === 'string' && arg.includes(BRAND.upstreamName))
          )
        : out
    }

    // Keep the message's arity: catalog contracts compare it across locales.
    return Object.defineProperty(branded, 'length', { value: format.length })
  }

  if (Array.isArray(value)) {
    return value.map(brandValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, TECHNICAL_KEY.test(key) ? entry : brandValue(entry)])
    )
  }

  return value
}

type Overrides = TranslationOverride<Translations>

// Everyday words for a cabinet: a conversation, not a session; documents, not
// artifacts. Technical surfaces (settings, logs, the slash palette) keep theirs.
const VOCABULARY: Partial<Record<Locale, Overrides>> = {
  en: {
    commandCenter: {
      nav: {
        newChat: { title: 'New conversation', detail: 'Start a fresh conversation' },
        artifacts: { title: 'Documents', detail: 'Files and results Corta produced' }
      }
    },
    composer: {
      // Same length as every other locale's list (catalog contract).
      newSessionPlaceholders: [
        'What would you like to hand off?',
        'A file to prepare, a document to find…',
        'Describe the task in your own words',
        'Which file are we working on?',
        'A search, a summary, a letter…',
        'What should be ready for your next meeting?',
        'Hand off a task'
      ]
    },
    keybinds: { actions: { 'session.new': 'New conversation' } },
    sidebar: {
      nav: { 'new-session': 'New conversation', artifacts: 'Documents' },
      noMatch: query => `No conversations match “${query}”.`,
      noSessions: 'No conversations yet',
      projectEmpty: 'No conversations yet',
      searchAria: 'Search conversations',
      searchPlaceholder: 'Search conversations…',
      sessions: 'Conversations'
    }
  },
  fr: {
    commandCenter: {
      nav: {
        newChat: { title: 'Nouvelle conversation', detail: 'Démarrer une nouvelle conversation' },
        artifacts: { title: 'Documents', detail: 'Fichiers et résultats produits par Corta' }
      }
    },
    composer: {
      newSessionPlaceholders: [
        'Que voulez-vous me confier ?',
        'Un dossier à préparer, un document à retrouver…',
        'Décrivez la tâche avec vos mots',
        'Sur quel dossier travaillons-nous ?',
        'Une recherche, une synthèse, un courrier…',
        'Que faut-il préparer pour votre prochain rendez-vous ?',
        'Confiez-moi une tâche'
      ]
    },
    keybinds: { actions: { 'session.new': 'Nouvelle conversation' } },
    sidebar: {
      nav: { 'new-session': 'Nouvelle conversation', artifacts: 'Documents' },
      noMatch: query => `Aucune conversation ne correspond à « ${query} ».`,
      noSessions: 'Aucune conversation pour le moment',
      projectEmpty: 'Aucune conversation pour le moment',
      searchAria: 'Rechercher des conversations',
      searchPlaceholder: 'Rechercher des conversations…',
      sessions: 'Conversations'
    }
  }
}

export function brandCatalog(catalog: Record<Locale, Translations>): Record<Locale, Translations> {
  return Object.fromEntries(
    Object.entries(catalog).map(([locale, translations]) => [
      locale,
      mergeTranslations(brandValue(translations) as Translations, VOCABULARY[locale as Locale])
    ])
  ) as Record<Locale, Translations>
}

export interface CortaCopy {
  /** About page credit: the engine and its licence. */
  credit: string
  title: string
  suggestionsLabel: string
  /** Label shown on the chip, and the opening words it drops into the composer. */
  suggestions: ReadonlyArray<{ label: string; prompt: string }>
}

const COPY: Partial<Record<Locale, CortaCopy>> & { en: CortaCopy } = {
  en: {
    credit: 'Corta is built on Hermes Agent, open-source software by Nous Research (MIT License).',
    title: 'What would you like to hand off?',
    suggestionsLabel: 'For example',
    suggestions: [
      { label: 'Prepare a file', prompt: 'Prepare the file for ' },
      { label: 'Search my documents', prompt: 'Find in my documents ' },
      { label: 'Summarise exchanges', prompt: 'Summarise the latest exchanges with ' },
      { label: 'Draft a letter', prompt: 'Draft a letter to ' },
      { label: 'Organise files', prompt: 'Organise the files in ' }
    ]
  },
  fr: {
    credit: 'Corta repose sur Hermes Agent, logiciel libre de Nous Research (licence MIT).',
    title: 'Que voulez-vous me confier ?',
    suggestionsLabel: 'Par exemple',
    suggestions: [
      { label: 'Préparer un dossier', prompt: 'Prépare le dossier ' },
      { label: 'Rechercher dans mes documents', prompt: 'Retrouve dans mes documents ' },
      { label: 'Résumer des échanges', prompt: 'Résume les derniers échanges avec ' },
      { label: 'Préparer un courrier', prompt: 'Prépare un courrier pour ' },
      { label: 'Organiser des fichiers', prompt: 'Range les fichiers de ' }
    ]
  }
}

export const cortaCopy = (locale: Locale): CortaCopy => COPY[locale] ?? COPY.en
