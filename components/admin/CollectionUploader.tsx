"use client";

import { type FormEvent, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import type { ManifestProduct } from "@/lib/manifest";
import { apiJson, signAndUpload } from "@/components/admin/cloud";
import { formatRupees } from "@/lib/format";

interface Props {
  collection: Collection;
  products: ManifestProduct[];
  loading: boolean;
  onChanged: () => void | Promise<void>;
}

export function CollectionUploader({ collection, products, loading, onChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setPrice("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setError("");
    const priceNum = Number(price);
    if (!file) return setError("Choose an image.");
    if (!name.trim()) return setError("Enter a product name.");
    if (!(priceNum > 0)) return setError("Enter a valid price.");

    setBusy(true);
    try {
      const uploaded = await signAndUpload(collection.slug, file);
      await apiJson("/api/admin/products", "POST", {
        slug: collection.slug,
        publicId: uploaded.publicId,
        name: name.trim(),
        price: Math.round(priceNum),
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

      <form onSubmit={add} className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div>
          <label className="block text-sm text-ivory/80" htmlFor={`name-${collection.slug}`}>
            Product name
          </label>
          <input
            id={`name-${collection.slug}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-black/40 px-3 py-2 text-ivory outline-none focus:border-gold"
            disabled={busy}
          />
        </div>
        <div>
          <label className="block text-sm text-ivory/80" htmlFor={`price-${collection.slug}`}>
            Price (₹)
          </label>
          <input
            id={`price-${collection.slug}`}
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-40 rounded-lg border border-border bg-black/40 px-3 py-2 text-ivory outline-none focus:border-gold"
            disabled={busy}
          />
        </div>
        <div>
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
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gold px-6 py-2.5 font-medium text-black transition hover:opacity-90 disabled:opacity-50 md:col-span-3 md:justify-self-start"
        >
          {busy ? "Uploading…" : "Add product"}
        </button>
      </form>

      {status ? <p className="mt-3 text-sm text-gold">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#ff9b9b]">{error}</p> : null}

      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-ivory/40">In this category</p>
        {loading ? (
          <p className="text-sm text-ivory/50">Loading current photos…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ivory/50">
            No products yet. Uploaded items appear here with a Delete button.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const isDeleting = deletingId === product.publicId;
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
                    <p className="truncate text-sm text-ivory">{product.name || "Untitled"}</p>
                    <p className="text-xs text-gold">
                      {product.price > 0 ? formatRupees(product.price) : "Price on request"}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(product)}
                      disabled={isDeleting}
                      aria-label={`Delete ${product.name || "product"}`}
                      className="mt-2 w-full rounded-md border border-[#ff9b9b]/40 bg-[#ff9b9b]/10 px-2 py-1.5 text-xs font-medium text-[#ff9b9b] transition hover:bg-[#ff9b9b]/20 disabled:opacity-60"
                    >
                      {isDeleting ? "Removing…" : "Delete"}
                    </button>
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
