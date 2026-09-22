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
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { Button } from "@/components/ui/button";
import { authenticatePi, establishSession } from "@/lib/pi-client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sultan DApp — Ethical Utility on Pi Network" },
      {
        name: "description",
        content:
          "Sultan DApp is a non-custodial Pi Network utility for transparent allocation and community reconstruction workflows.",
      },
      { property: "og:title", content: "Sultan DApp — Ethical Utility on Pi Network" },
      {
        property: "og:description",
        content:
          "Non-custodial Pi Network authentication, transparent allocation, and community reconstruction utilities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://sultan-core.lovable.app/" }],
  }),
  component: Index,
});

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";
type Theme = "light" | "dark";

const STATUS_REFRESH_MS = 10_000;

function Index() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [networkOnline, setNetworkOnline] = useState(false);
  const [lastSync, setLastSync] = useState("Awaiting sync");

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

  useEffect(() => {
    let cancelled = false;

    const readStatus = async () => {
      try {
        const response = await fetch("/api/sultan-core", {
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as { timestamp: string };
        if (!cancelled) {
          setNetworkOnline(true);
          setLastSync(
            new Date(data.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      } catch {
        if (!cancelled) {
          setNetworkOnline(false);
          setLastSync("Connection unavailable");
        }
      }
    };

    void readStatus();
    const interval = window.setInterval(readStatus, STATUS_REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const connectWallet = async () => {
    setConnectionStatus("connecting");
    setError(null);
    try {
      const auth = await authenticatePi();
      const session = await establishSession(auth.accessToken);
      setUser(session);
      setConnectionStatus("connected");
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
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex min-h-16 w-full items-center gap-2 px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Sultan DApp home">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              S
            </span>
            <span className="truncate text-sm font-semibold sm:text-base">Sultan DApp</span>
          </Link>

          <span className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success min-[540px]:inline-flex">
            <Check className="size-3" aria-hidden="true" />
            Pi OS Compliant
          </span>

          <div className="ms-auto flex shrink-0 items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
              title={theme === "dark" ? "Use light theme" : "Use dark theme"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <Button
              size="sm"
              onClick={connectWallet}
              disabled={isConnecting || isConnected}
              className="min-w-28 sm:min-w-40"
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

      <section className="flex flex-1 border-b border-border">
        <div className="grid w-full lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="flex min-h-[420px] flex-col justify-center px-5 py-14 sm:px-10 lg:min-h-[560px] lg:px-16 xl:px-24">
            <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase text-primary">
              <span className={`size-2 rounded-full ${networkOnline ? "bg-success" : "bg-muted-foreground"}`} />
              Pi Network Utility
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Sultan DApp
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Ethical Utility &amp; Community Reconstruction Ecosystem
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Secure Pi Network access for transparent allocation, verified transactions, and community-focused financial tools.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={connectWallet}
                disabled={isConnecting || isConnected}
                className="min-h-12 w-full sm:w-auto sm:min-w-56"
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
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Network console</p>
                    <h2 className="mt-1 text-xl font-semibold">Pi Mainnet</h2>
                  </div>
                  <span className={`size-2.5 rounded-full ${networkOnline ? "bg-success" : "bg-destructive"}`} />
                </div>
                <dl className="divide-y divide-border">
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Node status</dt>
                    <dd className="font-medium">{networkOnline ? "Active" : "Unavailable"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Wallet model</dt>
                    <dd className="flex items-center gap-2 font-medium"><LockKeyhole className="size-4 text-success" />Non-custodial</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-5 text-sm">
                    <dt className="text-muted-foreground">Last sync</dt>
                    <dd className="font-mono text-xs">{lastSync}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
                <ShieldCheck className="size-5 text-success" />
                Wallet credentials remain under user control.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="metrics-heading" className="w-full border-b border-border bg-surface-subtle">
        <div className="px-5 py-9 sm:px-10 lg:px-16 xl:px-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="metrics-heading" className="text-xl font-semibold">Live system metrics</h2>
            <span className="text-xs text-muted-foreground">Updated {lastSync}</span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDollarSign className="size-4" />Automated Zakat Allocation</div>
              <p className="mt-5 text-3xl font-semibold tabular-nums">2.5%</p>
              <p className="mt-2 text-xs text-muted-foreground">Applied to eligible utility flows</p>
            </article>
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Network className="size-4" />System Status</div>
              <p className="mt-5 text-xl font-semibold">Active Node Network</p>
              <p className="mt-2 text-xs text-muted-foreground">{networkOnline ? "Operational endpoint" : "Endpoint reconnecting"}</p>
            </article>
            <article className="bg-background p-6 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4" />Security</div>
              <p className="mt-5 text-xl font-semibold">Non-Custodial</p>
              <p className="mt-2 text-xs text-muted-foreground">Local Persistence</p>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="utilities-heading" className="w-full border-b border-border">
        <div className="px-5 py-12 sm:px-10 lg:px-16 lg:py-16 xl:px-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase text-primary">Financial hub</p>
            <h2 id="utilities-heading" className="mt-2 text-2xl font-semibold">Core utilities</h2>
          </div>
          <div className="grid border-y border-border md:grid-cols-3 md:divide-x rtl:md:divide-x-reverse">
            {[
              { icon: CircleDollarSign, title: "Zakat Engine", text: "Calculates and records the 2.5% allocation for eligible transactions." },
              { icon: ShieldCheck, title: "Sovereign Security", text: "Non-custodial operation. No wallet passphrase or private key is requested or stored." },
              { icon: Network, title: "Community Utilities", text: "Verified Pi payment workflows with transparent public allocation data." },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`min-h-56 py-7 md:px-7 ${index > 0 ? "border-t border-border md:border-t-0" : ""}`}>
                <Icon className="size-6 text-primary" />
                <h3 className="mt-10 text-lg font-semibold">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {user && (
        <section aria-labelledby="payment-heading" className="w-full border-b border-border bg-surface-subtle">
          <div className="grid gap-8 px-5 py-12 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16 xl:px-24">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Pi payment</p>
              <h2 id="payment-heading" className="mt-2 text-2xl font-semibold">Transaction console</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Review the allocation and network fee before confirming the transaction in Pi Wallet.
              </p>
            </div>
            <PiPaymentButton userId={user.uid} userName={user.username} />
          </div>
        </section>
      )}

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
            <Link to="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}