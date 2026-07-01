interface BaseProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
}
export function SelectField({
  label,
  name,
  value,
  error,
  onChange,
  options,
  placeholder = "Select…",
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-navy-800"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-300 transition focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-200"
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
