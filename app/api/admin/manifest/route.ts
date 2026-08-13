import { NextResponse } from "next/server";
import { getManifestFresh } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  const manifest = await getManifestFresh();
  return NextResponse.json(manifest);
}
