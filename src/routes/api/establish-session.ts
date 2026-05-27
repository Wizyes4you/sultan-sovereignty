import { createFileRoute } from "@tanstack/react-router";

const PRODUCTION_ORIGIN = "https://sultanfacf5238.pinet.com";

const ALLOWED_ORIGINS = new Set([
  PRODUCTION_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : PRODUCTION_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

export const Route = createFileRoute("/api/establish-session")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(request.headers.get("origin")),
        });
      },
      POST: async ({ request }) => {
        const cors = corsHeaders(request.headers.get("origin"));
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json", ...cors },
          });

        let accessToken: string | undefined;
        try {
          const body = (await request.json()) as { accessToken?: unknown };
          if (typeof body.accessToken === "string" && body.accessToken.length > 0) {
            accessToken = body.accessToken;
          }
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        if (!accessToken) return json({ error: "Missing accessToken" }, 400);

        const meRes = await fetch("https://api.minepi.com/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!meRes.ok) {
          return json({ error: "Pi token verification failed" }, 401);
        }
        const me = (await meRes.json()) as { uid: string; username: string };

        // Set an httpOnly cookie scoped to this app. For full session
        // encryption, swap to useSession from @tanstack/react-start/server.
        const cookie = [
          `pi_uid=${encodeURIComponent(me.uid)}`,
          "Path=/",
          "HttpOnly",
          "Secure",
          "SameSite=None",
          `Max-Age=${60 * 60 * 24 * 7}`,
        ].join("; ");

        return new Response(JSON.stringify({ uid: me.uid, username: me.username }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
            ...cors,
          },
        });
      },
    },
  },
});
