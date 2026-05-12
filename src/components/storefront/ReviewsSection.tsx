import { useState } from "react";
import { Star } from "lucide-react";
import { useStore } from "@/lib/store";

export function ReviewsSection() {
  const { reviews, addReview } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    addReview({ name: name.trim(), rating, text: text.trim() });
    setName("");
    setText("");
    setRating(5);
    setOpen(false);
  };

  const visible = reviews.slice(0, 6);

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Word on the street</div>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">What customers are saying</h2>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-sm border border-primary bg-primary/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            <Star className="h-4 w-4" />
            {open ? "Close" : "Leave a review"}
          </button>
        </div>

        {open && (
          <form onSubmit={submit} className="mt-8 grid gap-4 rounded-sm border border-border bg-card p-6 md:grid-cols-2">
            <label className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>
            <div className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Rating
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    type="button"
                    key={i}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(i)}
                    aria-label={`${i} stars`}
                  >
                    <Star
                      className={`h-7 w-7 transition ${
                        i <= (hovered || rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <label className="grid gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground md:col-span-2">
              Your review
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                className="resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>
            <div className="md:col-span-2">
              <button className="rounded-sm bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90">
                Post review
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {visible.map((r) => (
            <div key={r.id} className="rounded-sm border border-border bg-card p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/90">"{r.text}"</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>— {r.name}</span>
                <span>{new Date(r.date).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
