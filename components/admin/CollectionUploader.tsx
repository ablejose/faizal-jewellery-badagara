"use client";

import { type FormEvent, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import type { ManifestProduct } from "@/lib/manifest";
import { apiJson, signAndUpload } from "@/components/admin/cloud";
import { formatRupees, quantityLabel } from "@/lib/format";

interface Props {
  collection: Collection;
  products: ManifestProduct[];
  loading: boolean;
  onChanged: () => void | Promise<void>;
}

const UNIT_OPTIONS = ["kg", "carat"] as const;

/** Split a stored unit string into a dropdown selection + custom text. */
function splitUnit(unit?: string): { sel: string; custom: string } {
  if (!unit || !unit.trim()) return { sel: "", custom: "" };
  const low = unit.trim().toLowerCase();
  if ((UNIT_OPTIONS as readonly string[]).includes(low)) return { sel: low, custom: "" };
  return { sel: "other", custom: unit.trim() };
}

/** Resolve the dropdown selection + custom text back into a unit string. */
function resolveUnit(sel: string, custom: string): string {
  if (sel === "other") return custom.trim();
  return sel;
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-black/40 px-3 py-2 text-ivory outline-none focus:border-gold";

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

/** Dropdown of quantity units (kg / carat / other), with a custom field for "other". */
function UnitFields({
  sel,
  custom,
  onSel,
  onCustom,
  disabled,
}: {
  sel: string;
  custom: string;
  onSel: (v: string) => void;
  onCustom: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <>
      <select
        value={sel}
        onChange={(e) => onSel(e.target.value)}
        disabled={disabled}
        className={inputCls}
        aria-label="Quantity unit"
      >
        <option value="">Unit…</option>
        <option value="kg">kg</option>
        <option value="carat">carat</option>
        <option value="other">Other…</option>
      </select>
      {sel === "other" ? (
        <input
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          disabled={disabled}
          placeholder="Type unit (e.g. gram, piece)"
          className={inputCls}
          aria-label="Custom unit"
        />
      ) : null}
    </>
  );
}

export function CollectionUploader({ collection, products, loading, onChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Add-product form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [unitSel, setUnitSel] = useState("");
  const [unitCustom, setUnitCustom] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // Per-item edit / delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eName, setEName] = useState("");
  const [ePrice, setEPrice] = useState("");
  const [eQty, setEQty] = useState("");
  const [eUnitSel, setEUnitSel] = useState("");
  const [eUnitCustom, setEUnitCustom] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setQty("");
    setUnitSel("");
    setUnitCustom("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!file) return setError("Choose an image.");
    if (!name.trim()) return setError("Enter a product name.");

    setBusy(true);
    try {
      const uploaded = await signAndUpload(collection.slug, file);
      await apiJson("/api/admin/products", "POST", {
        slug: collection.slug,
        publicId: uploaded.publicId,
        name: name.trim(),
        price: price.trim(),
        quantity: qty.trim(),
        unit: resolveUnit(unitSel, unitCustom),
      });
      setStatus(`Added “${name.trim()}”. See the preview below.`);
      resetForm();
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (product: ManifestProduct) => {
    setError("");
    setStatus("");
    setEditingId(product.publicId);
    setEName(product.name || "");
    setEPrice(product.price > 0 ? String(product.price) : "");
    setEQty(product.quantity || "");
    const u = splitUnit(product.unit);
    setEUnitSel(u.sel);
    setEUnitCustom(u.custom);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (product: ManifestProduct) => {
    setError("");
    setStatus("");
    if (!eName.trim()) return setError("Product name can’t be empty.");
    setSaving(true);
    try {
      await apiJson("/api/admin/products", "PATCH", {
        slug: collection.slug,
        publicId: product.publicId,
        name: eName.trim(),
        price: ePrice.trim(),
        quantity: eQty.trim(),
        unit: resolveUnit(eUnitSel, eUnitCustom),
      });
      setStatus("Saved changes.");
      setEditingId(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: ManifestProduct) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`Delete “${product.name || "this item"}” from ${collection.name}?`);
      if (!ok) return;
    }
    setError("");
    setStatus("");
    setDeletingId(product.publicId);
    try {
      await apiJson("/api/admin/products", "DELETE", {
        slug: collection.slug,
        publicId: product.publicId,
      });
      setStatus("Deleted.");
      if (editingId === product.publicId) setEditingId(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-card border border-border bg-[#0b0b12] p-6 md:p-8">
      <header className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl text-ivory">{collection.name}</h2>
        <span className="text-xs uppercase tracking-widest text-ivory/40">
          {products.length} {products.length === 1 ? "item" : "items"} · /{collection.slug}
        </span>
      </header>

      <form onSubmit={add} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="block text-sm text-ivory/80" htmlFor={`name-${collection.slug}`}>
            Product name
          </label>
          <input
            id={`name-${collection.slug}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            disabled={busy}
          />
        </div>
        <div>
          <label className="block text-sm text-ivory/80" htmlFor={`price-${collection.slug}`}>
            Price (₹) — optional
          </label>
          <input
            id={`price-${collection.slug}`}
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Leave blank for “on request”"
            className={inputCls}
            disabled={busy}
          />
        </div>
        <div>
          <label className="block text-sm text-ivory/80" htmlFor={`qty-${collection.slug}`}>
            Quantity — optional
          </label>
          <input
            id={`qty-${collection.slug}`}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="e.g. 2"
            inputMode="decimal"
            className={inputCls}
            disabled={busy}
          />
        </div>
        <div>
          <span className="block text-sm text-ivory/80">Unit</span>
          <UnitFields
            sel={unitSel}
            custom={unitCustom}
            onSel={setUnitSel}
            onCustom={setUnitCustom}
            disabled={busy}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-sm text-ivory/80" htmlFor={`file-${collection.slug}`}>
            Photo
          </label>
          <input
            id={`file-${collection.slug}`}
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-ivory/70 file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-black"
            disabled={busy}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gold px-6 py-2.5 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Add product"}
          </button>
        </div>
      </form>

      {status ? <p className="mt-3 text-sm text-gold">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#ff9b9b]">{error}</p> : null}

      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-ivory/40">In this category</p>
        {loading ? (
          <p className="text-sm text-ivory/50">Loading current photos…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ivory/50">
            No products yet. Uploaded items appear here with Edit and Delete.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const isDeleting = deletingId === product.publicId;
              const isEditing = editingId === product.publicId;
              const qLabel = quantityLabel(product.quantity, product.unit);
              return (
                <li
                  key={product.publicId}
                  className="flex flex-col overflow-hidden rounded-lg border border-border bg-black/20"
                >
                  <div className="relative aspect-[3/4] bg-black/40">
                    <Image
                      src={product.url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-2">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          value={eName}
                          onChange={(e) => setEName(e.target.value)}
                          placeholder="Name"
                          className={inputCls}
                          disabled={saving}
                        />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          inputMode="numeric"
                          value={ePrice}
                          onChange={(e) => setEPrice(e.target.value)}
                          placeholder="Price ₹ (optional)"
                          className={inputCls}
                          disabled={saving}
                        />
                        <input
                          value={eQty}
                          onChange={(e) => setEQty(e.target.value)}
                          placeholder="Quantity (optional)"
                          inputMode="decimal"
                          className={inputCls}
                          disabled={saving}
                        />
                        <UnitFields
                          sel={eUnitSel}
                          custom={eUnitCustom}
                          onSel={setEUnitSel}
                          onCustom={setEUnitCustom}
                          disabled={saving}
                        />
                        <div className="mt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(product)}
                            disabled={saving}
                            className="flex-1 rounded-md bg-gold px-2 py-1.5 text-xs font-medium text-black transition hover:opacity-90 disabled:opacity-60"
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs text-ivory/80 transition hover:border-gold disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="truncate text-sm text-ivory">{product.name || "Untitled"}</p>
                        <p className="text-xs text-gold">
                          {product.price > 0 ? formatRupees(product.price) : "Price on request"}
                        </p>
                        {qLabel ? <p className="text-xs text-ivory/60">Qty: {qLabel}</p> : null}
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            aria-label={`Edit ${product.name || "product"}`}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gold/40 bg-gold/10 px-2 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/20"
                          >
                            <EditIcon /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(product)}
                            disabled={isDeleting}
                            aria-label={`Delete ${product.name || "product"}`}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-[#ff9b9b]/40 bg-[#ff9b9b]/10 px-2 py-1.5 text-xs font-medium text-[#ff9b9b] transition hover:bg-[#ff9b9b]/20 disabled:opacity-60"
                          >
                            <TrashIcon /> {isDeleting ? "…" : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
