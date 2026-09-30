import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Calculator,
  Github,
  Languages,
  LoaderCircle,
  Moon,
  ShieldCheck,
  Sun,
  Wallet,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { authenticatePi, establishSession, initPi } from "@/lib/pi-client";
import { COPY, LANGS, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sultan DApp — Pi Network Zakat & Transfer Interface" },
      {
        name: "description",
        content:
          "Non-custodial Pi Network DApp for Pi wallet authentication, payments with a 2.5% zakat allocation, and transparent transfer reporting.",
      },
      { property: "og:title", content: "Sultan DApp — Pi Network Zakat & Transfer Interface" },
      {
        property: "og:description",
        content:
          "Non-custodial Pi Network DApp for Pi wallet authentication, payments with a 2.5% zakat allocation, and transparent transfer reporting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type WalletState = "idle" | "connecting" | "connected" | "error";

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sultan-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("sultan-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { dark, toggle };
}

function Index() {
  const { dark, toggle } = useTheme();
  const [lang, setLang] = useState<Lang>("en");
  const [wallet, setWallet] = useState<WalletState>("idle");
  const [username, setUsername] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [nodesOnline, setNodesOnline] = useState<number | null>(null);

  const t = COPY[lang];
  const dir = LANGS.find((l) => l.code === lang)?.dir ?? "ltr";

  useEffect(() => {
    const stored = localStorage.getItem("sultan-lang") as Lang | null;
    if (stored && LANGS.some((l) => l.code === stored)) setLang(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch("/api/sultan-core");
        if (!cancelled) setNodesOnline(res.ok ? 1 : 0);
      } catch {
        if (!cancelled) setNodesOnline(0);
      }
    };
    void check();
    const id = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const changeLang = (next: Lang) => {
    setLang(next);
    localStorage.setItem("sultan-lang", next);
  };

  const connectWallet = async () => {
    setWallet("connecting");
    setWalletError(null);
    try {
      await initPi();
      const auth = await authenticatePi();
      await establishSession(auth.accessToken);
      setUsername(auth.user.username);
      setWallet("connected");
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : String(err));
      setWallet("error");
    }
  };

  const modules = [
    { icon: Calculator, title: t.zakatTitle, body: t.zakatBody },
    { icon: ShieldCheck, title: t.securityTitle, body: t.securityBody },
    { icon: Wrench, title: t.utilitiesTitle, body: t.utilitiesBody },
  ];

  return (
    <div dir={dir} className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 w-full border-b border-border bg-background/90 backdrop-blur">
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">{t.brand}</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {t.compliant}
            </span>
          </div>

          <div className="ms-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="lang">
              {t.language}
            </label>
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5">
              <Languages size={14} className="text-muted-foreground" />
              <select
                id="lang"
                value={lang}
                onChange={(e) => changeLang(e.target.value as Lang)}
                className="bg-transparent text-xs font-medium outline-none"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              aria-label={t.theme}
              className="h-9 w-9"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            <Button
              onClick={connectWallet}
              disabled={wallet === "connecting" || wallet === "connected"}
              className="h-9 gap-2"
            >
              {wallet === "connecting" ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Wallet size={16} />
              )}
              <span className="text-xs font-semibold">
                {wallet === "connected"
                  ? `${t.connected}${username ? ` · @${username}` : ""}`
                  : wallet === "connecting"
                    ? t.connecting
                    : t.connect}
              </span>
            </Button>
          </div>
        </div>
        {walletError && (
          <p className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive sm:px-6">
            {walletError}
          </p>
        )}
      </header>

      <main className="w-full flex-1">
        <section className="w-full border-b border-border px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight sm:text-4xl">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.heroBody}
          </p>
        </section>

        <section className="grid w-full grid-cols-1 border-b border-border sm:grid-cols-3">
          <div className="border-b border-border px-4 py-6 sm:border-b-0 sm:border-e sm:px-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.metricPoolLabel}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">2.5%</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.metricPoolSub}</p>
          </div>
          <div className="border-b border-border px-4 py-6 sm:border-b-0 sm:border-e sm:px-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.metricFlowLabel}
            </p>
            <p className="mt-2 flex items-center gap-2 text-3xl font-semibold">
              <Activity
                size={20}
                className={nodesOnline ? "text-success" : "text-muted-foreground"}
              />
              <span className="text-xl">
                {nodesOnline ? t.metricFlowActive : t.metricFlowIdle}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Pi Mainnet</p>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.metricNodesLabel}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{nodesOnline ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.metricNodesSub}</p>
          </div>
        </section>

        <section className="w-full px-4 py-10 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t.modulesTitle}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {modules.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-background p-5">
                <Icon size={18} className="text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full border-t border-border px-4 py-10 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t.paymentTitle}
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">{t.paymentBody}</p>
          <div className="mt-5 max-w-xl" dir="ltr">
            {wallet === "connected" ? (
              <PiPaymentButton userName={username ?? undefined} />
            ) : (
              <div className="border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
                {t.walletRequired}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span>{t.license}</span>
          <a
            href="https://github.com/Wizyes4you/Sultan-Core"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Github size={13} /> {t.repo}
          </a>
          <Link to="/privacy" className="hover:text-foreground">
            {t.privacy}
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            {t.terms}
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            {t.contact}
          </Link>
          <span className="ms-auto">{t.developer}</span>
        </div>
      </footer>
    </div>
  );
}
