"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Minimal faithful repro of the dashboard routing mechanics — no backend.
function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams.get("id");

  const [app, setApp] = useState<{ id: string } | null>(null);
  const [apps, setApps] = useState<{ id: string }[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [bankModalOpen, setBankModalOpen] = useState(
    () => searchParams.get("bankModalOpen") === "open",
  );

  const consumed = useRef(false);
  useEffect(() => {
    if (consumed.current) return;
    if (searchParams.get("bankModalOpen") === "open") {
      consumed.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("bankModalOpen");
      const q = params.toString();
      window.history.replaceState(null, "", q ? `${pathname}?${q}` : pathname);
    }
  }, [searchParams, pathname]);

  const load = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 50));
    if (id) {
      setApps(null);
      setApp({ id });
    } else {
      setApp(null);
      setApps([{ id: "a1" }, { id: "a2" }]);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p data-t="loading">Loading…</p>;

  if (!id && apps)
    return (
      <div data-t="list">
        <h1>LIST VIEW ({apps.length} apps)</h1>
      </div>
    );

  if (!app) return <p data-t="none">no app</p>;

  return (
    <div data-t="detail">
      {bankModalOpen && (
        <div
          data-t="overlay"
          onClick={() => setBankModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,20,0.5)",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ padding: 40 }}>
            <button data-t="close" onClick={() => setBankModalOpen(false)}>
              X close
            </button>
          </div>
        </div>
      )}
      <Link data-t="all" href="/linktest">
        All applications
      </Link>
      <h1>DETAIL VIEW id={app.id}</h1>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>boot…</p>}>
      <Inner />
    </Suspense>
  );
}
