import { NextResponse } from "next/server";
import { offerPublicId, productPublicId, signUpload } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { slug?: unknown; kind?: unknown };
  const kind = typeof body.kind === "string" ? body.kind : "product";

  try {
    if (kind === "offer") {
      const publicId = offerPublicId();
      const signed = signUpload({ public_id: publicId });
      return NextResponse.json({ ...signed, publicId });
    }

    const slug = typeof body.slug === "string" ? body.slug : "";
    if (!slug) return NextResponse.json({ error: "Missing collection slug." }, { status: 400 });
    const publicId = productPublicId(slug);
    const signed = signUpload({ public_id: publicId });
    return NextResponse.json({ ...signed, publicId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
