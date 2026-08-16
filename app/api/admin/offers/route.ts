import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { destroyImage, getImageResource, getManifestFresh, saveManifest } from "@/lib/cloudinary";
import type { ManifestOffer } from "@/lib/manifest";

export const runtime = "nodejs";

/** Re-render the public pages that read offers from the manifest. */
function revalidatePublic() {
  revalidateTag("manifest");
  revalidatePath("/");
  revalidatePath("/offers");
}

/** Add an offer poster. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { publicId?: unknown };
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  if (!publicId) {
    return NextResponse.json({ error: "publicId is required." }, { status: 400 });
  }

  // Confirm the uploaded asset actually exists before recording it.
  const asset = await getImageResource(publicId).catch(() => null);
  if (!asset) {
    return NextResponse.json({ error: "Uploaded image not found on Cloudinary." }, { status: 400 });
  }

  const manifest = await getManifestFresh();
  if (!Array.isArray(manifest.offers)) manifest.offers = [];
  const offer: ManifestOffer = {
    publicId,
    url: asset.url,
    width: asset.width,
    height: asset.height,
    createdAt: Date.now(),
  };
  manifest.offers.push(offer);

  await saveManifest(manifest);
  revalidatePublic();
  return NextResponse.json({ ok: true, offer });
}

/** Delete an offer poster: remove from manifest first, then destroy the image. */
export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { publicId?: unknown };
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  if (!publicId) {
    return NextResponse.json({ error: "publicId is required." }, { status: 400 });
  }

  const manifest = await getManifestFresh();
  if (Array.isArray(manifest.offers)) {
    manifest.offers = manifest.offers.filter((o) => o.publicId !== publicId);
  }

  await saveManifest(manifest);
  await destroyImage(publicId).catch(() => {});
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
