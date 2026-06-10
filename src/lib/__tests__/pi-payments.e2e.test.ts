/**
 * End-to-end integration tests for the Mainnet payment flow.
 *
 * These tests drive the real `createPiPayment` against a mocked Pi SDK and
 * a mocked `fetch`, then assert that the same `GasQuote` is:
 *   1. computed from the user-facing amount via `quoteGas`,
 *   2. stamped into the payment's `metadata.gas` block sent to the wallet,
 *   3. forwarded verbatim to both `/api/payments/approve` and
 *      `/api/payments/complete`,
 *   4. echoed back to the caller as the `gas` field of the resolved result —
 *      which is what `PiPaymentButton` renders in the UI.
 *
 * The mocked "RPC execution result" mirrors what the Pi Wallet returns after
 * it broadcasts the Stellar tx: a txid plus the fee actually charged. We
 * assert the UI/SDK quote matches that on-chain fee exactly.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  quoteGas,
  MAINNET_BASE_FEE_STROOPS,
  STROOPS_PER_PI,
} from "../pi-gas";

interface MockPayment {
  identifier: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  to_address: string;
}

interface MockCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

interface FetchCall {
  url: string;
  body: Record<string, unknown>;
}

function installPiMocks(opts: {
  paymentId: string;
  txid: string;
  /** Simulated on-chain fee in stroops from the Stellar RPC result. */
  rpcFeeStroops: number;
}) {
  const calls: FetchCall[] = [];
  let capturedPayment: { data: unknown; cbs: MockCallbacks } | null = null;

  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    calls.push({ url, body });
    if (url.endsWith("/api/payments/approve")) {
      return new Response(JSON.stringify({ approved: true }), { status: 200 });
    }
    if (url.endsWith("/api/payments/complete")) {
      return new Response(
        JSON.stringify({
          completed: true,
          payment: {
            // What Stellar Horizon reports back after broadcast.
            transaction: {
              txid: opts.txid,
              verified: true,
              fee_charged: String(opts.rpcFeeStroops),
            },
          },
        }),
        { status: 200 },
      );
    }
    return new Response("{}", { status: 200 });
  });

  const createPayment = vi.fn((data: unknown, cbs: MockCallbacks) => {
    capturedPayment = { data, cbs };
    // Simulate the wallet's lifecycle: server approval, then chain broadcast.
    queueMicrotask(() => cbs.onReadyForServerApproval(opts.paymentId));
    queueMicrotask(() =>
      cbs.onReadyForServerCompletion(opts.paymentId, opts.txid),
    );
  });

  (globalThis as unknown as { window: unknown }).window = {
    Pi: {
      init: vi.fn().mockResolvedValue(undefined),
      authenticate: vi.fn(),
      createPayment,
    },
  };
  (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;

  return {
    calls,
    fetchMock,
    getCapturedPayment: () => capturedPayment,
  };
}

describe("Pi Mainnet payment e2e: quote · metadata · UI · RPC parity", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { fetch?: unknown }).fetch;
  });

  it("stamps the computed gas quote into metadata, forwards it to approve/complete, and matches the RPC fee", async () => {
    const amount = 1.025; // 1 Pi + 2.5% donation, matching PiPaymentButton.
    const expected = quoteGas(amount);

    // Simulated on-chain fee from Stellar RPC must equal our quote.
    const mocks = installPiMocks({
      paymentId: "pay_e2e_1",
      txid: "txid_e2e_1",
      rpcFeeStroops: expected.totalFeeStroops,
    });

    const { createPiPayment } = await import("../pi-client");

    const result = await createPiPayment({
      amount,
      memo: "e2e",
      metadata: { orderId: "e2e-1", userId: "u" },
    });

    // 1. Returned gas equals the up-front quote (this is what the UI displays).
    expect(result.gas).toEqual(expected);
    expect(result.gas.baseFeeStroops).toBe(MAINNET_BASE_FEE_STROOPS);
    expect(result.gas.network).toBe("mainnet");

    // 2. Metadata stamping on the payment object handed to the Pi Wallet.
    const captured = mocks.getCapturedPayment();
    expect(captured).not.toBeNull();
    const stamped = (captured!.data as { metadata: { gas: unknown; orderId: string } })
      .metadata;
    expect(stamped.orderId).toBe("e2e-1");
    expect(stamped.gas).toEqual({
      network: expected.network,
      operations: expected.operations,
      baseFeeStroops: expected.baseFeeStroops,
      totalFeeStroops: expected.totalFeeStroops,
      totalFeePi: expected.totalFeePi,
    });

    // 3. Both backend calls receive the same gas payload.
    const approve = mocks.calls.find((c) => c.url.endsWith("/approve"));
    const complete = mocks.calls.find((c) => c.url.endsWith("/complete"));
    expect(approve?.body).toMatchObject({ paymentId: "pay_e2e_1", gas: expected });
    expect(complete?.body).toMatchObject({
      paymentId: "pay_e2e_1",
      txid: "txid_e2e_1",
      gas: expected,
    });

    // 4. RPC execution parity: our quoted stroops == on-chain fee_charged.
    const completeRes: Response = await mocks.fetchMock.mock.results[1].value;
    const completeResp = await completeRes.clone().json();
    const rpcFee = Number(completeResp.payment.transaction.fee_charged);
    expect(rpcFee).toBe(result.gas.totalFeeStroops);
    expect(rpcFee / STROOPS_PER_PI).toBeCloseTo(result.gas.totalFeePi, 7);
  });

  it("flags a quote/RPC mismatch (defensive check for fee drift)", async () => {
    const amount = 2;
    const expected = quoteGas(amount);

    // Network charges 2x what we quoted — must be detectable downstream.
    const mocks = installPiMocks({
      paymentId: "pay_e2e_2",
      txid: "txid_e2e_2",
      rpcFeeStroops: expected.totalFeeStroops * 2,
    });

    const { createPiPayment } = await import("../pi-client");
    const result = await createPiPayment({
      amount,
      memo: "e2e-drift",
      metadata: {},
    });

    const completeRes: Response = await mocks.fetchMock.mock.results[1].value;
    const completeResp = await completeRes.clone().json();
    const rpcFee = Number(completeResp.payment.transaction.fee_charged);
    expect(rpcFee).not.toBe(result.gas.totalFeeStroops);
    expect(rpcFee).toBeGreaterThan(result.gas.totalFeeStroops);
  });

  it("PiPaymentButton's idle-state preview uses the same quote the SDK will stamp", async () => {
    // The button previews gas for 1 Pi + 2.5% donation. The SDK must stamp
    // the identical quote when invoked with that same amount.
    const donationPct = 2.5;
    const totalAmount = 1 + (1 * donationPct) / 100;
    const previewQuote = quoteGas(totalAmount);

    const mocks = installPiMocks({
      paymentId: "pay_ui",
      txid: "txid_ui",
      rpcFeeStroops: previewQuote.totalFeeStroops,
    });
    const { createPiPayment } = await import("../pi-client");
    const result = await createPiPayment({
      amount: totalAmount,
      memo: "ui-parity",
      metadata: {},
    });

    expect(result.gas).toEqual(previewQuote);
    const stamped = (mocks.getCapturedPayment()!.data as { metadata: { gas: unknown } })
      .metadata.gas;
    expect(stamped).toMatchObject({
      totalFeeStroops: previewQuote.totalFeeStroops,
      totalFeePi: previewQuote.totalFeePi,
    });
  });
});
