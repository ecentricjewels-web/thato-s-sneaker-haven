import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Package, ShoppingBag, Heart, LogOut, Plus, Trash2, Upload, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/products";

const ORDER_STATUSES = [
  "Order Received",
  "Processing",
  "Ready for Dispatch",
  "Out for Delivery",
  "Delivered",
  "On Hold",
  "Cancelled",
] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Thato's Storefront" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "products" | "wishlists">("orders");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/admin/login" });
  }, [loading, user, navigate]);

  if (loading) return <Loader>Loading…</Loader>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <Loader>
        <div>You're signed in but don't have admin access.</div>
        <button onClick={() => signOut()} className="mt-3 rounded-sm border border-border px-4 py-2 text-sm">Sign out</button>
      </Loader>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Admin</div>
            <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="rounded-sm border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground">View site</Link>
            <button onClick={() => signOut()} className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1400px] gap-1 px-4">
          {[
            { id: "orders", label: "Orders", Icon: ShoppingBag },
            { id: "products", label: "Products", Icon: Package },
            { id: "wishlists", label: "Wishlists", Icon: Heart },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm ${
                tab === id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-8">
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "wishlists" && <WishlistsTab />}
      </main>
    </div>
  );
}

function Loader({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-center text-sm text-muted-foreground">
      <div>{children}</div>
    </div>
  );
}

// ───── Orders ─────
function OrdersTab() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order deleted");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-sm text-muted-foreground">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const items = (o.items as Array<{ name: string; size: string; qty: number; price: number }>) ?? [];
        return (
          <div key={o.id} className="rounded-sm border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Ref · {o.reference}</div>
                <div className="font-display text-lg font-semibold">{o.customer_first_name} {o.customer_last_name}</div>
                <div className="text-xs text-muted-foreground">{o.customer_phone} · {new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                  className="rounded-sm border border-border bg-background px-3 py-2 text-xs">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => deleteOrder(o.id)} className="grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground hover:border-destructive hover:text-destructive" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <div><span className="text-muted-foreground">Shipping:</span> {o.shipping_label}</div>
              {o.pep_store && <div><span className="text-muted-foreground">PEP store:</span> {o.pep_store}</div>}
              {o.delivery_address && <div className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {o.delivery_address}</div>}
              {o.notes && <div className="sm:col-span-2"><span className="text-muted-foreground">Notes:</span> {o.notes}</div>}
            </div>
            <div className="mt-4 divide-y divide-border border-y border-border text-sm">
              {items.map((it, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>{it.name} <span className="text-muted-foreground">· UK {it.size} × {it.qty}</span></div>
                  <div className="font-medium">{formatPrice(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end gap-6 text-sm">
              <div className="text-muted-foreground">Subtotal {formatPrice(o.subtotal)}</div>
              <div className="text-muted-foreground">Shipping {o.shipping_cost === 0 ? "Free" : formatPrice(o.shipping_cost)}</div>
              <div className="font-display text-base font-bold">Total {formatPrice(o.total)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ───── Products ─────
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  colorway: string;
  category: string;
  price: number;
  image: string;
  sizes: string[];
  is_new: boolean;
  in_stock: boolean;
  active: boolean;
};

function ProductsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductRow[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["public-products"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{rows.length} product{rows.length === 1 ? "" : "s"} in database</div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading products…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <div key={p.id} className="rounded-sm border border-border bg-card p-3">
              <div className="aspect-square w-full overflow-hidden rounded-sm bg-surface">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{p.brand}</div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.colorway}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-display text-base font-semibold">{formatPrice(p.price)}</div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded-sm border border-border" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {!p.active && <div className="mt-2 inline-block rounded-sm bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Hidden</div>}
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ProductFormDialog
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); refresh(); }}
        />
      )}
    </div>
  );
}

function ProductFormDialog({ initial, onClose, onSaved }: { initial: ProductRow | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    brand: initial?.brand ?? "Nike",
    colorway: initial?.colorway ?? "",
    category: initial?.category ?? "Lifestyle",
    price: initial?.price ?? 1000,
    image: initial?.image ?? "",
    sizes: (initial?.sizes ?? ["6", "7", "8", "9", "10"]).join(", "),
    is_new: initial?.is_new ?? false,
    in_stock: initial?.in_stock ?? true,
    active: initial?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    toast.success("Image uploaded");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast.error("Upload an image first");
    setSaving(true);
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      brand: form.brand,
      colorway: form.colorway.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      is_new: form.is_new,
      in_stock: form.in_stock,
      active: form.active,
    };
    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", initial!.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isEdit ? "Product updated" : "Product added");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-sm border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{isEdit ? "Edit product" : "Add product"}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-sm border border-border"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required placeholder="e.g. nike-air-force-1-blue" />
          <FormInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <FormSelect label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })}
            options={["Nike", "Jordan", "Adidas", "Puma", "New Balance"]} />
          <FormSelect label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })}
            options={["Lifestyle", "Basketball", "Running"]} />
          <FormInput label="Colorway" value={form.colorway} onChange={(v) => setForm({ ...form, colorway: v })} required />
          <FormInput label="Price (R)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
          <FormInput label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} className="sm:col-span-2" />
        </div>

        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Image</div>
          <div className="mt-2 flex items-center gap-4">
            {form.image ? (
              <img src={form.image} alt="" className="h-24 w-24 rounded-sm border border-border object-cover" />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-sm border border-dashed border-border text-muted-foreground"><Upload className="h-5 w-5" /></div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs hover:border-primary">
              <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <Checkbox label="New release" checked={form.is_new} onChange={(v) => setForm({ ...form, is_new: v })} />
          <Checkbox label="In stock" checked={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
          <Checkbox label="Active (visible on storefront)" checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, value, onChange, required, type = "text", placeholder, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <label className={`grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground ${className}`}>
      {label}
      <input required={required} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
    </label>
  );
}

function FormSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}

// ───── Wishlists ─────
function WishlistsTab() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-wishlists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("id, user_id, product_slug, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const byUser = useMemo(() => {
    const m = new Map<string, { product_slug: string; created_at: string }[]>();
    rows.forEach((r) => {
      const list = m.get(r.user_id) ?? [];
      list.push({ product_slug: r.product_slug, created_at: r.created_at });
      m.set(r.user_id, list);
    });
    return Array.from(m.entries());
  }, [rows]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading wishlists…</p>;
  if (byUser.length === 0) return <p className="text-sm text-muted-foreground">No one has saved anything yet. Signed-in shoppers' wishlists appear here.</p>;

  return (
    <div className="space-y-4">
      {byUser.map(([userId, items]) => (
        <div key={userId} className="rounded-sm border border-border bg-card p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Shopper</div>
          <div className="font-mono text-xs">{userId}</div>
          <div className="text-xs text-muted-foreground">{items.length} saved item{items.length === 1 ? "" : "s"}</div>
          <ul className="mt-3 grid gap-1 text-sm">
            {items.map((it, i) => (
              <li key={i} className="flex items-center justify-between border-t border-border pt-2 first:border-t-0 first:pt-0">
                <span>{it.product_slug}</span>
                <span className="text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
