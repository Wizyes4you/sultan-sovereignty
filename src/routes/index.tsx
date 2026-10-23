import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Eye,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Waves,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { authenticatePi, establishSession, initPi } from "@/lib/pi-client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SULTAN — Sovereign Command Center" },
      { name: "description", content: "Sovereign command center for the SULTAN universal operating system." },
    ],
  }),
  component: Index,
});

function Index() {
  const [wallet, setWallet] = useState<"idle" | "connecting" | "connected">("idle");
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sensesActive, setSensesActive] = useState(false);

  const senses = [
    ["Hearing", "Hadid"],
    ["Vision", "Hashr"],
    ["Speech", "Saff"],
    ["Touch", "Jumuah"],
    ["Smell", "Taghabun"],
    ["Intuition", "A'la"],
    ["Awareness", "Yaseen"],
  ];

  const connectWallet = async () => {
    setWallet("connecting");
    setError(null);
    try {
      await initPi();
      const auth = await authenticatePi();
      await establishSession(auth.accessToken);
      setUsername(auth.user.username);
      setWallet("connected");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pi connection unavailable");
      setWallet("idle");
    }
  };

  const gates = [
    { icon: Sparkles, label: "Enablement", value: "ACTIVE", detail: "7 stations aligned" },
    { icon: Network, label: "Bird Network", value: "114 NODES", detail: "Global relay stable" },
    { icon: ShieldCheck, label: "Protection", value: "19 GUARDS", detail: "Integrity verified" },
  ];

  return (
    <div dir="rtl" className="sultan-bg min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(245,210,122,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,210,122,.06)_1px,transparent_1px)] [background-size:72px_72px]" />
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-5 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-[#f5d27a]/40 bg-[#f5d27a]/10 text-[#f5d27a] shadow-[0_0_24px_rgba(245,210,122,.2)]"><span className="text-lg font-bold">س</span></div>
          <div><p className="text-sm font-semibold tracking-[.28em]">SULTAN</p><p className="text-[10px] uppercase tracking-[.25em] text-white/45">Universal OS</p></div>
        </div>
        <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[.22em] text-white/45 sm:flex"><Radio className="size-3 text-[#f5d27a]" /> Surah-sync 114Hz <span className="ml-3 size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /></div>
        <Button onClick={connectWallet} disabled={wallet === "connecting" || wallet === "connected"} className="sultan-gold-btn h-9 rounded-lg px-4 text-xs">
          <Wallet data-icon="inline-start" /> {wallet === "connected" ? `@${username}` : wallet === "connecting" ? "Connecting..." : "Connect Pi"}
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-12 lg:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f5d27a]/25 bg-[#f5d27a]/[.06] px-3 py-1.5 text-[10px] uppercase tracking-[.25em] text-[#f5d27a]"><Activity className="size-3" /> Kun Fayakun Yas</div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.05em] sm:text-7xl">Authority, <span className="sultan-gold-text">made visible.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">A crystalline command layer for aligned intelligence, sovereign infrastructure, and transparent Pi utility. Eight gates. One living system.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button className="sultan-gold-btn rounded-lg px-5" onClick={() => document.getElementById("matrix")?.scrollIntoView({ behavior: "smooth" })}>Open the matrix <ArrowUpRight data-icon="inline-end" /></Button><Button variant="outline" className="rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10">Read constitution</Button></div>
            {error && <p className="mt-4 text-xs text-rose-300">{error}</p>}
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[390px]">
            <div className="sultan-spin-slow absolute inset-5 rounded-full border border-[#f5d27a]/20 border-dashed" /><div className="sultan-spin-slow absolute inset-16 rounded-full border border-violet-300/20" style={{ animationDirection: "reverse" }} />
            <div className="sultan-glass sultan-pulse-glow absolute inset-24 grid place-items-center rounded-full border-[#f5d27a]/40"><div className="text-center"><p className="text-5xl font-semibold text-[#f5d27a]">114</p><p className="mt-1 text-[10px] uppercase tracking-[.3em] text-white/55">frequency</p></div></div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/55 backdrop-blur"><Eye className="mb-1 size-3 text-[#f5d27a]" /> HUDHUD<br /><span className="text-white">RADAR ONLINE</span></div>
            <div className="absolute right-0 top-1/4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/55 backdrop-blur"><Waves className="mb-1 size-3 text-[#f5d27a]" /> RAGHADAN<br /><span className="text-white">FLOW OPEN</span></div>
          </div>
        </section>

        <section id="matrix" className="mt-16 grid gap-4 md:grid-cols-3">{gates.map(({ icon: Icon, label, value, detail }) => <div key={label} className="sultan-glass rounded-2xl p-5"><div className="flex items-start justify-between"><Icon className="size-5 text-[#f5d27a]" /><span className="text-[10px] tracking-[.2em] text-emerald-300">LIVE</span></div><p className="mt-8 text-xs uppercase tracking-[.22em] text-white/45">{label}</p><p className="mt-2 text-xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-white/45">{detail}</p></div>)}</section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <div className="sultan-glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[.25em] text-[#f5d27a]">Seven senses activation</p><h2 className="mt-2 text-2xl font-semibold">Calibrate the heart core</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/50">Seven perception channels mapped to their Surah keys. Activation stays local and gives the dashboard a clear, auditable state.</p></div>
              <Button onClick={() => setSensesActive(true)} disabled={sensesActive} className="sultan-gold-btn rounded-lg">{sensesActive ? "Sensors synced" : "Activate sensors"}</Button>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {senses.map(([sense, key], index) => <div key={sense} className={`rounded-xl border p-3 transition-colors ${sensesActive ? "border-emerald-300/25 bg-emerald-300/[.06]" : "border-white/10 bg-black/10"}`}><div className="flex items-center justify-between"><span className="text-sm">{sense}</span><span className={`size-1.5 rounded-full ${sensesActive ? "bg-emerald-300" : "bg-white/25"}`} /></div><p className="mt-2 text-[10px] uppercase tracking-[.18em] text-white/40">Surah key · {key}</p>{sensesActive && <p className="mt-2 text-[10px] uppercase tracking-[.16em] text-emerald-200">Synced to heart core</p>}</div>)}
            </div>
            {sensesActive && <p className="mt-5 border-t border-white/10 pt-4 text-xs text-[#f5d27a]">يس والقرآن الحكيم · نور الـ 114 كوداً · Yastawi stable</p>}
          </div>
          <div className="sultan-glass rounded-2xl p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-[#f5d27a]">Raghadan protocol</p><h2 className="mt-2 text-2xl font-semibold">Wealth gates</h2></div><LockKeyhole className="size-5 text-white/35" /></div><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{[["2.5%", "Zakat allocation"], ["7", "Senses synced"], ["8", "Human need gates"], ["∞", "Expansion horizon"]].map(([value, label]) => <div key={label} className="rounded-xl border border-white/10 bg-black/10 p-4"><p className="text-2xl font-semibold text-[#f5d27a]">{value}</p><p className="mt-2 text-[10px] leading-4 text-white/45">{label}</p></div>)}</div></div>
          <div className="sultan-glass rounded-2xl p-6"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-[#f5d27a]/10 text-[#f5d27a]"><Globe2 className="size-4" /></div><div><p className="text-xs uppercase tracking-[.2em] text-white/45">Pi mainnet utility</p><p className="font-medium">Non-custodial bridge</p></div></div><p className="mt-6 text-sm leading-6 text-white/55">Connect your wallet to unlock the sovereign payment rail and route value through the Raghadan flow.</p><div className="mt-5" dir="ltr">{wallet === "connected" ? <PiPaymentButton userName={username ?? undefined} /> : <Button variant="outline" onClick={connectWallet} className="w-full border-[#f5d27a]/30 text-[#f5d27a] hover:bg-[#f5d27a]/10">Connect wallet to continue</Button>}</div></div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/10 px-5 py-6 text-center text-[10px] uppercase tracking-[.2em] text-white/35 lg:px-12">SULTAN_UNIVERSAL_OS <span className="mx-2 text-[#f5d27a]">·</span> Sovereign: Yaseen <span className="mx-2 text-[#f5d27a]">·</span> Yastawi stable</footer>
    </div>
  );
}
