import type { Metadata } from "next";
import { SEO_PAGES } from "@/src/lib/constants";
import { LandingPage } from "@/src/components/marketing/LandingPage";

const page = SEO_PAGES.find((p) => p.slug === "emergency-loans")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: `/${page.slug}` },
};

export default function Page() {
  return <LandingPage page={page} />;
}
