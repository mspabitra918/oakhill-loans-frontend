import { STATUS_BADGE, statusLabel } from "../constants";

export function StatusBadge({ status }: { status: string }) {
  const classes =
    STATUS_BADGE[status] ?? "bg-navy-100 text-navy-600 border-navy-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${classes}`}
    >
      {statusLabel(status)}
    </span>
  );
}
