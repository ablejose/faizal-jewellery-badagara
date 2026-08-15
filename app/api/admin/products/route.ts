import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { destroyImage, getImageResource, getManifestFresh, saveManifest } from "@/lib/cloudinary";
import type { ManifestProduct } from "@/lib/manifest";

export const runtime = "nodejs";

/** Re-render the public pages that read the manifest. */
function revalidatePublic() {
  revalidateTag("manifest");
  revalidatePath("/");
  revalidatePath("/collections/[slug]", "page");
}

/** Coerce an incoming price to a non-negative integer (0 => "Price on request"). */
function coercePrice(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

/** Add a product to a collection. Price is optional; quantity/unit are optional. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    slug?: unknown;
    publicId?: unknown;
    name?: unknown;
    price?: unknown;
    quantity?: unknown;
    unit?: unknown;
  };
  const slug = typeof body.slug === "string" ? body.slug : "";
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = coercePrice(body.price);
  const quantity = typeof body.quantity === "string" ? body.quantity.trim() : "";
  const unit = typeof body.unit === "string" ? body.unit.trim() : "";

  if (!slug || !publicId || !name) {
    return NextResponse.json({ error: "slug, publicId and name are required." }, { status: 400 });
  }

  // Confirm the uploaded asset actually exists before recording it.
  const asset = await getImageResource(publicId).catch(() => null);
  if (!asset) {
    return NextResponse.json({ error: "Uploaded image not found on Cloudinary." }, { status: 400 });
  }

  const manifest = await getManifestFresh();
  const collection = manifest.collections[slug] ?? (manifest.collections[slug] = { products: [] });
  const product: ManifestProduct = {
    publicId,
    url: asset.url,
    width: asset.width,
    height: asset.height,
    name,
    price,
    quantity: quantity || undefined,
    unit: unit || undefined,
    createdAt: Date.now(),
  };
  collection.products.push(product);

  await saveManifest(manifest);
  revalidatePublic();
  return NextResponse.json({ ok: true, product });
}

/** Edit an existing product's name, price, quantity and/or unit. */
export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    slug?: unknown;
    publicId?: unknown;
    name?: unknown;
    price?: unknown;
    quantity?: unknown;
    unit?: unknown;
  };
  const slug = typeof body.slug === "string" ? body.slug : "";
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  if (!slug || !publicId) {
    return NextResponse.json({ error: "slug and publicId are required." }, { status: 400 });
  }

  const manifest = await getManifestFresh();
  const collection = manifest.collections[slug];
  const product = collection?.products.find((p) => p.publicId === publicId);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  if (typeof body.name === "string" && body.name.trim()) {
    product.name = body.name.trim();
  }
  if (body.price !== undefined) {
    product.price = coercePrice(body.price);
  }
  if (body.quantity !== undefined) {
    const q = typeof body.quantity === "string" ? body.quantity.trim() : "";
    product.quantity = q || undefined;
  }
  if (body.unit !== undefined) {
    const u = typeof body.unit === "string" ? body.unit.trim() : "";
    product.unit = u || undefined;
  }

  await saveManifest(manifest);
  revalidatePublic();
  return NextResponse.json({ ok: true, product });
}

/** Delete a product: remove from manifest first, then destroy the image. */
export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { slug?: unknown; publicId?: unknown };
  const slug = typeof body.slug === "string" ? body.slug : "";
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  if (!slug || !publicId) {
    return NextResponse.json({ error: "slug and publicId are required." }, { status: 400 });
  }

  const manifest = await getManifestFresh();
  const collection = manifest.collections[slug];
  if (collection) {
    collection.products = collection.products.filter((p) => p.publicId !== publicId);
  }

  // Manifest first (site is consistent even if the destroy fails), then destroy.
  await saveManifest(manifest);
  await destroyImage(publicId).catch(() => {});
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
