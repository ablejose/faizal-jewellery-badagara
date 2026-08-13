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

/** Add a product to a collection. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    slug?: unknown;
    publicId?: unknown;
    name?: unknown;
    price?: unknown;
  };
  const slug = typeof body.slug === "string" ? body.slug : "";
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Math.round(Number(body.price));

  if (!slug || !publicId || !name || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "slug, publicId, name and a positive price are required." }, { status: 400 });
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
    createdAt: Date.now(),
  };
  collection.products.push(product);

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
