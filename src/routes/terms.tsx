import { createFileRoute, Link } from "@tanstack/react-router";
import { SultanBackdrop } from "@/components/SultanBackdrop";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "trigger" },
      { property: "og:url", content: "https://sultan-core.lovable.app/terms" },
    ],
    links: [
      { rel: "canonical", href: "https://sultan-core.lovable.app/terms" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-amber-200/70">
            شروط الخدمة
          </p>
          <h1 className="sultan-gold-text text-4xl font-bold tracking-tight sm:text-5xl">
            Sovereign Terms of Service
          </h1>
          <p className="mt-2 text-sm text-white/50">Last updated: June 2026</p>
        </div>

        {/* Qualifier */}
        <div className="sultan-glass rounded-xl px-5 py-4 text-center">
          <p className="text-xs text-amber-100/70">
            These terms govern your use of the SULTAN application. By accessing or using the app, you agree to be bound by these terms.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <TermsSection title="1. Acceptance of Terms">
            <p>
              By accessing or using the SULTAN application ("the App"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.
            </p>
          </TermsSection>

          <TermsSection title="2. Eligibility & Pi Network Membership">
            <p>
              The App is designed for users within the Pi Network ecosystem. You must have a valid Pi Network account to access certain features, including authentication and payment flows. We do not guarantee availability outside the Pi Platform.
            </p>
          </TermsSection>

          <TermsSection title="3. Description of Services">
            <p>
              SULTAN provides the following services through the Pi Network:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>Sovereign Pi authentication and session management.</li>
              <li>Humanitarian reconstruction payment flows with a 2.5% contribution split.</li>
              <li>Community support and engagement tools.</li>
              <li>Informational and spiritual content referencing the Quranic framework of 114 Surahs as a guiding principle for balanced, ethical operation.</li>
            </ul>
          </TermsSection>

          <TermsSection title="4. User Conduct">
            <p>
              You agree not to:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>Attempt to bypass authentication, security, or payment mechanisms.</li>
              <li>Use the App for unlawful, fraudulent, or malicious purposes.</li>
              <li>Interfere with the stability or integrity of the App or the Pi Network.</li>
              <li>Impersonate another user or entity.</li>
            </ul>
          </TermsSection>

          <TermsSection title="5. Payments & Reconstruction Contributions">
            <p>
              All payments processed through the App are handled via the Pi Network's approved payment infrastructure. A 2.5% contribution is allocated to humanitarian reconstruction flows. These transactions are transparent and recorded on-chain. The App does not store your private keys or Pi wallet credentials.
            </p>
          </TermsSection>

          <TermsSection title="6. Intellectual Property">
            <p>
              All content, branding, and code within the App are the property of the SULTAN project owner unless otherwise stated. You may not reproduce, distribute, or create derivative works without express permission.
            </p>
          </TermsSection>

          <TermsSection title="7. Disclaimer of Warranties">
            <p>
              The App is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, error-free operation, or specific outcomes from payment flows. Use the App at your own risk.
            </p>
          </TermsSection>

          <TermsSection title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, the App owner shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App, including but not limited to loss of funds, data, or access.
            </p>
          </TermsSection>

          <TermsSection title="9. Modifications to Terms">
            <p>
              We reserve the right to update these terms at any time. Material changes will be communicated through the App or Pi Network channels. Continued use after changes constitutes acceptance of the revised terms.
            </p>
          </TermsSection>

          <TermsSection title="10. Governing Principles">
            <p>
              SULTAN operates on principles of truth, justice, and ethical stewardship. The 114 Surah framework represents a commitment to balance and completeness in all operations, including payment transparency, community welfare, and platform integrity.
            </p>
          </TermsSection>

          <TermsSection title="11. Contact">
            <p>
              For questions regarding these Terms of Service, please visit our{" "}
              <Link to="/contact" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
                Contact & Community Support
              </Link>{" "}
              page.
            </p>
          </TermsSection>
        </div>

        {/* Footer nav */}
        <div className="flex justify-center pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-amber-200/70 transition-colors hover:text-amber-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Return to Palace
          </Link>
        </div>
      </div>
    </main>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sultan-glass rounded-2xl p-6">
      <h2 className="mb-3 text-lg font-semibold text-amber-100">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/75">{children}</div>
    </section>
  );
}
