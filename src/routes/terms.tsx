import { createFileRoute, Link } from "@tanstack/react-router";
import { SultanBackdrop } from "@/components/SultanBackdrop";

const sections = [
  {
    title: "1. Ethical conduct and acceptance | السلوك الأخلاقي والقبول",
    body: "By accessing SULTAN, you agree to act lawfully, honestly, and with respect for other participants. Use of the service must support integrity, fairness, safety, and the legitimate purposes of the Pi Network ecosystem.",
  },
  {
    title: "2. Pi Browser and API ecosystem | نظام Pi Browser وواجهات API",
    body: "SULTAN is designed for use with Pi Browser and approved Pi Network platform flows. You agree to follow Pi Network policies, use the official Pi SDK and API endpoints as intended, and provide accurate information during authentication or payment prompts.",
  },
  {
    title: "3. Prohibited use | الاستخدام المحظور",
    body: "You may not exploit vulnerabilities, reverse engineer or decompile the application, bypass authentication or payment controls, impersonate another person, introduce malicious code, scrape protected data, or use bots and automated spamming to disrupt the service or its community.",
  },
  {
    title: "4. Account and wallet responsibility | مسؤولية الحساب والمحفظة",
    body: "You are responsible for your Pi account, device security, and every action approved through your Pi Wallet. SULTAN never requests private wallet keys or recovery phrases. Review every transaction in the Pi Wallet before approving it.",
  },
  {
    title: "5. Service updates and availability | تحديثات الخدمة وتوفرها",
    body: "We may update, suspend, or discontinue features to improve security, comply with platform requirements, or maintain the service. We do not promise uninterrupted availability, compatibility with every device, or that every feature will remain unchanged.",
  },
  {
    title: "6. Disclaimer and limitation of liability | إخلاء المسؤولية",
    body: "SULTAN is provided on an as-is and as-available basis. To the fullest extent permitted by law, the project owner is not responsible for indirect loss, network interruptions, third-party platform changes, unauthorized access caused by user negligence, or transactions approved by the user. Nothing here limits rights that cannot legally be limited.",
  },
  {
    title: "7. Intellectual property | الملكية الفكرية",
    body: "SULTAN branding, interface, and original content belong to the project owner unless otherwise stated. You may not copy, republish, resell, or create derivative works from protected materials without permission.",
  },
  {
    title: "8. Changes and contact | التغييرات والتواصل",
    body: "These terms may be revised as the application evolves. Continued use after an update means you accept the revised terms. Questions about these terms should be directed through the project's official support channel.",
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "شروط الخدمة | Terms of Service - SULTAN" },
      { name: "description", content: "SULTAN Terms of Service for ethical conduct, Pi Browser integration, and fair use." },
      { property: "og:title", content: "شروط الخدمة | Terms of Service - SULTAN" },
    ],
    links: [{ rel: "canonical", href: "https://sultan-sovereignty.vercel.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 sm:py-14">
        <header className="mb-8 border-b border-amber-200/15 pb-8">
          <nav aria-label="Legal navigation" className="mb-10 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link to="/" className="font-semibold tracking-[0.2em] text-amber-200 transition-colors hover:text-white">SULTAN</Link>
            <div className="flex gap-4 text-white/60">
              <Link to="/privacy" className="transition-colors hover:text-amber-200">Privacy</Link>
              <Link to="/terms" className="text-amber-200" aria-current="page">Terms</Link>
            </div>
          </nav>
          <p className="mb-3 text-right text-sm text-amber-200/75" dir="rtl">شروط الخدمة</p>
          <h1 className="sultan-gold-text text-3xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">Guidelines for ethical conduct, fair use, and responsible participation in the SULTAN Pi Network application.</p>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/40">Effective date: September 24, 2026</p>
        </header>

        <div className="sultan-glass mb-8 rounded-2xl p-5 sm:p-6">
          <p className="text-sm leading-7 text-amber-100/85">SULTAN is built around integrity, accountability, and fair access. Please read these terms before using Pi authentication or any connected service flow.</p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="sultan-glass rounded-2xl p-5 sm:p-7">
              <h2 className="mb-3 text-base font-semibold leading-7 text-amber-100 sm:text-lg">{section.title}</h2>
              <p className="text-sm leading-7 text-white/75">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200/15 pt-6 text-sm text-white/55">
          <Link to="/" className="transition-colors hover:text-amber-200">← Return to SULTAN</Link>
          <Link to="/privacy" className="text-amber-200 transition-colors hover:text-white">Read Privacy Policy →</Link>
        </footer>
      </div>
    </main>
  );
}

export default TermsPage;
