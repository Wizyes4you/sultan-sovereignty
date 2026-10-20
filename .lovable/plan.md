# Pi Troubleshooting Assistant

Add an in-app assistant where Pi users can describe payment or RPC problems and receive concise troubleshooting steps grounded in SULTAN's documented error states.

## What will change
- Add a validated, size-limited server function that sends only the user's issue, an optional sanitized error message, and the chosen response language to Lovable AI; do not persist submissions or include wallet credentials/payment identifiers.
- Use the workspace AI Gateway with the current default OpenAI Responses model, streaming the model response and returning its final advice with safe failure handling.
- Add a compact, accessible troubleshooting form and result/error states to the home screen, localized in Arabic, English, French, and Spanish.
- Add a small test for the documented error-to-guidance mapping and record the server/client module boundary in `AGENTS.md`.

## Technical details
- Use TanStack Start `createServerFn` with Zod validation; keep Gateway calls, prompts, and `LOVABLE_API_KEY` server-side.
- Ground recommendations in known Pi SDK, session, payment approval/completion, cancellation, and Horizon/RPC error states; advise checking payment status before any retry.
- Verify the preview build, targeted tests, and a live Gateway response if the workspace key is available.
