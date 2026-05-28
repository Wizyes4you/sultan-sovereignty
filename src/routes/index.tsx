import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authenticatePi, establishSession, initPi } from "@/lib/pi-client";
import { PiPaymentButton } from "@/components/PiPaymentButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SULTAN — Pi Network App" },
      { name: "description", content: "Pi Network app powered by the Pi Browser SDK." },
    ],
  }),
  component: Index,
});

type Status = "idle" | "initializing" | "signing-in" | "ready" | "error";

function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setError(null);
    setStatus("signing-in");
    try {
      const auth = await authenticatePi();
      const session = await establishSession(auth.accessToken);
      setUser(session);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("initializing");
      try {
        await initPi();
        if (cancelled) return;
        await signIn();
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">SULTAN</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pi Network application</p>
      </div>

      {user ? (
        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-md border bg-card px-4 py-3 text-sm">
            Signed in as <span className="font-medium">@{user.username}</span>
          </div>

          <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
            <h2 className="text-sm font-semibold text-foreground">Humanitarian Reconstruction Contribution</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Support sovereign validation through Pi Network. Your contribution helps fund humanitarian reconstruction efforts via Stellar-based transactions.
            </p>
            <div className="mt-4">
              <PiPaymentButton userId={user.uid} userName={user.username} />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={signIn}
          disabled={status === "signing-in" || status === "initializing"}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "initializing"
            ? "Initializing Pi…"
            : status === "signing-in"
              ? "Signing in…"
              : "Sign in with Pi"}
        </button>
      )}

      {error && (
        <p className="max-w-sm rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </main>
  );
}
