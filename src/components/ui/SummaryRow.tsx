export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-navy-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-navy-900">
        {value || <span className="font-normal text-navy-300">—</span>}
      </dd>
    </div>
  );
}
