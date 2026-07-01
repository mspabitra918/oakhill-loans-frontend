// Standard interior-page hero: a soft navy gradient band with an eyebrow,
// headline, and optional intro paragraph. Used by every marketing/legal page so
// the typographic rhythm stays identical site-wide.
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
  highlight,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  highlight: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-144 w-144 rounded-full bg-blue-500/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 h-[32rem] w-[32rem] rounded-full bg-star-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]"
      />
      <div className="container-x relative py-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-star-400" />
            {eyebrow && (
              <span className="text-sm font-medium text-navy-100">
                {eyebrow}
              </span>
            )}
          </div>
          <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {title}{" "}
            <span className="bg-linear-to-r from-blue-400 to-star-300 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">
              {intro}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
