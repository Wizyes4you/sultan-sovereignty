import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Github,
  LockKeyhole,
  Moon,
  Network,
  ShieldCheck,
  Sun,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sultan DApp — Sovereign Utility on Pi Network" },
      {
        name: "description",
        content:
          "Sultan DApp is a non-custodial Pi Network utility based on Quranic reference and community reconstruction workflows.",
      },
      { property: "og:title", content: "Sultan DApp — Sovereign Utility on Pi Network" },
      {
        property: "og:description",
        content:
          "Non-custodial Pi Network authentication, transparent allocation, and community reconstruction utilities.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";
type Theme = "light" | "dark";

export default function Index() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("sultan-theme");
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const connectWallet = async () => {
    setConnectionStatus("connecting");
    setError(null);
    try {
      if (typeof window !== "undefined" && window.Pi) {
        const auth = await window.Pi.authenticate(
          ["username", "payments"],
          (payment: unknown) => {
            console.log("Incomplete payment found:", payment);
          }
        );
        setUser({ username: auth.user.username });
        setConnectionStatus("connected");
      } else {
        throw new Error("يرجى فتح التطبيق داخل متصفح Pi Browser");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setConnectionStatus("error");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("sultan-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const isConnecting = connectionStatus === "connecting";
  const isConnected = connectionStatus === "connected";

  return (
    <main className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex min-h-16 w-full items-center gap-2 px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Sultan DApp home">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-500 text-sm font-bold text-slate-950">
              S
            </span>
            <span className="truncate text-sm font-semibold sm:text-base">Sultan DApp</span>
          </Link>

          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 min-[540px]:inline-flex">
            <Check className="size-3" aria-hidden="true" />
            Pi OS Compliant
          </span>

          <div className="ms-auto flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <Button
              size="sm"
              onClick={connectWallet}
              disabled={isConnecting || isConnected}
              className="min-w-28 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold sm:min-w-40"
            >
              {isConnecting ? <Activity className="animate-spin" /> : isConnected ? <Check /> : <Wallet />}
              <span className="hidden sm:inline">
                {isConnected ? "Wallet Connected" : isConnecting ? "Connecting…" : "Connect Pi Wallet"}
              </span>
              <span className="sm:hidden">
                {isConnected ? "Connected" : isConnecting ? "Connecting" : "Connect Wallet"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 border-b border-border">
        <div className="grid w-full lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="flex min-h-[420px] flex-col justify-center px-5 py-14 sm:px-10 lg:min-h-[560px] lg:px-16 xl:px-24">
            <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase text-amber-500">
              <span className="size-2 rounded-full bg-emerald-500" />
              Pai Network Yass • Kun Faya Kun Yass
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl text-amber-400">
              Sultan DApp
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Ethical Utility &amp; Community Reconstruction Ecosystem
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Non-custodial Pi Network utility linked with Quranic reference (114 Surahs), transparent 2.5% Zakat allocation, and sovereign node architecture.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={connectWallet}
                disabled={isConnecting || isConnected}
                className="min-h-12 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold sm:w-auto sm:min-w-56"
              >
                {isConnecting ? <Activity className="animate-spin" /> : isConnected ? <Check /> : <Wallet />}
                {isConnected ? "Wallet Connected" : isConnecting ? "Authenticating…" : "Authenticate & Connect"}
              </Button>
              {user && (
                <span className="text-sm text-muted-foreground">
                  Connected as <strong className="font-semibold text-foreground">@{user.username}</strong>
                </span>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-5 max-w-xl border-s-2 border-destructive ps-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <aside className="border-t border-border bg-surface-subtle px-5 py-10 sm:px-10 lg:border-s lg:border-t-0 lg:px-10 lg:py-16">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Network Console</p>
                    <h2 className="mt-1 text-xl font-semibold">Pi Mainnet</h2>
                  </div>
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                </div>
                <dl className="divide-y divide-border">
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Node Status</dt>
                    <dd className="font-medium text-emerald-400">Active</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Wallet Model</dt>
                    <dd className="flex items-center gap-2 font-medium"><LockKeyhole className="size-4 text-emerald-400" />Non-custodial</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Mathematical Base</dt>
                    <dd className="font-mono text-xs text-amber-400">3.14 (π) & Great Pyramid</dd>
                  </div>
                </dl>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
                <ShieldCheck className="size-5 text-emerald-400" />
                Wallet credentials remain under strict user control.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Metrics Section */}
      <section aria-labelledby="metrics-heading" className="w-full border-b border-border bg-surface-subtle">
        <div className="px-5 py-9 sm:px-10 lg:px-16 xl:px-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="metrics-heading" className="text-xl font-semibold">Live System Metrics</h2>
            <span className="text-xs text-emerald-400">Kun Faya Kun Yass Active</span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDollarSign className="size-4 text-amber-400" />Automated Zakat Allocation</div>
              <p className="mt-5 text-3xl font-semibold tabular-nums text-amber-400">2.5%</p>
              <p className="mt-2 text-xs text-muted-foreground">Applied to eligible utility flows</p>
            </article>
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Network className="size-4 text-emerald-400" />Quranic Frequency Integration</div>
              <p className="mt-5 text-3xl font-semibold text-emerald-400">114</p>
              <p className="mt-2 text-xs text-muted-foreground">Surahs frequency architecture</p>
            </article>
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-emerald-400" />Security Layer</div>
              <p className="mt-5 text-xl font-semibold text-emerald-400">Non-Custodial</p>
              <p className="mt-2 text-xs text-muted-foreground">Sovereign Asset & Real-Time Sync</p>
            </article>
          </div>
        </div>
      </section>

      {/* Core Utilities */}
      <section aria-labelledby="utilities-heading" className="w-full border-b border-border">
        <div className="px-5 py-12 sm:px-10 lg:px-16 lg:py-16 xl:px-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase text-amber-500">Financial Hub</p>
            <h2 id="utilities-heading" className="mt-2 text-2xl font-semibold">Core Utilities</h2>
          </div>
          <div className="grid border-y border-border md:grid-cols-3 md:divide-x rtl:md:divide-x-reverse">
            {[
              { icon: CircleDollarSign, title: "Zakat Engine", text: "Calculates and records the 2.5% allocation for ethical reconstruction workflows." },
              { icon: ShieldCheck, title: "Sovereign Security", text: "Non-custodial operation. No wallet passphrase or private key is stored." },
              { icon: Network, title: "Community Reconstruction", text: "Verified Pi payment workflows with public transparent data." },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`min-h-56 py-7 md:px-7 ${index > 0 ? "border-t border-border md:border-t-0" : ""}`}>
                <Icon className="size-6 text-amber-400" />
                <h3 className="mt-10 text-lg font-semibold">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-border">
        <div className="flex w-full flex-col gap-5 px-5 py-8 text-xs text-muted-foreground sm:px-10 md:flex-row md:items-center lg:px-16 xl:px-24">
          <p>© 2026 Sultan DApp · Developer: Yassinservice</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 md:ms-auto" aria-label="Footer navigation">
            <a href="https://github.com/Wizyes4you/sultan-sovereignty" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <Github className="size-3.5" /> GitHub <ArrowUpRight className="size-3" />
            </a>
            <a href="https://github.com/pi-apps/pi-platform-docs/blob/master/LICENSE" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              PiOS License <ArrowUpRight className="size-3" />
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
        }
        
