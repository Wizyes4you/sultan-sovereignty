import { useMemo, useState } from "react";
import { createPiPayment, quoteGas, type GasQuote } from "@/lib/pi-client";


type PaymentStatus = "idle" | "pending" | "success" | "error";

interface PiPaymentButtonProps {
  userId?: string;
  userName?: string;
}

export function PiPaymentButton({ userId = "yassinservice", userName }: PiPaymentButtonProps) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [gas, setGas] = useState<GasQuote | null>(null);

  const previewGas = useMemo(() => {
    try {
      // Same total the user will see at signing: 1 Pi base + 2.5% donation.
      const donationPct = import.meta.env.VITE_PI_DONATION_PERCENTAGE
        ? parseFloat(import.meta.env.VITE_PI_DONATION_PERCENTAGE)
        : 2.5;
      return quoteGas(1 + (1 * donationPct) / 100);
    } catch {
      return null;
    }
  }, []);


  const handlePayment = async () => {
    setError(null);
    setStatus("pending");

    try {
      const donationPercentage = import.meta.env.VITE_PI_DONATION_PERCENTAGE
        ? parseFloat(import.meta.env.VITE_PI_DONATION_PERCENTAGE)
        : 2.5;

      const baseAmount = 1; // 1 Pi for the main transaction
      const donationAmount = (baseAmount * donationPercentage) / 100;
      const totalAmount = baseAmount + donationAmount;

      setDonationAmount(donationAmount);

      const paymentData = {
        amount: totalAmount,
        memo: import.meta.env.VITE_PI_PAYMENT_MEMO || "Sultan Application Sovereign Validation - Frequency 114",
        metadata: {
          orderId: "sultan-sovereignty-114",
          userId,
          userName,
          baseAmount,
          donationAmount,
          donationPercentage,
          timestamp: new Date().toISOString(),
          purpose: "humanitarian-reconstruction",
        },
      };

      const result = await createPiPayment(paymentData);

      setTransactionId(result.txid);
      setGas(result.gas);
      setStatus("success");

      // Log success metrics
      console.log("✅ Payment successful", {
        paymentId: result.paymentId,
        txid: result.txid,
        totalAmount,
        donation: donationAmount,
        gas: result.gas,
        metadata: paymentData.metadata,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setStatus("error");
      console.error("❌ Payment failed:", errorMessage);
    }
  };

  const getButtonText = (): string => {
    switch (status) {
      case "pending":
        return "Pending Blockchain Verification";
      case "success":
        return "✓ Transaction Successful";
      case "error":
        return "Try Again";
      default:
        return "Sign & Stream Reconstruction Flow";
    }
  };

  const getButtonStyles = (): string => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors";

    switch (status) {
      case "pending":
        return `${baseStyles} bg-amber-500 text-white opacity-75 cursor-wait hover:bg-amber-600`;
      case "success":
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700`;
      case "error":
        return `${baseStyles} bg-destructive text-destructive-foreground hover:bg-destructive/90`;
      default:
        return `${baseStyles} bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60`;
    }
  };

  const isDisabled = status === "pending" || status === "success";

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handlePayment}
        disabled={isDisabled}
        className={getButtonStyles()}
      >
        {status === "pending" && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {getButtonText()}
      </button>

      {status === "success" && transactionId && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3">
          <p className="text-xs font-medium text-green-900">Transaction ID:</p>
          <p className="break-all font-mono text-xs text-green-800">{transactionId}</p>
          {donationAmount !== null && (
            <div className="mt-2 space-y-1 border-t border-green-200 pt-2">
              <p className="text-xs text-green-800">
                <span className="font-semibold">Base Transaction:</span> 1.00 Pi
              </p>
              <p className="text-xs text-green-800">
                <span className="font-semibold">Humanitarian Donation (2.5%):</span> {donationAmount.toFixed(4)} Pi
              </p>
              <p className="text-xs font-semibold text-green-900">
                Total Contributed: {(1 + donationAmount).toFixed(4)} Pi
              </p>
              {gas && (
                <p className="text-xs text-green-800">
                  <span className="font-semibold">Network Gas Fee:</span>{" "}
                  {gas.totalFeePi.toFixed(7)} Pi ({gas.totalFeeStroops} stroops ·{" "}
                  {gas.operations} op)
                </p>
              )}
            </div>
          )}
        </div>
      )}


      {status === "error" && error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-xs font-medium text-destructive">Error:</p>
          <p className="text-xs text-destructive">{error}</p>
          <button
            onClick={() => {
              setStatus("idle");
              setError(null);
            }}
            className="mt-2 text-xs font-semibold text-destructive underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {status === "idle" && (
        <div className="space-y-1 text-center text-xs text-muted-foreground">
          <p>Contribute 1 Pi + 2.5% donation to humanitarian reconstruction via Stellar Horizon</p>
          {previewGas && (
            <p>
              Mainnet gas: {previewGas.totalFeePi.toFixed(7)} Pi ·{" "}
              {previewGas.baseFeeStroops} stroops/op · est. total{" "}
              {previewGas.grossPi.toFixed(7)} Pi
            </p>
          )}
        </div>
      )}

    </div>
  );
}
