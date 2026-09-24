import { createFileRoute, Link } from "@tanstack/react-router";
import { SultanBackdrop } from "@/components/SultanBackdrop";

const sections = [
  {
    title: "1. Trust, honesty, and stewardship | الثقة والأمانة والرعاية",
    body: "SULTAN is committed to transparent, ethical data stewardship. We collect only what is needed to provide the application, protect the ecosystem, and support accountable service operations.",
  },
  {
    title: "2. Pi Network authentication | المصادقة عبر شبكة Pi",
    body: "When you sign in through the Pi Browser and Pi SDK, SULTAN may receive the Pi Network User ID and Username returned by the Pi Platform. These identifiers are used to establish your application session and associate activity with the authenticated Pi account.",
  },
  {
    title: "3. No sensitive data or private keys | لا بيانات حساسة ولا مفاتيح خاصة",
    body: "SULTAN does not collect sensitive personal data such as government identifiers, biometric data, or financial account credentials. We never request, access, store, or control your Pi wallet private keys or secret recovery phrases. Wallet approvals remain with the Pi Wallet and Pi Platform.",
  },
  {
    title: "4. Local storage | التخزين المحلي",
    body: "The application may use browser Local Storage to remember non-sensitive preferences and interface state, such as display choices or dismissed notices. You can clear this information through your browser settings. Local Storage is not used to store private wallet keys.",
  },
  {
    title: "5. Security | الأمن",
    body: "We apply high security standards, including HTTPS/SSL encryption for data in transit, least-privilege access, secure session handling, and monitoring for misuse. No online service can guarantee absolute security, so please protect your Pi account and never share wallet secrets.",
  },
  {
    title: "6. Sharing and retention | المشاركة والاحتفاظ",
    body: "We do not sell or rent personal information. Data may be shared with Pi Network only as necessary for authentication and requested platform flows, or where required by law. We retain information only for as long as it serves a legitimate operational, security, or legal purpose.",
  },
  {
    title: "7. Your choices and updates | اختياراتك والتحديثات",
    body: "You may stop using SULTAN, clear local browser data, or contact the project owner with privacy questions. We may update this policy as the application changes. The effective date below identifies the current version.",
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | Privacy Policy - SULTAN" },
      {
        name: "description",
        content:
          "SULTAN Privacy Policy for Pi Network authentication and ethical data stewardship.",
      },
      { property: "og:title", content: "سياسة الخصوصية | Privacy Policy - SULTAN" },
    ],
    links: [{ rel: "canonical", href: "https://sultan-sovereignty.vercel.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 sm:py-14">
        <header className="mb-8 border-b border-amber-200/15 pb-8">
          <nav
            aria-label="Legal navigation"
            className="mb-10 flex flex-wrap items-center justify-between gap-4 text-sm"
          >
            <Link
              to="/"
              className="font-semibold tracking-[0.2em] text-amber-200 transition-colors hover:text-white"
            >
              SULTAN
            </Link>
            <div className="flex gap-4 text-white/60">
              <Link to="/privacy" className="text-amber-200" aria-current="page">
                Privacy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-amber-200">
                Terms
              </Link>
            </div>
          </nav>
          <p className="mb-3 text-right text-sm text-amber-200/75" dir="rtl">
            سياسة الخصوصية
          </p>
          <h1 className="sultan-gold-text text-3xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
            A clear statement of how SULTAN protects trust, limits collection, and handles Pi
            Network account information.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/40">
            Effective date: September 24, 2026
          </p>
        </header>

        <div className="sultan-glass mb-8 rounded-2xl p-5 sm:p-6">
          <p className="text-sm leading-7 text-amber-100/85">
            SULTAN follows principles of trust, honesty, justice, and responsible technology. This
            policy applies to the SULTAN application and its Pi Browser integration.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="sultan-glass rounded-2xl p-5 sm:p-7">
              <h2 className="mb-3 text-base font-semibold leading-7 text-amber-100 sm:text-lg">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-white/75">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200/15 pt-6 text-sm text-white/55">
          <Link to="/" className="transition-colors hover:text-amber-200">
            ← Return to SULTAN
          </Link>
          <Link to="/terms" className="text-amber-200 transition-colors hover:text-white">
            Read Terms of Service →
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default PrivacyPage;
