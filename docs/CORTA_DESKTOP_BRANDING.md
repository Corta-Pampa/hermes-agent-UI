# Corta desktop branding

The desktop app (`apps/desktop`) ships as **Corta**. Hermes Agent stays the
engine underneath. This note is for whoever changes the brand or merges
upstream Hermes.

## Principle

Corta is a *skin + copy layer*, not a fork of the UI:

```
src/brand (tokens, fonts, logo, copy)
  → Hermes theme engine / i18n catalog / interface-mode policy
    → unchanged upstream components
```

Most of the look comes from one skin (`corta`) registered in the existing theme
system and a CSS file scoped to `:root[data-hermes-theme='corta']`. Every other
skin still renders exactly as upstream ships it.

## Where things live

| What | Where |
| --- | --- |
| Brand config (name, default skin, default interface mode) | `apps/desktop/src/brand/index.ts` |
| Palette (light + dark), from corta.fr's own CSS tokens | `apps/desktop/src/brand/corta-theme.ts` |
| Structural tokens (surfaces, lines, radii, tracking, reading width, tabs) + `@font-face` | `apps/desktop/src/brand/corta.css` |
| Stack Sans Text / Headline (woff2, latin, weights 200–700) + OFL licence | `apps/desktop/src/brand/fonts/` |
| Logo (`corta-logo.svg`, verbatim from corta.fr) and mark (`corta-mark.svg`, derived from it) | `apps/desktop/src/brand/assets/` |
| Logo components (`CortaLogo`, `CortaMark`) | `apps/desktop/src/brand/logo.tsx` |
| Product rename + vocabulary over every locale, empty-state copy, About credit | `apps/desktop/src/brand/copy.ts` (+ `copy.test.ts`) |
| Empty chat screen ("Que voulez-vous me confier ?") | `apps/desktop/src/brand/intro.tsx` |
| Native names (window titles, tray, notifications, About panel) | `apps/desktop/electron/brand.ts` |
| App icons generator | `scripts/corta/generate_desktop_icons.py` |

## Upstream files touched (keep these in mind when merging)

Small, deliberate hooks — each is a line or two:

- `src/themes/presets.ts` — registers `cortaTheme`; `DEFAULT_SKIN_NAME = BRAND.defaultSkin`.
- `src/i18n/catalog.ts` — wraps `TRANSLATIONS` in `brandCatalog(...)`.
- `src/main.tsx` — imports `./brand/corta.css` after `styles.css`.
- `src/components/assistant-ui/thread/index.tsx` — `Intro` imported from `@/brand/intro`.
- `src/components/brand-mark.tsx` — renders the Corta mark.
- `src/store/interface-mode.ts` — default mode comes from `BRAND` (Simple); the
  codec now round-trips both explicit picks.
- `src/app/settings/index.tsx` + new `settings-tiers.ts` — Simple mode lists the
  everyday Settings pages and opens on Appearance; Advanced lists everything.
- `src/app/chat/composer/index.tsx` — model/reasoning pills hidden in Simple mode.
- `src/app/chat/sidebar/index.tsx` — "new conversation" icon (pencil, not robot).
- `apps/shared/src/translucency.ts` — window glass opt-in (default tint 0).
- `index.html` — `<title>Corta</title>` and pre-paint colours.
- `electron/{main,minimize-to-tray,notification-ipc,notification-linux,quit-guard,renderer-load-error-page}.ts`
  — visible names read `PRODUCT_DISPLAY_NAME`.
- Tokenised primitives (upstream defaults unchanged, Corta overrides them):
  `components/ui/button.tsx`, `components/ui/control.ts` (`--control-radius`,
  `--control-icon-radius`), `components/ui/pane-tab.tsx` (`--pane-tab-*`),
  `app/shell/sidebar-label.tsx` (`--ui-section-label`), declared in `styles.css`.
- Generic fixes that also help upstream: localized fresh-draft tab title
  (`app/chat/session-draft-title.tsx`, `app/contrib/controller.tsx`), composer
  placeholder that follows a late-loaded language
  (`composer/hooks/use-composer-placeholder.ts`), capital accents no longer
  clipped in section labels.
- Binary icons in `apps/desktop/assets/` and `apps/desktop/public/apple-touch-icon.png`.

Not touched on purpose: the agent core, `hermes serve`, `product-identity.cjs`
(app id, userData folder, update channel, CLI name), `LICENSE`, the upstream
locale files.

## Common changes

**Colours** — edit `corta-theme.ts` (inline-painted colours) and the matching
surfaces/lines in `corta.css`. Keep light and dark in step; values come from
corta.fr (`https://corta.fr/style.css`, `:root` and `[data-theme="dark"]`).

**Logo** — replace `src/brand/assets/corta-logo.svg`, regenerate
`corta-mark.svg` if the mark changed, then rerun the icon script:

```bash
.venv/Scripts/python scripts/corta/generate_desktop_icons.py
```

(`.venv/bin/python` on macOS/Linux; Pillow and resvg-py come with the dev env.)

**Font** — drop new woff2 files in `src/brand/fonts/`, update the `@font-face`
rules in `corta.css` and `CORTA_FONT_SANS` in `corta-theme.ts`.

**Wording** — product-name handling and the everyday vocabulary
(conversation / documents) live in `copy.ts`. Add per-locale overrides to
`VOCABULARY`; never edit the upstream `i18n/*.ts` files for branding.
`copy.test.ts` fails if any locale still names the app "Hermes".

**Simple vs Advanced** — which Settings pages are "administration" is the set in
`settings-tiers.ts`; which shell surfaces rest in Simple mode is
`SIMPLE_POLICY` in `store/interface-mode.ts` (upstream's).

## Tests

`apps/desktop/vitest.setup.ts` mocks `@/brand` (default interface mode →
Advanced) and `@/brand/copy` (`brandCatalog` → identity) for the UI suite, so the
thousands of upstream tests keep asserting upstream copy and the upstream
default mode, and merge without edits. The Corta layer is covered by its own
tests, which load the real modules with `vi.importActual`:

- `src/brand/copy.test.ts` — no locale names the app "Hermes"; the overlay keeps
  every key, value kind, message arity and list length of the upstream catalog.
- `src/app/settings/settings-tiers.test.ts` — Simple mode never hides the page
  Settings opens on nor the Simple/Advanced switch.
- `src/store/interface-mode.test.ts` — both explicit modes round-trip; the
  default writes nothing.

## Merge checklist

1. Resolve conflicts in the files listed above; they are small by design.
2. If upstream regenerated icons (`scripts/generate_icons.py`), rerun the Corta
   icon script. Upstream's `icons-freshness-check` workflow compares against
   the Hermes art and will flag the desktop icons on this fork — expected.
3. If upstream renamed `BUILTIN_THEMES`, `TRANSLATIONS`, `DEFAULT_INTERFACE_MODE`
   or the `Intro` import, re-hook the brand there.
4. Run from `apps/desktop`: `npm run typecheck`, `npm run lint`,
   `npx vitest run --project ui src/brand src/themes src/store/interface-mode.test.ts`.
5. Look at the app: `npm run build`, then launch it (or the e2e mock flow) and
   check the empty state, a conversation, Settings, and dark mode.

## Credits and licences

- Hermes Agent © Nous Research, MIT licence (`LICENSE` at the repo root) —
  credited in Settings → About.
- Stack Sans © The Stack Sans Project Authors, SIL Open Font License 1.1
  (`src/brand/fonts/OFL.txt`).
