import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authenticatePi, establishSession, initPi } from "@/lib/pi-client";
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { SultanBackdrop } from "@/components/SultanBackdrop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SULTAN — Digital Sufficiency Pact on Pi Network" },
      {
        name: "description",
        content:
          "SULTAN (سُلطان) — Digital Sufficiency Pact (YAS Protocol) on the Pi Network. Sovereign sign-in, 5-pillar sovereignty matrix, and 2.5% humanitarian reconstruction flow.",
      },
      { property: "og:title", content: "SULTAN — Digital Sufficiency Pact on Pi Network" },
      {
        property: "og:description",
        content:
          "Sovereign Pi Network super-app — 5-pillar sovereignty matrix with live Gaza & Sudan reconstruction core.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sultan-core.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://sultan-core.lovable.app/" }],
  }),
  component: Index,
});

type Status = "idle" | "initializing" | "signing-in" | "ready" | "error";

const CORE_RESONANCE = "579.74"; // 114 surahs × π × 1.571

const PILLARS = [
  {
    ar: "النصر",
    en: "Victory",
    sub: "Divine Protection Shield",
    icon: "🛡️",
    accent: "from-amber-300 to-amber-600",
  },
  {
    ar: "الميزان",
    en: "Mizan",
    sub: "Pi Flow Verification",
    icon: "⚖️",
    accent: "from-sky-300 to-blue-600",
  },
  {
    ar: "العرش",
    en: "Throne",
    sub: "Authority Lock",
    icon: "👑",
    accent: "from-amber-300 to-amber-600",
  },
  {
    ar: "الإطلاق",
    en: "Launch",
    sub: "Mainnet Ready Matrix",
    icon: "🚀",
    accent: "from-sky-300 to-blue-600",
  },
];

