import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  LockKeyhole,
  Moon,
  Network,
  ShieldCheck,
  Sun,
  Wallet,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PiPaymentButton } from "@/components/PiPaymentButton";
import { Button } from "@/components/ui/button";
import { authenticatePi, establishSession } from "@/lib/pi-client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sultan DApp — Pi Network Financial Utilities" },
      {
        name: "description",
        content:
          "Sultan DApp provides non-custodial Pi Network authentication, transparent allocation metrics, and community financial utilities.",
      },
      { property: "og:title", content: "Sultan DApp — Pi Network Financial Utilities" },
      {
        property: "og:description",
        content:
          "Connect with Pi Network to access transparent allocation metrics and community financial utilities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://sultan-core.lovable.app/" }],
  }),
  component: Index,
});

type Status = "idle" | "connecting" | "ready" | "error";
type Language = "ar" | "en" | "fr" | "es";
type Theme = "light" | "dark";

const COPY = {
  en: {
    connect: "Connect Pi Wallet",
    connecting: "Connecting…",
    connected: "Wallet connected",
    eyebrow: "Pi Network financial infrastructure",
    title: "Sultan DApp",
    intro:
      "A non-custodial financial utility for transparent community allocation and verified Pi transactions.",
    overview: "Network overview",
    updated: "Live endpoint",
    zakatPool: "Zakat allocation",
    reconstruction: "Community reconstruction",
    activeNodes: "Active nodes",
    online: "Operational",
    offline: "Unavailable",
    modules: "Core modules",
    modulesIntro: "Purpose-built utilities with a clear security boundary.",
    zakat: "Zakat Engine",
    zakatText: "Calculates and records the 2.5% allocation within each eligible transaction.",
    security: "Sovereign Security",
    securityText: "Non-custodial. No wallet passphrase or private key is requested or stored.",
    utilities: "Community Utilities",
    utilitiesText: "Verified payment workflows and transparent public allocation data.",
    payment: "Transaction console",
    paymentText: "Review the allocation and network fee before confirming in Pi Wallet.",
    connectedAs: "Connected as",
    selectLanguage: "Select language",
    theme: "Toggle color theme",
  },
  ar: {
    connect: "ربط محفظة Pi",
    connecting: "جارٍ الاتصال…",
    connected: "المحفظة متصلة",
    eyebrow: "بنية مالية لشبكة Pi",
    title: "تطبيق سلطان",
    intro: "أداة مالية غير احتجازية لتخصيص مجتمعي شفاف ومعاملات Pi موثّقة.",
    overview: "نظرة عامة على الشبكة",
    updated: "نقطة اتصال مباشرة",
    zakatPool: "تخصيص الزكاة",
    reconstruction: "إعمار المجتمع",
    activeNodes: "العُقد النشطة",
    online: "يعمل",
    offline: "غير متاح",
    modules: "الوحدات الأساسية",
    modulesIntro: "أدوات متخصصة ضمن حدود أمنية واضحة.",
    zakat: "محرك الزكاة",
    zakatText: "يحسب ويسجل تخصيص 2.5% داخل كل معاملة مؤهلة.",
    security: "الأمن السيادي",
    securityText: "غير احتجازي. لا يطلب أو يخزن عبارة مرور المحفظة أو المفتاح الخاص.",
    utilities: "خدمات المجتمع",
    utilitiesText: "مسارات دفع موثّقة وبيانات تخصيص عامة وشفافة.",
    payment: "وحدة المعاملات",
    paymentText: "راجع التخصيص ورسوم الشبكة قبل التأكيد في محفظة Pi.",
    connectedAs: "متصل باسم",
    selectLanguage: "اختيار اللغة",
    theme: "تبديل نمط الألوان",
  },
  fr: {
    connect: "Connecter le portefeuille Pi",
    connecting: "Connexion…",
    connected: "Portefeuille connecté",
    eyebrow: "Infrastructure financière Pi Network",
    title: "Sultan DApp",
    intro: "Un outil financier non dépositaire pour des allocations communautaires transparentes et des transactions Pi vérifiées.",
    overview: "Vue du réseau",
    updated: "Point d’accès actif",
    zakatPool: "Allocation Zakat",
    reconstruction: "Reconstruction communautaire",
    activeNodes: "Nœuds actifs",
    online: "Opérationnel",
    offline: "Indisponible",
    modules: "Modules principaux",
    modulesIntro: "Des outils spécialisés avec une limite de sécurité claire.",
    zakat: "Moteur Zakat",
    zakatText: "Calcule et enregistre l’allocation de 2,5 % pour chaque transaction éligible.",
    security: "Sécurité souveraine",
    securityText: "Non dépositaire. Aucune phrase secrète ni clé privée n’est demandée ou stockée.",
    utilities: "Services communautaires",
    utilitiesText: "Paiements vérifiés et données publiques d’allocation transparentes.",
    payment: "Console de transaction",
    paymentText: "Vérifiez l’allocation et les frais réseau avant de confirmer dans Pi Wallet.",
    connectedAs: "Connecté en tant que",
    selectLanguage: "Choisir la langue",
    theme: "Changer le thème",
  },
  es: {
    connect: "Conectar billetera Pi",
    connecting: "Conectando…",
    connected: "Billetera conectada",
    eyebrow: "Infraestructura financiera de Pi Network",
    title: "Sultan DApp",
    intro: "Una utilidad financiera sin custodia para asignaciones comunitarias transparentes y transacciones Pi verificadas.",
    overview: "Resumen de la red",
    updated: "Punto de acceso activo",
    zakatPool: "Asignación Zakat",
    reconstruction: "Reconstrucción comunitaria",
    activeNodes: "Nodos activos",
    online: "Operativo",
    offline: "No disponible",
    modules: "Módulos principales",
    modulesIntro: "Utilidades especializadas con un límite de seguridad claro.",
    zakat: "Motor Zakat",
    zakatText: "Calcula y registra la asignación del 2,5 % en cada transacción elegible.",
    security: "Seguridad soberana",
    securityText: "Sin custodia. No se solicita ni almacena la frase de acceso o clave privada.",
    utilities: "Servicios comunitarios",
    utilitiesText: "Pagos verificados y datos públicos de asignación transparentes.",
    payment: "Consola de transacción",
    paymentText: "Revisa la asignación y la tarifa de red antes de confirmar en Pi Wallet.",
    connectedAs: "Conectado como",
    selectLanguage: "Elegir idioma",
    theme: "Cambiar tema",
  },
} as const;

