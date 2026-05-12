import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Instagram, MapPin, Send } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Thato's Storefront" },
      { name: "description", content: "Get in touch with Thato directly for orders, sizing or stock questions." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Storefront</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Talk to Thato</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Questions on stock, sizing, or a custom request? Drop a message —
            you'll usually hear back within a few hours.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-card">
                <Mail className="h-4 w-4 text-primary" />
              </span>
              <a href="mailto:hello@thatosstorefront.co.za" className="hover:text-primary">hello@thatosstorefront.co.za</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-card">
                <Phone className="h-4 w-4 text-primary" />
              </span>
              <a href="tel:+27110000000" className="hover:text-primary">+27 11 000 0000</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-card">
                <Instagram className="h-4 w-4 text-primary" />
              </span>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="hover:text-primary">@thatos.storefront</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-card">
                <MapPin className="h-4 w-4 text-primary" />
              </span>
              <span>Johannesburg, South Africa</span>
            </li>
          </ul>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-sm border border-border bg-card p-6"
        >
          <h2 className="font-display text-xl font-semibold">Send a message</h2>
          {sent ? (
            <div className="mt-6 rounded-sm border border-primary/40 bg-primary/10 p-4 text-sm text-primary">
              Thanks — your message is on its way. Thato will get back to you shortly.
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Name
                <input required className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Email
                <input required type="email" className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Message
                <textarea required rows={5} className="resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90">
                <Send className="h-4 w-4" /> Send message
              </button>
            </div>
          )}
        </form>
      </section>
      <Footer />
    </div>
  );
}
