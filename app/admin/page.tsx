import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

// Keep the admin panel out of search engines and the sitemap.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminPanel />
    </main>
  );
}
