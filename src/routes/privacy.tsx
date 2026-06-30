import { createFileRoute, Link } from "@tanstack/react-router";
import { SultanBackdrop } from "@/components/SultanBackdrop";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SULTAN" },
      {
        name: "description",
        content:
          "SULTAN privacy policy: how we handle data, protect user trust, and uphold transparency on the Pi Network.",
      },
      { property: "og:title", content: "Privacy Policy — SULTAN" },
      {
        property: "og:description",
        content:
          "SULTAN privacy policy: how we handle data, protect user trust, and uphold transparency on the Pi Network.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sultan-core.lovable.app/privacy" },
    ],
    links: [
      { rel: "canonical", href: "https://sultan-core.lovable.app/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-amber-200/70">
            سياسة الخصوصية
          </p>
          <h1 className="sultan-gold-text text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-white/50">Last updated: June 2026</p>
        </div>

        {/* Qualifier */}
        <div className="sultan-glass rounded-xl px-5 py-4 text-center">
          <p className="text-xs text-amber-100/70">
            This page is maintained by the SULTAN app owner to answer common privacy questions about the SULTAN application. It is editable app-owned content, not an independent certification or legal opinion.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <PolicySection title="1. Introduction">
            <p>
              SULTAN ("we", "us", or "our") operates within the Pi Network ecosystem. This Privacy Policy describes how we collect, use, store, and protect information when you use our application. We are committed to transparency, user trust, and ethical data practices.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <ul className="list-disc space-y-2 pl-5 text-white/80">
              <li>
                <strong className="text-amber-200">Pi Network Profile Data:</strong> When you authenticate via Pi Browser, we receive your Pi username and UID as provided by the Pi Platform. We do not collect passwords or private keys.
              </li>
              <li>
                <strong className="text-amber-200">Payment Metadata:</strong> For humanitarian contributions, we process payment identifiers and transaction metadata through the Pi Platform. We do not store full payment credentials.
              </li>
              <li>
                <strong className="text-amber-200">Technical Data:</strong> Standard server logs (IP address, user agent, request timestamps) are retained for security and operational diagnostics, typically no longer than 30 days.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Information">
            <ul className="list-disc space-y-2 pl-5 text-white/80">
              <li>To authenticate your identity via Pi Network and establish secure sessions.</li>
              <li>To process and record humanitarian reconstruction contributions.</li>
              <li>To maintain application security, prevent abuse, and ensure service integrity.</li>
              <li>To communicate essential service updates or respond to support inquiries.</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Data Sharing & Transfers">
            <p>
              We do not sell, rent, or trade personal data. Information is shared only with:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-white/80">
              <li>The Pi Network Platform, as necessary for authentication and payment processing.</li>
              <li>Stellar network infrastructure, for transparent on-chain transaction recording.</li>
              <li>Law enforcement or regulatory bodies, only when legally required.</li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Data Security">
            <p>
              We implement reasonable technical and organizational safeguards: HTTPS/TLS encryption for data in transit, session token validation against Pi Platform APIs, and minimal data retention. No system is completely immune to risk; we encourage users to practice good security hygiene.
            </p>
          </PolicySection>

          <PolicySection title="6. Your Rights">
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete personal data we hold. To exercise these rights, contact us through the Community Support channel. We will respond within a reasonable timeframe.
            </p>
          </PolicySection>

          <PolicySection title="7. Cookies & Tracking">
            <p>
              SULTAN does not use third-party advertising cookies or cross-site trackers. Essential session cookies may be used to maintain your authenticated state securely. You can clear cookies via your browser settings at any time.
            </p>
          </PolicySection>

          <PolicySection title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy as the app evolves. Material changes will be communicated through the app or Pi Network channels. Continued use after changes constitutes acceptance of the revised policy.
            </p>
          </PolicySection>

          <PolicySection title="9. Contact">
            <p>
              For privacy-related questions or data requests, please visit our{" "}
              <Link to="/contact" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
                Contact & Community Support
              </Link>{" "}
              page.
            </p>
          </PolicySection>
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

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sultan-glass rounded-2xl p-6">
      <h2 className="mb-3 text-lg font-semibold text-amber-100">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/75">{children}</div>
    </section>
  );
}
