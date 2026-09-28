// Corta: the product name people read in native chrome (window titles, tray,
// notifications, dialogs, About). The technical identity — app name, userData,
// AppUserModelID, update channel, HUD window matching — stays upstream's
// (product-identity.cjs), so installs, updates and window rules keep working.
// Renderer counterpart: src/brand/index.ts.
export const PRODUCT_DISPLAY_NAME = 'Corta'

/** Native About panel credit: the engine Corta runs on. */
export const PRODUCT_COPYRIGHT = 'Built on Hermes Agent — Copyright © 2026 Nous Research'
