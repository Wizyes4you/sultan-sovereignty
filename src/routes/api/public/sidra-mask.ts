// Sidra Mask — bara'mij telemetry for incomplete Pi payments.
// Public endpoint (no auth) called from the Pi Browser so no transaction is
// ever lost: the client reports any payment the SDK surfaces as incomplete
// (network drop, app close, etc.) and the backend logs it for follow-up.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/sidra-mask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown = null;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const p = payload as {
          identifier?: string;
          amount?: number;
          memo?: string;
          to_address?: string;
          metadata?: Record<string, unknown>;
        } | null;

        if (!p || typeof p.identifier !== "string") {
          return new Response("Missing identifier", { status: 400 });
        }

        // Server-side trail. Visible in stack_modern--server-function-logs.
        console.warn("[Sidra Mask] Incomplete payment reported", {
          at: new Date().toISOString(),
          identifier: p.identifier,
          amount: p.amount,
          memo: p.memo,
          to_address: p.to_address,
          metadata: p.metadata,
          ua: request.headers.get("user-agent"),
        });

        return Response.json({
          ok: true,
          tracked: p.identifier,
          protocol: "Sidra Mask",
          at: new Date().toISOString(),
        });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});
