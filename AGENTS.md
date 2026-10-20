# Architecture decisions

- Keep Lovable AI calls, gateway credentials, prompts, and request-specific gateway helpers in server-only modules; expose validated client-callable operations through `*.functions.ts` so secrets and provider logic never enter browser bundles.