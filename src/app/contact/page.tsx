"use client";

import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaArrowRightLong,
  FaCheck,
} from "react-icons/fa6";
import { BRAND, telHref } from "@/src/lib/constants";

type ContactMethod = {
  icon: typeof FaPhone;
  label: string;
  lines: { text: string; href?: string }[];
};

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: FaPhone,
    label: "Call us",
    lines: [
      { text: BRAND.phone, href: telHref(BRAND.phone) },
      { text: BRAND.phoneAlt, href: telHref(BRAND.phoneAlt) },
    ],
  },
  {
    icon: FaEnvelope,
    label: "Email us",
    lines: [{ text: BRAND.email, href: `mailto:${BRAND.email}` }],
  },
  {
    icon: FaLocationDot,
    label: "Mailing address",
    lines: [
      { text: BRAND.address.street },
      {
        text: `${BRAND.address.city}, ${BRAND.address.region} ${BRAND.address.postalCode}`,
      },
    ],
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST to support inbox / NestJS
    setSubmitted(true);
  }

  return (
    <>
      {/* Plain header (kept inside the Client Component to avoid any
          server/client friction with shared layout components). */}
      <section className="bg-linear-to-b from-navy-50 to-white">
        <div className="container-x py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Contact us
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-navy-900 md:text-5xl">
              We&apos;re here to help
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy-600">
              Questions about your application or an existing loan? Reach our
              support team by phone, email, or mail — we serve borrowers in all
              50 states.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — contact methods */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Get in touch
            </h2>
            <ul className="mt-8 space-y-6">
              {CONTACT_METHODS.map(({ icon: Icon, label, lines }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {label}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {lines.map((line) =>
                        line.href ? (
                          <a
                            key={line.text}
                            href={line.href}
                            className="block text-base text-navy-600 transition hover:text-blue-600"
                          >
                            {line.text}
                          </a>
                        ) : (
                          <p
                            key={line.text}
                            className="text-base text-navy-600"
                          >
                            {line.text}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50 p-5">
              <p className="text-sm font-semibold text-navy-900">
                Support hours
              </p>
              <p className="mt-1 text-base text-navy-600">
                Mon–Fri, 8am–6pm PT
              </p>
            </div>
          </div>

          {/* RIGHT — contact form */}
          <div className="rounded-3xl border border-navy-100 bg-white p-7 shadow-card sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-800">
                  <FaCheck className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-navy-900">
                  Message sent
                </h2>
                <p className="mt-2 text-base text-navy-600">
                  Thanks — we&apos;ll reply within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-navy-900"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 block w-full resize-y rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lift transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                  Send message <FaArrowRightLong />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
