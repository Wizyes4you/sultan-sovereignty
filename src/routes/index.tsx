import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authenticatePi, establishSession, initPi } from "@/lib/pi-client";
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { SultanBackdrop } from "@/components/SultanBackdrop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SULTAN — صرح ممرد من قوارير" },
      {
        name: "description",
        content:
          "SULTAN (سُلطان) — Solomon Palace super-app on Pi Network. Sovereign wallet, wisdom AI, and humanitarian reconstruction.",
      },
      { property: "og:title", content: "SULTAN — سُلطان" },
      {
        property: "og:description",
        content: "A crystalline Pi Network super-app inspired by the Palace of Solomon.",
      },
      { property: "og:type", content: "website" },
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

  const statusLabel =
    status === "initializing"
      ? "يُهيِّئ سدرة المنتهى الرقمية…"
      : status === "signing-in"
        ? "يدخل القصر…"
        : "ادخل بـ Pi  ·  Enter with Pi";

  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16">
        {/* Crown emblem */}
        <div className="sultan-float relative" aria-hidden>
          <div className="sultan-pulse-glow flex h-24 w-24 items-center justify-center rounded-full sultan-glass">
            <svg viewBox="0 0 64 64" className="h-12 w-12">
              <defs>
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f5d27a" />
                  <stop offset="100%" stopColor="#c9a14a" />
                </linearGradient>
              </defs>
              <path
                d="M8 44 L16 20 L24 36 L32 12 L40 36 L48 20 L56 44 Z"
                fill="url(#g1)"
                stroke="#fff8e0"
                strokeWidth="1"
              />
              <rect x="8" y="46" width="48" height="6" rx="2" fill="url(#g1)" />
              <circle cx="16" cy="20" r="2.5" fill="#fff" />
              <circle cx="32" cy="12" r="3" fill="#fff" />
              <circle cx="48" cy="20" r="2.5" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-amber-200/70">
            صرح ممرد من قوارير
          </p>
          <h1 className="sultan-gold-text text-6xl font-bold tracking-tight sm:text-7xl">
            SULTAN
          </h1>
          <p
            className="mt-3 text-2xl font-light text-amber-100/90"
            style={{ fontFamily: "Amiri, 'Noto Naskh Arabic', serif" }}
          >
            سُلطان
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            A crystalline super-app on the Pi Network — wisdom, sovereignty, and
            humanitarian light woven into one palace.
          </p>
        </div>

        {/* Main card */}
        {user ? (
          <div className="w-full max-w-md space-y-4 animate-fade-in">
            <div className="sultan-glass flex items-center gap-3 rounded-2xl px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-bold text-[#1a1206]">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs text-amber-200/60">أهلاً بك يا سلطان</p>
                <p className="text-sm font-medium text-white">@{user.username}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="sultan-glass rounded-2xl p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-300 to-transparent" />
                <p className="text-xs uppercase tracking-widest text-amber-200/80">
                  Humanitarian Reconstruction
                </p>
              </div>
              <h2 className="text-lg font-semibold text-white">
                إعمار · Sovereign Contribution
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/65">
                Every Pi flows through Stellar rails toward humanitarian
                reconstruction. The Palace records, the gold remembers.
              </p>
              <div className="mt-5">
                <PiPaymentButton userId={user.uid} userName={user.username} />
              </div>
            </div>

            {/* Modules preview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { ar: "حكمة", en: "Wisdom AI" },
                { ar: "سوق", en: "Marketplace" },
                { ar: "حماية", en: "Shihab" },
              ].map((m) => (
                <div
                  key={m.en}
                  className="sultan-glass rounded-xl px-3 py-4 text-center transition-transform hover:-translate-y-1"
                >
                  <p
                    className="text-base text-amber-200"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    {m.ar}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                    {m.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={signIn}
            disabled={status === "signing-in" || status === "initializing"}
            className="sultan-gold-btn group relative inline-flex items-center justify-center gap-3 rounded-full px-10 py-4 text-sm tracking-wide disabled:opacity-60"
          >
            <span className="relative z-10">{statusLabel}</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 5l5 5-5 5V5z" />
            </svg>
          </button>
        )}

        {error && (
          <p className="sultan-glass max-w-sm rounded-xl border-red-300/40 px-4 py-3 text-center text-xs text-red-200">
            {error}
          </p>
        )}

        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
          كُن فيكون · Kun Fayakun
        </p>
      </div>
    </main>
  );
}
