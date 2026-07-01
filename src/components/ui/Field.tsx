import { FaTriangleExclamation } from "react-icons/fa6";
import { Label } from "./Label";

export function Field({
  id,
  label,
  hint,
  error,
  helper,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
          <FaTriangleExclamation className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-xs text-navy-400">{helper}</p>
      ) : null}
    </div>
  );
}
