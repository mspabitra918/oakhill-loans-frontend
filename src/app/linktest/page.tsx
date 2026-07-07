"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Faithful repro of dashboard.tsx gating + load flow. Fake session/api, no backend.
const fakeSession = { phone: "555", accessToken: "t" };

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams.get("id");

  const [app, setApp] = useState<{ id: string } | null>(null);
  const [apps, setApps] = useState<{ id: string }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noApplication, setNoApplication] = useState(false);
  const [bankModalOpen] = useState(
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
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNoApplication(false);
    const session = fakeSession;
    if (!session) {
      setRedirecting(true);
      router.replace("/login");
      return;
    }
    await new Promise((r) => setTimeout(r, 40));
    if (id) {
      setApp({ id });
    } else {
      const list = [{ id: "a1" }, { id: "a2" }];
      setApp(null);
      setApps(list);
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || redirecting) return <p data-t="loading">Loading…</p>;
  if (noApplication) return <p data-t="none">no app</p>;
  if (!error && !id && apps)
    return (
      <div data-t="list">
        <h1>LIST VIEW ({apps.length})</h1>
        <button
          data-t="select-push"
          onClick={() => router.push("/linktest?id=sel1")}
        >
          SELECT_push
        </button>
      </div>
    );
  if (error || !app) return <p data-t="err">error</p>;

  return (
    <div data-t="detail">
      {bankModalOpen && <div data-t="overlay">modal</div>}
      <a data-t="all-anchor" href="/linktest">
        AL_anchor
      </a>
      <button
        data-t="all-location"
        onClick={() => {
          window.location.href = "/linktest";
        }}
      >
        AL_location
      </button>
      <button
        data-t="all-pushrefresh"
        onClick={() => {
          router.push("/linktest");
          router.refresh();
        }}
      >
        AL_pushrefresh
      </button>
      <Link data-t="all-control" href="/login">
        AL_control_login
      </Link>
      <h1>DETAIL id={app.id}</h1>
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
