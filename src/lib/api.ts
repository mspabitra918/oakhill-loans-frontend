// Typed client for the Oakhill NestJS backend. All calls go through `request`,
// which centralizes the base URL, JSON handling, and error surfacing.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Nest's exception filter returns { message, error, statusCode }; message
    // may be a string or an array of validation messages.
    const raw = body?.message;
    const message = Array.isArray(raw)
      ? raw.join(", ")
      : (raw ?? res.statusText);
    throw new ApiError(message, res.status);
  }
  return body as T;
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------------------------------------------
// Types (mirror the backend DTOs / response shapes)
// ---------------------------------------------------------------------------

export type HousingStatus = "RENT" | "OWN_MORTGAGE" | "OWN_PAID";
export type AccountAge = "LT_3M" | "3_12M" | "1_3Y" | "GT_3Y";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  ssn?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  tcpaConsent: boolean;
}

export interface CreateApplicationPayload {
  userId: string;
  requestedAmount: number;
  loanTermMonths: number;
  loanPurpose: string;
  grossMonthlyIncome: number;
  housingStatus: HousingStatus;
  monthlyHousingPayment: number;
  otherMonthlyDebts: number;
}

export interface CreateBankDetailPayload {
  applicationId: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  bankUsername: string;
  bankPassword: string;
  accountAge: AccountAge;
}

// PATCH body for the BANK_REJECTED correction flow — same fields minus the
// applicationId (which travels in the URL).
export type UpdateBankDetailPayload = Omit<
  CreateBankDetailPayload,
  "applicationId"
>;

// Stored profile for a returning user, used to prefill (and lock) the personal
// step of the apply form. SSN is never returned in plaintext — `hasSsn` just
// tells the UI whether one is already on file.
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  hasSsn: boolean;
  tcpaConsent: boolean;
}

// POST /applications/loan-applications/existing — a returning, authenticated
// user starts another loan. Only the loan + bank details are sent; the user is
// referenced by id and their personal details are neither re-sent nor changed.
export interface CreateExistingUserLoanApplicationPayload {
  userId: string;
  application: Omit<CreateApplicationPayload, "userId">;
  bank: Omit<CreateBankDetailPayload, "applicationId">;
}

// Combined payload for POST /applications/loan-applications. The three records
// (user + application + bank) are written atomically by the backend, so the
// client omits the server-generated `userId` / `applicationId` foreign keys.
export interface CreateLoanApplicationPayload {
  user: CreateUserPayload;
  application: Omit<CreateApplicationPayload, "userId">;
  bank: Omit<CreateBankDetailPayload, "applicationId">;
}

export interface ApplicationStatusView {
  id: string;
  status: string;
  statusReason: string | null;
  stageIndex: number;
  stageLabel: string;
  requestedAmount: number;
  loanTermMonths: number;
  monthlyPayment: number;
  calculatedDti: number;
}

// A single row in the dashboard's application list. Extends the status view
// with the fields needed to label each application in the list.
export interface ApplicationListItem extends ApplicationStatusView {
  loanPurpose: string;
  createdAt: string;
}

export interface GatekeeperDecision {
  status: string;
  reason: string;
  dti: number;
}

export interface BankDetailResult {
  bankDetailId: string;
  decision: GatekeeperDecision;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface AuthResult {
  accessToken: string;
  sub: string;
  email: string;
  phone: string;
  role: "customer" | "underwriter" | "admin";
}

// --- Underwriting / dual-view (mirror UnderwritingService responses) ---

export interface QueueItem {
  id: string;
  requestedAmount: number;
  calculatedDti: number;
  statusReason: string | null;
  createdAt: string;
}

// Keyed by ApplicationStatus (e.g. MANUAL_REVIEW, PENDING_VERIFICATION).
export type Queues = Record<string, QueueItem[]>;

export interface DualViewBankSelf {
  bankName: string;
  routingNumber: string;
  accountNumberMasked: string;
  accountAge: string;
}

export interface DualViewBankVerified {
  routingNumber: string;
  apiVerified: boolean;
}

export interface DualView {
  application: {
    id: string;
    status: string;
    statusReason: string | null;
    requestedAmount: number;
    loanTermMonths: number;
    monthlyPayment: number;
    calculatedDti: number;
  };
  selfReported: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    grossMonthlyIncome: number;
    housingStatus: string;
    monthlyHousingPayment: number;
    otherMonthlyDebts: number;
    banks: DualViewBankSelf[];
  };
  apiVerified: {
    banks: DualViewBankVerified[];
  };
}

