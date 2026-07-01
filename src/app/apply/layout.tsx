// Server-component wrapper for the /apply route. The page itself is a client
// component (it owns the multi-step form state), and client components cannot
// export `metadata` — so the route's SEO metadata lives here instead.
export const metadata: import("next").Metadata = {
  title: "Apply Now",
  description:
    "Apply for a fixed 10% APR personal loan from $2,000 to $50,000. No collateral, no upfront fees, and funding within 24 hours. Takes about 3 minutes.",
  alternates: { canonical: "/apply" },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
