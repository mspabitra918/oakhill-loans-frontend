"use client";

import { useMemo } from "react";

export function DetailPanel({
  detail,
  gate,
  isTerminal,
  busy,
  confirming,
  setConfirming,
  onRelease,
  declining,
  setDeclining,
  declineReason,
  setDeclineReason,
  onDecline,
  onAdvanceSign,
}: {
  detail: DualView;
  gate: { ok: boolean; reason: string };
  isTerminal: boolean;
  busy: boolean;
  confirming: boolean;
  setConfirming: (v: boolean) => void;
  onRelease: () => void;
  declining: boolean;
  setDeclining: (v: boolean) => void;
  declineReason: string;
  setDeclineReason: (v: string) => void;
  onDecline: () => void;
  onAdvanceSign: () => void;
}) {
  const { application: app, selfReported: self, apiVerified } = detail;
  const fullName = `${self.firstName} ${self.lastName ?? ""}`.trim();

  // Join self-reported banks with their API verification result by routing #.
  const verifiedByRouting = useMemo(
    () =>
      new Map(apiVerified.banks.map((b) => [b.routingNumber, b.apiVerified])),
    [apiVerified.banks],
  );
  const allVerified =
    apiVerified.banks.length > 0 &&
    apiVerified.banks.every((b) => b.apiVerified);

  return (
    <>
      {/* Header card */}
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-navy-900">
                {fullName || "Applicant"}
              </h2>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-1 text-sm text-navy-500">
              <span className="font-mono">{app.id}</span> · {self.email} ·{" "}
              {self.phone}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Requested
            </div>
            <div className="text-2xl font-bold text-navy-900">
              {formatUSD(app.requestedAmount)}
            </div>
          </div>
        </div>

        {/* DTI + payment + verification */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
            <div className="text-xs font-medium text-navy-500">
              Computed DTI
            </div>
            <div
              className={`mt-1 text-2xl font-bold ${
                dtiOver(app.calculatedDti) ? "text-amber-600" : "text-navy-900"
              }`}
            >
              {Number.isFinite(app.calculatedDti)
                ? `${app.calculatedDti.toFixed(1)}%`
                : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-navy-400">
              threshold {LOAN.maxDtiPercent}%
            </div>
          </div>
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
            <div className="text-xs font-medium text-navy-500">
              Monthly payment
            </div>
            <div className="mt-1 text-2xl font-bold text-navy-900">
              {formatUSD(Math.round(app.monthlyPayment))}
            </div>
            <div className="mt-0.5 text-[11px] text-navy-400">
              {LOAN.apr}% APR · {app.loanTermMonths} mo
            </div>
          </div>
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
            <div className="text-xs font-medium text-navy-500">
              Bank verification
            </div>
            <div
              className={`mt-1 flex items-center gap-1.5 text-base font-bold ${
                allVerified ? "text-green-600" : "text-amber-600"
              }`}
            >
              {allVerified ? (
                <>
                  <FaCircleCheck className="h-4 w-4" /> Verified
                </>
              ) : (
                <>
                  <FaTriangleExclamation className="h-4 w-4" /> Pending
                </>
              )}
            </div>
            <div className="mt-0.5 text-[11px] text-navy-400">
              {self.banks[0]?.bankName ?? "No bank on file"}
            </div>
          </div>
        </div>

        {/* Gatekeeper reasoning */}
        {app.statusReason && (
          <div className="mt-4 rounded-xl border border-navy-200 bg-linear-to-r from-navy-50 to-white p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-500">
              <FaUserShield className="h-3.5 w-3.5" />
              Gatekeeper reasoning
            </div>
            <p className="mt-1.5 text-sm text-navy-700">{app.statusReason}</p>
          </div>
        )}
      </div>

      {/* Dual view */}
      <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <h3 className="text-sm font-bold text-navy-900">
          Verification dual view
        </h3>
        <p className="mt-0.5 text-xs text-navy-500">
          Self-reported figures vs API-verified bank signals. Income and housing
          are self-reported; the bank API verifies the routing number.
        </p>

        <div className="mt-4 grid grid-cols-[140px_1fr_1fr] gap-3 border-b border-navy-200 pb-2">
          <span />
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
            Self-reported
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <FaBuildingColumns className="h-3 w-3" />
            API-verified
          </span>
        </div>

        <div className="mt-1">
          <DualRow
            label="Gross income / mo"
            self={formatUSD(self.grossMonthlyIncome)}
            verified={<span className="text-navy-400">Self-reported only</span>}
          />
          <DualRow
            label="Housing payment"
            self={formatUSD(self.monthlyHousingPayment)}
            verified={<span className="text-navy-400">Self-reported only</span>}
          />
          <DualRow
            label="Other debts / mo"
            self={formatUSD(self.otherMonthlyDebts)}
            verified={<span className="text-navy-400">Self-reported only</span>}
          />
          <DualRow
            label="Housing status"
            self={HOUSING_LABEL[self.housingStatus] ?? self.housingStatus}
            verified={<span className="text-navy-400">Self-reported only</span>}
          />
        </div>

        {/* Per-bank rows */}
        {self.banks.length === 0 ? (
          <p className="mt-4 text-xs text-navy-400">
            No bank details submitted yet.
          </p>
        ) : (
          self.banks.map((bank, i) => {
            const verified = verifiedByRouting.get(bank.routingNumber);
            return (
              <div
                key={`${bank.routingNumber}-${i}`}
                className="mt-5 rounded-xl border border-navy-100 bg-navy-50/40 p-4"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Bank account {self.banks.length > 1 ? `#${i + 1}` : ""}
                </div>
                <DualRow
                  label="Bank name"
                  self={bank.bankName}
                  verified={<span className="text-navy-400">—</span>}
                />
                <DualRow
                  label="Routing number"
                  self={bank.routingNumber}
                  mono
                  verified={
                    verified === undefined ? (
                      <span className="text-navy-400">Not checked</span>
                    ) : verified ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                        <FaCircleCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                        <FaCircleXmark className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    )
                  }
                  mismatch={verified === false}
                />
                <DualRow
                  label="Account (masked)"
                  self={bank.accountNumberMasked}
                  mono
                  verified={<span className="text-navy-400">—</span>}
                />
                <DualRow
                  label="Account age"
                  self={ACCOUNT_AGE_LABEL[bank.accountAge] ?? bank.accountAge}
                  verified={<span className="text-navy-400">—</span>}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Actions: Decline + Release Funds */}
      <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Disbursement</h3>
            <p
              className={`mt-0.5 flex items-center gap-1.5 text-xs ${
                gate.ok ? "text-green-600" : "text-navy-500"
              }`}
            >
              {gate.ok ? (
                <FaCircleCheck className="h-3.5 w-3.5" />
              ) : (
                <FaCircleXmark className="h-3.5 w-3.5" />
              )}
              {gate.reason}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Move to Sign Agreement */}
            {!isTerminal && app.status !== "SIGN_LOAN_AGREEMENT" && (
              <button
                type="button"
                onClick={onAdvanceSign}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
              >
                <FaFileSignature className="h-4 w-4" />
                {busy ? "Working…" : "Move to Sign Agreement"}
              </button>
            )}

            {/* Decline */}
            {!isTerminal && !declining && (
              <button
                type="button"
                onClick={() => setDeclining(true)}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <FaCircleXmark className="h-4 w-4" />
                Decline
              </button>
            )}

            {/* Release Funds */}
            {!confirming ? (
              <button
                type="button"
                disabled={!gate.ok || busy}
                onClick={() => setConfirming(true)}
                title={gate.ok ? undefined : gate.reason}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lift transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  gate.ok
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400"
                    : "cursor-not-allowed bg-navy-100 text-navy-400 shadow-none"
                }`}
              >
                <FaMoneyBillTransfer className="h-4 w-4" />
                Release Funds
              </button>
            ) : (
              <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-900">
                  Confirm ACH disbursement of {formatUSD(app.requestedAmount)}{" "}
                  to {fullName}? This cannot be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={onRelease}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheck className="h-3.5 w-3.5" />
                    {busy ? "Releasing…" : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-50"
                  >
                    <FaXmark className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decline reason form */}
        {declining && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <label className="text-sm font-medium text-red-900">
              Reason for declining {fullName}
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={2}
              placeholder="e.g. Verified income below minimum, DTI too high…"
              className="mt-2 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-400 focus:border-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onDecline}
                disabled={busy || !declineReason.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <FaCheck className="h-3.5 w-3.5" />
                {busy ? "Declining…" : "Confirm decline"}
              </button>
              <button
                type="button"
                onClick={() => setDeclining(false)}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-50"
              >
                <FaXmark className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { clearSession, getSession, Session } from "@/src/lib/session";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError, DualView } from "@/src/lib/api";

import { formatUSD, LOAN } from "@/src/lib/constants";
import {
  FaArrowsRotate,
  FaBuildingColumns,
  FaCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaFileSignature,
  FaMoneyBillTransfer,
  FaTriangleExclamation,
  FaUserShield,
  FaXmark,
} from "react-icons/fa6";
import { DualRow } from "./ui/DualRow";
import {
  ACCOUNT_AGE_LABEL,
  disbursementGate,
  dtiOver,
  flattenQueues,
  HOUSING_LABEL,
  TERMINAL_STATUSES,
} from "./constants";
import { StatusBadge } from "./ui/StatusBadge";
import { Sidebar } from "./ui/Sidebar";
import { Topbar } from "./ui/TopBar";
import { useRouter } from "next/navigation";
type QueueRow = {
  id: string;
  status: string;
  requestedAmount: number;
  calculatedDti: number;
  statusReason: string | null;
};

export default function AdminUnderwritingPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  const [rows, setRows] = useState<QueueRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DualView | null>(null);

  const [loadingQueues, setLoadingQueues] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // --- Auth guard ---------------------------------------------------------
  useEffect(() => {
    const s = getSession("admin");
    if (!s || s.role === "customer") {
      router.replace("/admin/login");
      return;
    }
    setSession(s);
    setReady(true);
  }, [router]);

  const token = session?.accessToken;

  // --- Data loading -------------------------------------------------------
  const loadQueues = useCallback(
    async (preserveSelection = false) => {
      if (!token) return;
      setLoadingQueues(true);
      setError(null);
      try {
        const queues = await api.getQueues(token);
        const flat = flattenQueues(queues);
        setRows(flat);
        if (!preserveSelection) {
          setSelectedId((curr) => curr ?? flat[0]?.id ?? null);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession("admin");
          router.replace("/admin/login");
          return;
        }
        setError(
          err instanceof ApiError ? err.message : "Failed to load the queue.",
        );
      } finally {
        setLoadingQueues(false);
      }
    },
    [token, router],
  );

  const loadDetail = useCallback(
    async (id: string) => {
      if (!token) return;
      setLoadingDetail(true);
      setError(null);
      try {
        const dv = await api.getDualView(id, token);
        setDetail(dv);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession("admin");
          router.replace("/admin/login");
          return;
        }
        setError(
          err instanceof ApiError ? err.message : "Failed to load application.",
        );
        setDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    },
    [token, router],
  );

  useEffect(() => {
    if (ready) void loadQueues();
  }, [ready, loadQueues]);

  useEffect(() => {
    if (ready && selectedId) void loadDetail(selectedId);
  }, [ready, selectedId, loadDetail]);

  // --- Actions ------------------------------------------------------------
  function selectApp(id: string) {
    setSelectedId(id);
    setConfirming(false);
    setDeclining(false);
    setDeclineReason("");
    setToast(null);
  }

  async function releaseFunds() {
    if (!token || !detail) return;
    setBusy(true);
    setError(null);
    try {
      await api.releaseFunds(detail.application.id, token);
      const name =
        `${detail.selfReported.firstName} ${detail.selfReported.lastName}`.trim();
      setToast(
        `${formatUSD(detail.application.requestedAmount)} released to ${name} via ACH.`,
      );
      setConfirming(false);
      await Promise.all([loadQueues(true), loadDetail(detail.application.id)]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Fund release failed.");
    } finally {
      setBusy(false);
    }
  }

  async function decline() {
    if (!token || !detail || !declineReason.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.decline(detail.application.id, token, declineReason.trim());
      setToast(`Application ${detail.application.id} declined.`);
      setDeclining(false);
      setDeclineReason("");
      await Promise.all([loadQueues(true), loadDetail(detail.application.id)]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Decline failed.");
    } finally {
      setBusy(false);
    }
  }

  async function advanceToSign() {
    if (!token || !detail) return;
    setBusy(true);
    setError(null);
    try {
      await api.advance(detail.application.id, token, "SIGN_LOAN_AGREEMENT");
      setToast(`Application ${detail.application.id} moved to Sign Agreement.`);
      await Promise.all([loadQueues(true), loadDetail(detail.application.id)]);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not advance application.",
      );
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    clearSession("admin");
    router.replace("/admin/login");
  }

  // --- Derived ------------------------------------------------------------
  const gate = detail ? disbursementGate(detail) : null;
  const isTerminal = detail
    ? TERMINAL_STATUSES.includes(detail.application.status)
    : true;

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-50 text-navy-500">
        <span className="flex items-center gap-2 text-sm">
          <FaArrowsRotate className="h-4 w-4 animate-spin" />
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-50 text-navy-600">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          session={session}
          onRefresh={() => void loadQueues(true)}
          refreshing={loadingQueues}
          onSignOut={signOut}
        />

        {toast && (
          <div className="flex items-center justify-between gap-3 border-b border-green-200 bg-green-50 px-6 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-green-800">
              <FaCircleCheck className="h-4 w-4" />
              {toast}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-green-700 hover:text-green-900"
              aria-label="Dismiss"
            >
              <FaXmark className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700">
            <FaTriangleExclamation className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 xl:grid-cols-[minmax(360px,440px)_1fr]">
          {/* Queue list */}
          <section className="min-h-0 overflow-y-auto border-r border-navy-100 bg-white">
            <div className="flex items-center justify-between border-b border-navy-100 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                Applications
              </span>
              <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-600">
                {rows.length}
              </span>
            </div>

            {loadingQueues && rows.length === 0 ? (
              <div className="p-6 text-sm text-navy-400">Loading queue…</div>
            ) : rows.length === 0 ? (
              <div className="p-6 text-sm text-navy-400">
                No applications in the queue.
              </div>
            ) : (
              <ul>
                {rows.map((row) => {
                  const isSelected = row.id === selectedId;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => selectApp(row.id)}
                        className={`w-full border-b border-navy-100 px-5 py-4 text-left transition ${
                          isSelected
                            ? "bg-blue-50/60 ring-1 ring-inset ring-blue-200"
                            : "hover:bg-navy-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-mono text-xs font-semibold text-navy-900">
                              {row.id}
                            </div>
                            {row.statusReason && (
                              <div className="mt-0.5 truncate text-xs text-navy-500">
                                {row.statusReason}
                              </div>
                            )}
                          </div>
                          <StatusBadge status={row.status} />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-navy-800">
                            {formatUSD(row.requestedAmount)}
                          </span>
                          <span
                            className={`font-medium ${
                              dtiOver(row.calculatedDti)
                                ? "text-amber-600"
                                : "text-navy-500"
                            }`}
                          >
                            DTI{" "}
                            {Number.isFinite(row.calculatedDti)
                              ? `${row.calculatedDti.toFixed(0)}%`
                              : "—"}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Detail panel */}
          <section className="min-h-0 overflow-y-auto p-6">
            {loadingDetail && !detail ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-10 text-center text-sm text-navy-400 shadow-card">
                Loading application…
              </div>
            ) : !detail ? (
              <div className="rounded-2xl border border-navy-100 bg-white p-10 text-center text-sm text-navy-400 shadow-card">
                Select an application from the queue.
              </div>
            ) : (
              <DetailPanel
                detail={detail}
                gate={gate!}
                isTerminal={isTerminal}
                busy={busy}
                confirming={confirming}
                setConfirming={setConfirming}
                onRelease={releaseFunds}
                declining={declining}
                setDeclining={setDeclining}
                declineReason={declineReason}
                setDeclineReason={setDeclineReason}
                onDecline={decline}
                onAdvanceSign={advanceToSign}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
