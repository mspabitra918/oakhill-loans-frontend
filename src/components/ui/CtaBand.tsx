import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { LOAN, formatUSD } from "@/src/lib/constants";

// The conversion call-to-action repeated near the bottom of most pages.
export function CtaBand({
  title = "Ready to get started?",
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const copy =
    subtitle ??
    `Check your rate for a ${formatUSD(LOAN.minAmount)}–${formatUSD(
      LOAN.maxAmount,
    )} loan at a fixed ${LOAN.apr}% APR. It won't affect your credit score.`;

  return (
    <section className="container-x py-16">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-navy-800 to-navy-950 px-8 py-12 text-center shadow-lift sm:px-12 sm:py-16">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-200">
          {copy}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            Apply Now <FaArrowRightLong />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-navy-800"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
