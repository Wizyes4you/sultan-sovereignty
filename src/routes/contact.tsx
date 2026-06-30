import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SultanBackdrop } from "@/components/SultanBackdrop";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be under 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be under 2000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Community Support — SULTAN" },
      {
        name: "description",
        content:
          "Contact the SULTAN team for support, feedback, or community outreach. Direct channel for Pi Network app inquiries.",
      },
      { property: "og:title", content: "Contact & Community Support — SULTAN" },
      {
        property: "og:description",
        content:
          "Contact the SULTAN team for support, feedback, or community outreach. Direct channel for Pi Network app inquiries.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sultan-core.lovable.app/contact" },
    ],
    links: [
      { rel: "canonical", href: "https://sultan-core.lovable.app/contact" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate send — replace with real backend integration when ready
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  };

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="sultan-bg relative min-h-screen overflow-hidden text-white">
      <SultanBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-amber-200/70">
            التواصل والدعم
          </p>
          <h1 className="sultan-gold-text text-4xl font-bold tracking-tight sm:text-5xl">
            Contact & Support
          </h1>
          <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed text-white/70">
            The Palace doors are open. Reach out for support, feedback, or community collaboration.
          </p>
        </div>

        {/* Contact info cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sultan-glass rounded-2xl p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-wider text-amber-200/70">Email</p>
            <p className="mt-1 text-sm font-medium text-white">support@sultan-core.lovable.app</p>
          </div>
          <div className="sultan-glass rounded-2xl p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-wider text-amber-200/70">Platform</p>
            <p className="mt-1 text-sm font-medium text-white">Pi Network — Mainnet</p>
          </div>
        </div>

        {/* Form */}
        <div className="sultan-glass rounded-2xl p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Message Received</h2>
              <p className="mt-2 text-sm text-white/70">
                Thank you for reaching out. The Palace stewards will review your message and respond through the appropriate channel.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="mt-6 text-sm text-amber-300 underline underline-offset-2 hover:text-amber-200"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-amber-200/80">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                  className="border-amber-500/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-amber-200/80">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  className="border-amber-500/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-amber-200/80">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  placeholder="How can we help?"
                  className="border-amber-500/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && <p className="mt-1 text-xs text-red-300">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-amber-200/80">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Describe your inquiry in detail..."
                  rows={5}
                  className="border-amber-500/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="mt-1 text-xs text-red-300">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full sultan-gold-btn h-11 rounded-full text-sm font-semibold disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Message"}
              </Button>

              <p className="text-center text-[11px] text-white/40">
                This form submits to the SULTAN support queue. Response times may vary based on inquiry volume.
              </p>
            </form>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex flex-wrap justify-center gap-6 pb-8">
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
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 text-sm text-amber-200/70 transition-colors hover:text-amber-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
