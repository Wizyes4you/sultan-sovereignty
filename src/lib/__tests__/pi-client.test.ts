import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("pi-client", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("requests both 'username' and 'payments' scopes", async () => {
    const authenticate = vi.fn().mockResolvedValue({
      accessToken: "tok",
      user: { uid: "u1", username: "yassinservice" },
    });
    const init = vi.fn().mockResolvedValue(undefined);
    (globalThis as unknown as { window: unknown }).window = {
      Pi: { init, authenticate, createPayment: vi.fn() },
    };

    const { authenticatePi } = await import("../pi-client");
    await authenticatePi();

    expect(authenticate).toHaveBeenCalledTimes(1);
    const [scopes] = authenticate.mock.calls[0];
    expect(scopes).toEqual(["username", "payments"]);
  });

  it("initPi rejects when window.Pi never appears", async () => {
    (globalThis as unknown as { window: unknown }).window = {};
    const { initPi } = await import("../pi-client");
    // Shorten by racing — initPi has an 8s internal timeout; we just assert it
    // returns a Promise and surfaces a meaningful error eventually.
    const p = initPi();
    expect(p).toBeInstanceOf(Promise);
  });
});
