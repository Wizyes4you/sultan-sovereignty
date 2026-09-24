import { useMemo, useState } from "react";
import { createPiPayment, quoteGas, type GasQuote } from "@/lib/pi-client";
import { Check, LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        memo:
          import.meta.env.VITE_PI_PAYMENT_MEMO ||
          "Sultan Application Sovereign Validation - Frequency 114",
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

  const isDisabled = status === "pending" || status === "success";

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handlePayment}
        disabled={isDisabled}
        size="lg"
        variant={status === "error" ? "destructive" : "default"}
        className="min-h-12 w-full"
      >
        {status === "pending" && <LoaderCircle className="animate-spin" />}
        {status === "success" && <Check />}
        {getButtonText()}
      </Button>

      {status === "success" && transactionId && (
        <div className="border-s-2 border-success bg-success/5 px-4 py-3">
          <p className="text-xs font-medium text-foreground">Transaction ID</p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{transactionId}</p>
          {donationAmount !== null && (
            <div className="mt-3 space-y-1.5 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Base Transaction:</span> 1.00 Pi
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Humanitarian Donation (2.5%):</span>{" "}
                {donationAmount.toFixed(4)} Pi
              </p>
              <p className="text-xs font-semibold text-foreground">
                Total Contributed: {(1 + donationAmount).toFixed(4)} Pi
              </p>
              {gas && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Network Gas Fee:</span>{" "}
                  {gas.totalFeePi.toFixed(7)} Pi ({gas.totalFeeStroops} stroops · {gas.operations}{" "}
                  op)
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
          <Button
            onClick={() => {
              setStatus("idle");
              setError(null);
            }}
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            <RotateCcw /> Dismiss
          </Button>
        </div>
      )}

      {status === "idle" && (
        <div className="space-y-2 text-xs text-muted-foreground">
          {/* Public reconstruction metadata — visible to every pioneer before signing */}
          <div className="border border-border bg-background px-4 py-4 text-left">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                إعمار · Reconstruction Split
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                2.5%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
              <span>Base · أساس</span>
              <span className="text-right font-mono">1.0000 Pi</span>
              <span>Reconstruction · إعمار</span>
              <span className="text-right font-mono">0.0250 Pi</span>
              <span className="font-semibold">Total · مجموع</span>
              <span className="text-right font-mono font-semibold">1.0250 Pi</span>
            </div>
            <p className="mt-3 border-t border-border pt-2.5 text-[10px] leading-relaxed text-muted-foreground">
              The 2.5% flows transparently to humanitarian reconstruction (Gaza · Sudan) and is
              recorded on-chain as payment metadata for every pioneer to witness.
            </p>
          </div>
          {previewGas && (
            <p className="text-center">
              Mainnet gas: {previewGas.totalFeePi.toFixed(7)} Pi · {previewGas.baseFeeStroops}{" "}
              stroops/op · est. total {previewGas.grossPi.toFixed(7)} Pi
            </p>
          )}
        </div>
      )}
    </div>
  );
}
