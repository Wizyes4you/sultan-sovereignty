import { createFileRoute } from "@tanstack/react-router";

const PRODUCTION_ORIGIN = "https://sultanfacf5238.pinet.com";
const ALLOWED_ORIGINS = new Set([
  PRODUCTION_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173",
]);
const PI_API_BASE = "https://api.minepi.com";

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : PRODUCTION_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function requirePiKey(): string {
  const k = process.env.PI_API_KEY;
  if (!k) throw new Error("PI_API_KEY is not configured");
  return k;
}

export const Route = createFileRoute("/api/payments/complete")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) }),
      POST: async ({ request }) => {
        const cors = corsHeaders(request.headers.get("origin"));
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json", ...cors },
          });

        let paymentId: string | undefined;
        let txid: string | undefined;
        try {
          const body = (await request.json()) as { paymentId?: unknown; txid?: unknown };
          if (typeof body.paymentId === "string") paymentId = body.paymentId;
          if (typeof body.txid === "string") txid = body.txid;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        if (!paymentId || !txid) return json({ error: "Missing paymentId or txid" }, 400);

        try {
          const res = await fetch(`${PI_API_BASE}/v2/payments/${paymentId}/complete`, {
            method: "POST",
            headers: {
              Authorization: `Key ${requirePiKey()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ txid }),
          });
          if (!res.ok) {
            const text = await res.text();
            return json({ error: `Pi complete failed (${res.status}): ${text}` }, 502);
          }
          const completed = await res.json();
          return json({ completed: true, paymentId, txid, payment: completed });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : String(e) }, 500);
        }
      },
    },
  },
});
