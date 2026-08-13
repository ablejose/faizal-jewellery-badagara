"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLLECTIONS } from "@/config/collections";
import { CollectionUploader } from "@/components/admin/CollectionUploader";
import { apiJson } from "@/components/admin/cloud";
import type { Manifest } from "@/lib/manifest";

export function AdminPanel() {
  const router = useRouter();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await apiJson<Manifest>("/api/admin/manifest", "GET");
      setManifest(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = async () => {
    setSigningOut(true);
    await apiJson("/api/admin/logout", "POST").catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="container-lux py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="label-eyebrow text-gold">Faizal Jewellery</p>
          <h1 className="mt-2 font-display text-4xl text-ivory">Collection manager</h1>
          <p className="mt-2 text-sm text-ivory/60">
            Add or remove product photos. Changes go live within a few seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="rounded-full border border-border px-5 py-2 text-sm text-ivory/80 transition hover:border-gold hover:text-ivory disabled:opacity-50"
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </header>

      {error ? <p className="mt-6 text-sm text-[#ff9b9b]">{error}</p> : null}

      <div className="mt-10 flex flex-col gap-8">
        {COLLECTIONS.map((collection) => (
          <CollectionUploader
            key={collection.slug}
            collection={collection}
            products={manifest?.collections[collection.slug]?.products ?? []}
            loading={manifest === null}
            onChanged={refresh}
          />
        ))}
      </div>
    </div>
  );
}
