import Link from "next/link";
import { FaArrowRightLong, FaCheck } from "react-icons/fa6";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { CtaBand } from "@/src/components/ui/CtaBand";
import { Faq } from "@/src/components/ui/Faq";
import { TrustStrip } from "@/src/components/ui/TrustStrip";
import { JsonLd } from "@/src/components/layout/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/src/lib/schema";
import { HOW_IT_WORKS, FAQS } from "@/src/lib/constants";
import type { SeoPage } from "@/src/lib/constants";

// Shared template behind every SEO/AEO keyword page. Driven entirely off a
// SeoPage record plus the shared HOW_IT_WORKS / FAQS constants so the 10% APR /
// $2k–$50k / 24-hour terms stay identical across every landing page.
export function LandingPage({ page }: { page: SeoPage }) {
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.h1}
        highlight={page.span}
        intro={page.intro}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lift transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            Apply Now <FaArrowRightLong />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-7 py-3.5 text-base font-semibold text-navy-800 transition hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-300 focus-visible:ring-offset-2"
          >
            How it works <FaArrowRightLong />
          </Link>
        </div>
      </PageHeader>

      {/* Benefits — three keyword-specific value props. */}
      <section className="container-x py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {page.benefits.map(({ title, blurb }) => (
            <div
              key={title}
              className="rounded-3xl border border-navy-100 bg-white p-8 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800">
                <FaCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-6 text-xl font-bold text-navy-900">{title}</h2>
              <p className="mt-3 text-base leading-relaxed text-navy-600">
                {blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Three-step process, shared with the homepage and /how-it-works. */}
      <section className="container-x pb-16 lg:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">
            How it works
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, title, blurb }) => (
            <div
              key={step}
              className="relative rounded-3xl border border-navy-100 bg-white p-8 shadow-card"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                {step}
              </span>
              <h3 className="mt-6 text-xl font-bold text-navy-900">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-navy-600">
                {blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* <TrustStrip /> */}

      <Faq items={FAQS} />

      <CtaBand />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.eyebrow, path: `/${page.slug}` },
          ]),
          // FAQS is readonly; spread to a mutable array for the builder's signature.
          faqSchema([...FAQS]),
        ]}
      />
    </>
  );
}
