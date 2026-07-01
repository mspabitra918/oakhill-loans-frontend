// Server-component wrapper for the /admin route. The dashboard itself is a
// client component (it owns the selection + Release Funds state), and client
// components cannot export `metadata` — so the route's metadata lives here.
// The admin tooling is internal, so we keep it out of search indexes entirely.
export const metadata: import("next").Metadata = {
  title: "Underwriting · Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
