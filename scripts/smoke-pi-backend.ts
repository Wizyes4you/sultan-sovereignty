/**
 * Live smoke check for the deployed payment backend.
 *
 * Hits /api/payments/approve with a bogus paymentId. A correctly wired
 * backend will:
 *   - load PI_API_KEY from secrets,
 *   - call Pi Platform GET /v2/payments/<bogus>,
 *   - get a 4xx from Pi, and return a 5xx envelope to us.
 *
 * What this proves: the route is reachable, env vars are wired, and the
 * Pi API key authenticates against api.minepi.com. It does NOT move any π.
 *
 * Usage:  bun scripts/smoke-pi-backend.ts [https://sultan-core.lovable.app]
 */
const base = process.argv[2] ?? "https://sultan-core.lovable.app";
const url = `${base.replace(/\/$/, "")}/api/payments/approve`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ paymentId: "smoke-test-bogus-id" }),
});
const text = await res.text();

console.log(`POST ${url}`);
console.log(`status: ${res.status}`);
console.log(`body:   ${text}`);

// 400 = our validation (missing/invalid id).
// 502 = Pi rejected our lookup — means PI_API_KEY *did* reach Pi.
// 500 with "PI_API_KEY is not configured" = secret missing on server.
if (/PI_API_KEY is not configured/.test(text)) {
  console.error("\n❌ PI_API_KEY is not set on the server.");
  process.exit(1);
}
if (res.status === 502 || /Pi payment lookup failed/.test(text)) {
  console.log("\n✅ Backend reached Pi Platform — env wiring looks correct.");
  process.exit(0);
}
console.log("\n⚠️  Unexpected response — inspect above.");