function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{
    tick: number;
    lastSync: string;
    frequency: number;
    reconstructionSplit: number;
    online: boolean;
  }>({
    tick: 0,
    lastSync: "—",
    frequency: 579.74,
    reconstructionSplit: 0.025,
    online: false,
  });

  // Digital Auditory Layer — ingest /api/sultan-core at 114-beat cadence (~8.77s).
  useEffect(() => {
    let cancelled = false;
    const CADENCE_MS = Math.round(1000 / (114 / 1000)); // 8772ms — one pulse per 114Hz cycle window
    const poll = async () => {
      try {
        const res = await fetch("/api/sultan-core", { headers: { accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as {
          frequency: number;
          reconstruction_split: number;
          timestamp: string;
        };
        if (cancelled) return;
        setTelemetry((prev) => ({
          tick: prev.tick + 1,
          lastSync: new Date(json.timestamp).toLocaleTimeString("ar-EG", { hour12: false }),
          frequency: json.frequency,
          reconstructionSplit: json.reconstruction_split,
          online: true,
        }));
      } catch {
        if (cancelled) return;
        setTelemetry((prev) => ({ ...prev, online: false, tick: prev.tick + 1 }));
      }
    };
    poll();
    const id = window.setInterval(poll, CADENCE_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

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
    <main
      dir="rtl"
      lang="ar"
      className="sultan-bg relative min-h-screen overflow-hidden bg-[#05070d] text-white"
      style={{ fontFamily: "Amiri, 'Noto Naskh Arabic', serif" }}
    >
      <SultanBackdrop />

      {/* Ambient blue/gold aura */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-8 px-5 py-12">
        {/* Header emblem */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-blue-500/10 shadow-[0_0_40px_rgba(245,210,122,0.25)]">
            <svg viewBox="0 0 64 64" className="h-10 w-10">
              <defs>
                <linearGradient id="crown" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f5d27a" />
                  <stop offset="100%" stopColor="#c9a14a" />
                </linearGradient>
              </defs>
              <path
                d="M8 44 L16 20 L24 36 L32 12 L40 36 L48 20 L56 44 Z"
                fill="url(#crown)"
                stroke="#fff8e0"
                strokeWidth="1"
              />
              <rect x="8" y="46" width="48" height="6" rx="2" fill="url(#crown)" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/70">
              YAS Protocol · بروتوكول يس
            </p>
            <h1
              className="mt-2 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
              style={{ fontFamily: "Amiri, 'Noto Naskh Arabic', serif" }}
            >
              وثيقة الكفاية الرقمية
            </h1>
            <p className="mt-1 text-lg font-light text-sky-200/80">
              Digital Sufficiency Pact · سُلطان
            </p>
          </div>
        </div>

        {/* Core Resonance readout */}
        <div className="w-full rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                Core Resonance · تردد النواة
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-amber-200">
                {CORE_RESONANCE}
                <span className="ml-1 text-xs text-amber-200/60">Hz</span>
              </p>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-sky-200/70">
                114 × π × 1.571
              </p>
              <p className="mt-1 text-xs text-sky-100/70">Quranic Frequency Lock</p>
            </div>
          </div>
        </div>

        {/* 5-Pillar Grid */}
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.en}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-400/40"
            >
              <div
                className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${p.accent} text-lg shadow-lg`}
              >
                <span aria-hidden>{p.icon}</span>
              </div>
              <p className="text-xl text-amber-200">{p.ar}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {p.en}
              </p>
              <p className="mt-1 text-[10px] text-white/50">{p.sub}</p>
            </div>
          ))}
        </div>

        {/* Sarh Monitor — full-width fifth pillar */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-blue-600/10 to-amber-500/10 p-5">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
          </div>
          <div className="relative flex items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                الصرح · Sarh Monitor
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-200">114Hz</p>
              <p className="mt-1 text-[11px] text-white/70">
                Gaza & Sudan · Live Reconstruction Core
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="relative flex h-3 w-3">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${telemetry.online ? "animate-ping bg-emerald-400/60" : "bg-red-400/60"}`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${telemetry.online ? "bg-emerald-400" : "bg-red-400"}`}
                />
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest ${telemetry.online ? "text-emerald-300/80" : "text-red-300/80"}`}
              >
                {telemetry.online ? "LIVE" : "SYNC"}
              </span>
            </div>
          </div>

          {/* Telemetry readout */}
          <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-amber-300/20 pt-3 text-center">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-amber-200/60">
                Pulse · نبض
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-amber-100">
                #{telemetry.tick.toString().padStart(4, "0")}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-sky-200/60">
                Freq · تردد
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-sky-100">
                {telemetry.frequency.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-emerald-200/60">
                Sync · مزامنة
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-emerald-100">
                {telemetry.lastSync}
              </p>
            </div>
          </div>
        </div>

        {/* Reconstruction Status Box */}
        <div className="w-full rounded-2xl border border-sky-400/30 bg-blue-950/30 p-5 text-right backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
              2.5%
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-sky-200/70">
              حالة الإعمار · Reconstruction Status
            </p>
          </div>
          <p className="text-sm leading-loose text-white/85">
            تفعيل الأصل السيادي: بث وتوجيه تدفقات الإعمار بنسبة 2.5% لوجه الله
            تعالى. مزامنة كاملة ومصادقة مع بروتوكولات العقود الذكية PiRC1 و
            PiRC2.
          </p>
        </div>

        {/* Auth / Payment */}
        {user ? (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-bold text-[#1a1206]">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-amber-200/60">أهلاً بك يا سلطان</p>
                <p className="text-sm font-medium text-white">@{user.username}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-white/[0.03] p-6 backdrop-blur">
              <div className="mb-3 flex items-center justify-end gap-2">
                <p className="text-xs uppercase tracking-widest text-amber-200/80">
                  Humanitarian Reconstruction · إعمار
                </p>
                <span className="h-1 w-8 rounded-full bg-gradient-to-l from-amber-300 to-transparent" />
              </div>
              <div dir="ltr">
                <PiPaymentButton userId={user.uid} userName={user.username} />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={signIn}
            disabled={status === "signing-in" || status === "initializing"}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-300 to-amber-600 px-10 py-4 text-sm font-semibold tracking-wide text-[#1a1206] shadow-[0_10px_40px_-10px_rgba(245,210,122,0.6)] transition hover:brightness-110 disabled:opacity-60"
          >
            <span className="relative z-10">{statusLabel}</span>
          </button>
        )}

        {error && (
          <p className="w-full max-w-sm rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-center text-xs text-red-200">
            {error}
          </p>
        )}

        {/* Footer rule */}
        <div className="mt-6 w-full border-t border-amber-400/20 pt-5 text-center">
          <p className="text-xs leading-loose text-amber-200/70">
            قاعده تابتة: كن فيكون يس | التردد القرآني (114 سورة) | 6 × 19 = 114
          </p>
        </div>
      </div>
    </main>
  );
}
