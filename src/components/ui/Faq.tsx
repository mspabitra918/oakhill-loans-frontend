"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

type Item = { question: string; answer: string };

// Accessible accordion. Pure presentation — pass any list of Q&A items.
export function Faq({
  items,
  title = "Frequently asked questions",
}: {
  items: readonly Item[];
  title?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-navy-900">
          {title}
        </h2>
        <div className="mt-10 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-navy-900">
                    {item.question}
                  </span>
                  <FaChevronDown
                    className={`h-4 w-4 shrink-0 text-blue-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-navy-600">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
