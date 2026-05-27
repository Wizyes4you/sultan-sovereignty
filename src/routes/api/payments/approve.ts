import { createFileRoute } from "@tanstack/react-router";
import { computeReconstructionSplit } from "@/lib/stellar.functions";

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

async function fetchPayment(paymentId: string) {
  const res = await fetch(`${PI_API_BASE}/v2/payments/${paymentId}`, {
    headers: { Authorization: `Key ${requirePiKey()}` },
  });
  if (!res.ok) throw new Error(`Pi payment lookup failed: ${res.status}`);
  return (await res.json()) as {
    identifier: string;
    amount: number;
    memo?: string;
    metadata?: Record<string, unknown>;
    to_address?: string;
    transaction?: { txid: string; verified: boolean } | null;
  };
}

export const Route = createFileRoute("/api/payments/approve")({
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
        try {
          const body = (await request.json()) as { paymentId?: unknown };
          if (typeof body.paymentId === "string") paymentId = body.paymentId;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        if (!paymentId) return json({ error: "Missing paymentId" }, 400);

        try {
          // Record the 2.5% reconstruction split for this payment amount.
          const payment = await fetchPayment(paymentId);
          const split = await computeReconstructionSplit({ data: { amount: payment.amount } });

          // Approve the payment with the Pi Platform API.
          const res = await fetch(`${PI_API_BASE}/v2/payments/${paymentId}/approve`, {
            method: "POST",
            headers: { Authorization: `Key ${requirePiKey()}` },
          });
          if (!res.ok) {
            const text = await res.text();
            return json({ error: `Pi approve failed (${res.status}): ${text}` }, 502);
          }

          return json({ approved: true, paymentId, split });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : String(e) }, 500);
        }
      },
    },
  },
});
