import { requestComposerFocus, requestComposerSetDraft } from '@/app/chat/composer/focus'
import type { IntroProps } from '@/components/chat/intro'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'

import { cortaCopy } from './copy'
import { CortaLogo } from './logo'

export type { IntroProps }

// A suggestion drafts the opening words and hands the caret back — it never
// sends. The person finishes the sentence ("…le dossier Martin").
function draftSuggestion(prompt: string) {
  void requestComposerSetDraft([], prompt, { active: true }).then(() => requestComposerFocus('active'))
}

/**
 * Corta's empty chat: the brand, one question, a few task openers. Replaces the
 * upstream personality splash (components/chat/intro.tsx) in the primary
 * thread; props are accepted for parity and deliberately ignored — Corta keeps
 * one voice whatever personality the agent runs with.
 */
export function Intro(_props: IntroProps) {
  const { locale } = useI18n()
  const copy = cortaCopy(locale)

  return (
    <div className="flex w-full min-w-0 flex-col items-center px-6 py-8 text-center" data-slot="aui_intro">
      <CortaLogo className="mb-7 h-9" />
      <h1 className="m-0 font-(family-name:--corta-font-display) text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] text-foreground">
        {copy.title}
      </h1>
      <p className="mt-8 mb-3 text-[0.6875rem] font-medium tracking-[0.09em] text-(--ui-text-tertiary) uppercase">
        {copy.suggestionsLabel}
      </p>
      <div className="flex max-w-[34rem] flex-wrap justify-center gap-2">
        {copy.suggestions.map(suggestion => (
          <Button key={suggestion.label} onClick={() => draftSuggestion(suggestion.prompt)} variant="outline">
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
