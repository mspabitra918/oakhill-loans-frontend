// import { PARTNERS } from "@/src/lib/constants";

// Wordmark strip of publications the brand has been featured in.
export function TrustStrip({
  label = "Our lending partners",
}: {
  label?: string;
}) {
  return (
    <div className="container-x py-12">
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-navy-400">
        {label}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {/* {PARTNERS.map((name) => (
          <span
            key={name}
            className="text-lg font-semibold tracking-tight text-navy-300 transition hover:text-navy-500"
          >
            {name}
          </span>
        ))} */}
      </div>
    </div>
  );
}
