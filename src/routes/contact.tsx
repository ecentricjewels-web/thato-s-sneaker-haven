import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Send, MessageCircle } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Thato's Storefront" },
      { name: "description", content: "Get in touch with Thato directly for orders or custom requests." },
    ],
  }),
  component: ContactPage,
});

const WHATSAPP_NUMBER = "27780148476";
const DISPLAY_PHONE = "078 014 8476";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Message: ${message.trim()}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto grid max-w-[1100px] gap-12 px-4 py-16 md:grid-cols-[1fr_1.2fr] md:py-20">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Storefront</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Talk to Thato</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Questions on stock or a custom request? Drop a message — you'll usually
            hear back within a few hours.
          </p>

          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="mt-8 inline-flex items-center gap-3 rounded-sm border border-border bg-card px-5 py-4 transition hover:border-primary"
          >
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-primary/10 text-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Call or WhatsApp</span>
              <span className="block font-display text-lg font-semibold">{DISPLAY_PHONE}</span>
            </span>
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-border bg-gradient-to-b from-card to-card/60 p-7 shadow-card"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-sm bg-primary/10 text-primary">
              <MessageCircle className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-semibold">Send a message</h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Your message opens in WhatsApp — just tap send.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="rounded-sm border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
            <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                className="rounded-sm border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
            <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Message
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                className="resize-none rounded-sm border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </label>
            <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90">
              <Send className="h-4 w-4" /> Send message
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
