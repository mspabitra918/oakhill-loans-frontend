export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-navy-900"
    >
      <span>{children}</span>
      {hint && (
        <span className="text-xs font-normal text-navy-400">{hint}</span>
      )}
    </label>
  );
}