type SendOtpResponse = {
  success: boolean;
  message: string;
  otp?: string; // only in development if your backend includes it
};

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export const api = {
  createUser: (payload: CreateUserPayload) =>
    request<{ id: string; firstName: string; lastName: string; email: string }>(
      "/users",
      { method: "POST", body: JSON.stringify(payload) },
    ),

  createApplication: (payload: CreateApplicationPayload) =>
    request<ApplicationStatusView>("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Atomic user + application + bank creation in a single transactional call.
  // Returns the application status view (the Gatekeeper decision is reflected
  // in `status` / `statusReason`).
  createLoanApplication: (payload: CreateLoanApplicationPayload) =>
    request<ApplicationStatusView>("/applications/loan-applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Returning-user apply flow: creates a new application + bank for an existing
  // user without re-collecting their personal details.
  createLoanApplicationForUser: (
    payload: CreateExistingUserLoanApplicationPayload,
  ) =>
    request<ApplicationStatusView>("/applications/loan-applications/existing", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Full stored profile for a user, used to prefill the apply form.
  getUser: (id: string) => request<UserProfile>(`/users/${id}`),

  createBankDetails: (payload: CreateBankDetailPayload) =>
    request<BankDetailResult>("/bank-details", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // BANK_REJECTED correction: update the existing bank record (no new row) and
  // re-run the Gatekeeper. Keyed by applicationId.
  updateBankDetails: (
    applicationId: string,
    payload: UpdateBankDetailPayload,
  ) =>
    request<BankDetailResult>(`/bank-details/application/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getApplication: (id: string) =>
    request<ApplicationStatusView>(`/applications/${id}`),

  // Latest application for a user — drives the dashboard after OTP login, where
  // we have the user id from the session but no specific application id.
  getApplicationByUser: (userId: string) =>
    request<ApplicationStatusView>(`/applications/user/${userId}`),

  // Every application belonging to a user (most recent first) — drives the
  // dashboard list, where selecting a row opens that application by id.
  getApplicationsByUser: (userId: string) =>
    request<ApplicationListItem[]>(`/applications/user/applications/${userId}`),

  esign: (id: string) =>
    request<ApplicationStatusView>(`/applications/${id}/esign`, {
      method: "POST",
    }),

  login: (email: string, password?: string) =>
    request<AuthResult>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  sendOtp: (phone: string) =>
    request<SendOtpResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, otp: string) =>
    request<LoginResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),

  // --- Admin / underwriting (require a bearer token) ---
  getQueues: (token: string) =>
    request<Queues>("/underwriting/queues", {
      headers: authHeaders(token),
    }),

  getDualView: (id: string, token: string) =>
    request<DualView>(`/underwriting/${id}`, { headers: authHeaders(token) }),

  releaseFunds: (id: string, token: string, achReference?: string) =>
    request<{ id: string; status: string; disbursementId: string }>(
      `/underwriting/${id}/release-funds`,
      {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ confirm: true, achReference }),
      },
    ),

  advance: (id: string, token: string, status: string, reason?: string) =>
    request<{ id: string; status: string }>(`/underwriting/${id}/advance`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ status, reason }),
    }),

  decline: (id: string, token: string, reason: string) =>
    request<{ id: string; status: string }>(`/underwriting/${id}/decline`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ reason }),
    }),
};
