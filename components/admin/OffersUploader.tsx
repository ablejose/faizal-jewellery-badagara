"use client";

import { type FormEvent, useRef, useState } from "react";
import Image from "next/image";
import type { ManifestOffer } from "@/lib/manifest";
import { apiJson, signAndUploadOffer } from "@/components/admin/cloud";

interface Props {
  offers: ManifestOffer[];
  loading: boolean;
  onChanged: () => void | Promise<void>;
}

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

export function OffersUploader({ offers, loading, onChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!file) return setError("Choose a poster image.");
    setBusy(true);
    try {
      const uploaded = await signAndUploadOffer(file);
      await apiJson("/api/admin/offers", "POST", { publicId: uploaded.publicId });
      setStatus("Poster added. It is now live on the Offers page.");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add poster.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (offer: ManifestOffer) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Delete this offer poster?");
      if (!ok) return;
    }
    setStatus("");
    setError("");
    setDeletingId(offer.publicId);
    try {
      await apiJson("/api/admin/offers", "DELETE", { publicId: offer.publicId });
      setStatus("Poster deleted.");
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poster.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-card border border-gold/30 bg-[#0b0b12] p-6 md:p-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="label-eyebrow text-gold">Promotions</span>
          <h2 className="mt-1 font-display text-2xl text-ivory">Offer posters</h2>
        </div>
        <span className="text-xs uppercase tracking-widest text-ivory/40">
          {offers.length} {offers.length === 1 ? "poster" : "posters"} · /offers
        </span>
      </header>

      <p className="mt-2 text-sm text-ivory/50">
        Upload full posters (any size). They show full-screen on the Offers page; with two or more,
        visitors get arrows to move between them.
      </p>

      <form onSubmit={add} className="mt-5 flex flex-wrap items-end gap-4">
        <div className="min-w-[220px] flex-1">
          <label className="block text-sm text-ivory/80" htmlFor="offer-file">
            Poster image
          </label>
          <input
            id="offer-file"
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
          className="rounded-full bg-gold px-6 py-2.5 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Add poster"}
        </button>
      </form>

      {status ? <p className="mt-3 text-sm text-gold">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#ff9b9b]">{error}</p> : null}

      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-ivory/40">Current posters</p>
        {loading ? (
          <p className="text-sm text-ivory/50">Loading current posters…</p>
        ) : offers.length === 0 ? (
          <p className="text-sm text-ivory/50">
            No posters yet. Uploaded posters appear here with a Delete button.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {offers.map((offer) => {
              const isDeleting = deletingId === offer.publicId;
              return (
                <li
                  key={offer.publicId}
                  className="flex flex-col overflow-hidden rounded-lg border border-border bg-black/20"
                >
                  <div className="relative aspect-[3/4] bg-black/40">
                    <Image
                      src={offer.url}
                      alt="Offer poster"
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => remove(offer)}
                      disabled={isDeleting}
                      aria-label="Delete poster"
                      className="flex w-full items-center justify-center gap-1 rounded-md border border-[#ff9b9b]/40 bg-[#ff9b9b]/10 px-2 py-1.5 text-xs font-medium text-[#ff9b9b] transition hover:bg-[#ff9b9b]/20 disabled:opacity-60"
                    >
                      <TrashIcon /> {isDeleting ? "Removing…" : "Delete"}
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
