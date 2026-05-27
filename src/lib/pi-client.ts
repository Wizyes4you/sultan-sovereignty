// Pi Browser SDK client wrapper. Only usable inside the Pi Browser.
export interface PiAuthResult {
  accessToken: string;
  user: { uid: string; username: string };
}

interface PiPayment {
  identifier: string;
  amount: number;
  memo: string;
  metadata: object;
  to_address: string;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

interface PiSDK {
  init: (opts: { version: string; sandbox?: boolean }) => Promise<void> | void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: PiPayment) => void,
  ) => Promise<PiAuthResult>;
  createPayment: (data: PiPaymentData, callbacks: PiPaymentCallbacks) => void;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}

const SANDBOX = false; // Mainnet

let initPromise: Promise<void> | null = null;

function waitForPi(timeoutMs = 8000): Promise<PiSDK> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (typeof window !== "undefined" && window.Pi) return resolve(window.Pi);
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("Pi SDK not available. Open this app inside the Pi Browser."));
      }
      setTimeout(tick, 100);
    };
    tick();
  });
}

export async function initPi(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const Pi = await waitForPi();
      await Pi.init({ version: "2.0", sandbox: SANDBOX });
    })();
  }
  return initPromise;
}

function onIncompletePaymentFound(payment: PiPayment) {
  // Hand off to the backend to complete; placeholder for now.
  console.warn("[Pi] Incomplete payment found:", payment.identifier);
}

export async function authenticatePi(): Promise<PiAuthResult> {
  await initPi();
  const Pi = await waitForPi();
  return Pi.authenticate(["username"], onIncompletePaymentFound);
}

export async function establishSession(accessToken: string) {
  const res = await fetch("/api/establish-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ accessToken }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Session failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<{ uid: string; username: string }>;
}

export async function createPiPayment(data: PiPaymentData): Promise<{ paymentId: string; txid: string }> {
  await initPi();
  const Pi = await waitForPi();
  return new Promise((resolve, reject) => {
    Pi.createPayment(data, {
      onReadyForServerApproval: async (paymentId) => {
        try {
          const res = await fetch("/api/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paymentId }),
          });
          if (!res.ok) throw new Error(`approve failed: ${res.status} ${await res.text()}`);
        } catch (e) {
          reject(e);
        }
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        try {
          const res = await fetch("/api/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paymentId, txid }),
          });
          if (!res.ok) throw new Error(`complete failed: ${res.status} ${await res.text()}`);
          resolve({ paymentId, txid });
        } catch (e) {
          reject(e);
        }
      },
      onCancel: (paymentId) => reject(new Error(`Payment cancelled: ${paymentId}`)),
      onError: (error) => reject(error),
    });
  });
}
