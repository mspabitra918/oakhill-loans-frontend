import { STEPS } from "@/src/lib/constants";
import { FaCheck } from "react-icons/fa6";

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition",
                  isDone
                    ? "bg-blue-600 text-white"
                    : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-navy-100 text-navy-400",
                ].join(" ")}
              >
                {isDone ? <FaCheck className="h-3.5 w-3.5" /> : i + 1}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={[
                  "h-0.5 flex-1 rounded-full transition",
                  isDone ? "bg-blue-600" : "bg-navy-100",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