const LANGUAGE_LABELS: Record<Language, string> = { ar: "AR", en: "EN", fr: "FR", es: "ES" };

// 114-based refresh cadence for the reconstruction telemetry stream.
const TELEMETRY_CADENCE_MS = Math.round(1_000_000 / 114);

function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [online, setOnline] = useState(false);
  const [lastSync, setLastSync] = useState("—");
  const [telemetry, setTelemetry] = useState({ tick: 0, frequency: 0, split: 0 });

  const copy = COPY[language];
  const isRtl = language === "ar";

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("sultan-language");
    if (storedLanguage && storedLanguage in COPY) setLanguage(storedLanguage as Language);
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
    const poll = async () => {
      try {
        const response = await fetch("/api/sultan-core", { headers: { accept: "application/json" } });
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as {
          timestamp: string;
          frequency: number;
          reconstruction_split: number;
        };
        if (!cancelled) {
          setOnline(true);
          setLastSync(new Date(data.timestamp).toLocaleTimeString(language, { hour: "2-digit", minute: "2-digit" }));
          setTelemetry((prev) => ({
            tick: prev.tick + 1,
            frequency: data.frequency,
            split: data.reconstruction_split,
          }));
        }
      } catch {
        if (!cancelled) setOnline(false);
      }
    };
    void poll();
    const interval = window.setInterval(poll, TELEMETRY_CADENCE_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [language]);

  const connectWallet = async () => {
    setStatus("connecting");
    setError(null);
    try {
      const auth = await authenticatePi();
      const session = await establishSession(auth.accessToken);
      setUser(session);
      setStatus("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setStatus("error");
    }
  };

  const setActiveLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem("sultan-language", next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("sultan-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const metrics = useMemo(
    () => [
      { label: copy.zakatPool, value: "2.5%", detail: "Per eligible flow", icon: CircleDollarSign },
      { label: copy.reconstruction, value: online ? copy.online : copy.offline, detail: lastSync, icon: Activity },
      { label: copy.activeNodes, value: online ? "1" : "0", detail: "Sultan Core RPC", icon: Network },
    ],
    [copy, lastSync, online],
  );

  const modules = [
    { title: copy.zakat, text: copy.zakatText, icon: CircleDollarSign, code: "ALLOCATION_2.5" },
    { title: copy.security, text: copy.securityText, icon: ShieldCheck, code: "NON_CUSTODIAL" },
    { title: copy.utilities, text: copy.utilitiesText, icon: Wrench, code: "COMMUNITY_CORE" },
  ];

  return (
    <main dir={isRtl ? "rtl" : "ltr"} lang={language} className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Sultan DApp home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-base font-bold">S</span>
            </span>
            <span className="truncate text-sm font-semibold sm:text-base">Sultan DApp</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success sm:inline-flex">
            <Check className="h-3 w-3" /> Pi OS Compliant
          </span>

          <div className="ms-auto flex items-center gap-1.5">
            <label className="relative">
              <span className="sr-only">{copy.selectLanguage}</span>
              <Globe2 className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={language}
                onChange={(event) => setActiveLanguage(event.target.value as Language)}
                className="h-9 appearance-none rounded-md border border-input bg-background ps-8 pe-7 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={copy.selectLanguage}
              >
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((key) => (
                  <option key={key} value={key}>{LANGUAGE_LABELS[key]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </label>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={copy.theme} title={copy.theme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <Button
              className="hidden sm:inline-flex"
              onClick={connectWallet}
              disabled={status === "connecting" || status === "ready"}
            >
              <Wallet />
              {status === "ready" ? copy.connected : status === "connecting" ? copy.connecting : copy.connect}
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto grid min-h-[440px] w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="min-h-12 w-full sm:w-auto"
                onClick={connectWallet}
                disabled={status === "connecting" || status === "ready"}
              >
                {status === "connecting" ? <Activity className="animate-spin" /> : status === "ready" ? <Check /> : <Wallet />}
                {status === "ready" ? copy.connected : status === "connecting" ? copy.connecting : copy.connect}
              </Button>
              {user && <span className="text-sm text-muted-foreground">{copy.connectedAs} <strong className="text-foreground">@{user.username}</strong></span>}
            </div>
            {error && <p role="alert" className="mt-4 max-w-xl border-s-2 border-destructive ps-3 text-sm text-destructive">{error}</p>}
          </div>

          <div className="relative overflow-hidden border-y border-border bg-surface-subtle px-6 py-8 sm:border sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">SULTAN CORE</p>
                <p className="mt-1 text-lg font-semibold">Mainnet interface</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${online ? "bg-success" : "bg-destructive"}`} aria-label={online ? copy.online : copy.offline} />
            </div>
            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between py-4 text-sm"><dt className="text-muted-foreground">Network</dt><dd className="font-medium">Pi Mainnet</dd></div>
              <div className="flex items-center justify-between py-4 text-sm"><dt className="text-muted-foreground">Custody</dt><dd className="flex items-center gap-2 font-medium"><LockKeyhole className="h-4 w-4 text-success" /> User-controlled</dd></div>
              <div className="flex items-center justify-between pt-4 text-sm"><dt className="text-muted-foreground">API status</dt><dd className="font-mono text-xs">{online ? "200 / ONLINE" : "SYNCING"}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-subtle">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">{copy.overview}</h2>
            <span className="text-xs text-muted-foreground">{copy.updated} · {lastSync}</span>
          </div>
          <div className="grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
            {metrics.map(({ label, value, detail, icon: Icon }) => (
              <div key={label} className="px-1 py-6 sm:px-6 sm:first:ps-0 sm:last:pe-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
                <p className="mt-4 text-3xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-9 max-w-2xl">
          <h2 className="text-2xl font-semibold">{copy.modules}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.modulesIntro}</p>
        </div>
        <div className="grid border border-border md:grid-cols-3 md:divide-x rtl:md:divide-x-reverse">
          {modules.map(({ title, text, icon: Icon, code }, index) => (
            <article key={title} className={`min-h-64 p-6 sm:p-8 ${index > 0 ? "border-t border-border md:border-t-0" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <span className="font-mono text-[10px] text-muted-foreground">{code}</span>
              </div>
              <h3 className="mt-12 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-subtle">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">Reconstruction telemetry</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                online
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-success" : "bg-destructive"}`} />
              {online ? "LIVE" : "SYNC"}
            </span>
          </div>
          <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {[
              { k: "Stream pulses", v: telemetry.tick.toString() },
              { k: "Core resonance", v: telemetry.frequency ? telemetry.frequency.toFixed(2) : "—" },
              { k: "Allocation", v: telemetry.split ? `${(telemetry.split * 100).toFixed(1)}%` : "—" },
              { k: "Last sync", v: lastSync },
            ].map(({ k, v }) => (
              <div key={k} className="bg-background px-5 py-6">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-3 font-mono text-2xl tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Endpoint <span className="font-mono">/api/sultan-core</span> · refresh every{" "}
            {(TELEMETRY_CADENCE_MS / 1000).toFixed(2)}s
          </p>
        </div>
      </section>

      {user && (
        <section className="border-y border-border bg-surface-subtle">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">PI PAYMENT</p>
              <h2 className="mt-3 text-2xl font-semibold">{copy.payment}</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{copy.paymentText}</p>
            </div>
            <PiPaymentButton userId={user.uid} userName={user.username} />
          </div>
        </section>
      )}

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center lg:px-8">
          <p>© 2026 Sultan DApp · @YASSINSERVICE</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 md:ms-auto" aria-label="Footer">
            <a href="https://github.com/pi-apps/pi-platform-docs/blob/master/LICENSE" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">PiOS License <ArrowUpRight className="h-3 w-3" /></a>
            <a href="https://github.com/Wizyes4you/Sultan-Core" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">GitHub <ArrowUpRight className="h-3 w-3" /></a>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}