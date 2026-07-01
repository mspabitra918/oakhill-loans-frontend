import { FaTriangleExclamation } from "react-icons/fa6";

export function DualRow({
  label,
  self,
  verified,
  mismatch = false,
  mono = false,
}: {
  label: string;
  self: string;
  verified: React.ReactNode;
  mismatch?: boolean;
  mono?: boolean;
}) {
  const valueClass = `${mono ? "font-mono text-[13px]" : "text-sm"} `;
  return (
    <div className="grid grid-cols-[140px_1fr_1fr] items-center gap-3 border-b border-navy-100 py-2.5 last:border-b-0">
      <span className="text-xs font-medium text-navy-500">{label}</span>
      <span
        className={`${valueClass} ${mismatch ? "text-red-600" : "text-navy-800"}`}
      >
        {self}
      </span>
      <span className="flex items-center gap-2">
        <span
          className={`${valueClass} ${
            mismatch ? "font-semibold text-red-600" : "text-navy-800"
          }`}
        >
          {verified}
        </span>
        {mismatch && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            <FaTriangleExclamation className="h-2.5 w-2.5" />
            mismatch
          </span>
        )}
      </span>
    </div>
  );
}
