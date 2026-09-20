# Sultan DApp Frontend Overhaul

## Goal
Rebuild the main Sultan interface as a full-viewport Pi Browser dashboard with direct wallet authentication, live operational metrics, multilingual content, and accessible light/dark themes.

## Interface
- Replace the decorative palace/card presentation with a clean edge-to-edge application canvas optimized for narrow embedded mobile screens.
- Add a compact header with “Sultan DApp”, a “Pi OS Compliant” badge, AR/EN/FR/ES language control, theme toggle, and primary wallet connection action.
- Build a restrained product introduction and live metrics band for the 2.5% allocation, reconstruction flow status, and monitored-node count.
- Present Zakat Engine, Sovereign Security, and Community Utilities in a flat, responsive module grid without nested cards.
- Add a compact footer with PiOS license, GitHub, legal/support routes, and the developer handle.

## Behavior
- Keep Pi SDK mainnet initialization and bind authentication directly to the prominent wallet button.
- Preserve the existing verified session, payment approval/completion, gas quote, and incomplete-payment handling.
- Remove automatic authentication on page load so users explicitly initiate wallet access.
- Drive the active-node display from the existing core health request: one monitored node while online, zero when unavailable.
- Support complete Arabic RTL and English LTR copy switching; include professional French and Spanish interface copy for their selector options.
- Persist theme and language preferences in the browser after hydration, with system theme as the initial default.

## Design System
- Replace legacy palace-specific raw colors and effects with semantic light/dark tokens in the global stylesheet.
- Use crisp sans-serif typography, precise separators, restrained Pi purple and utility green accents, subtle motion, and reduced-motion support.
- Use existing shared buttons and iconography for interactive controls; keep all controls touch-friendly.

## Validation
- Verify wallet initiation and all language/theme controls in the live preview.
- Check both mobile Pi Browser dimensions and desktop layout for full-width rendering, readable text, and no overlap.
- Run focused tests for Pi authentication/payment behavior and confirm every content route retains complete, unique social metadata.
