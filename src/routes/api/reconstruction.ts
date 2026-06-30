// Reconstruction flow descriptor: echoes the 2.5% split for a given payment.
// This endpoint does NOT move funds. The authoritative split is recorded by
// /api/payments/approve via computeReconstructionSplit; this route is a
// read-only report surface for clients that want to display the breakdown.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/reconstruction")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            paymentId?: string;
            amount?: number;
            txid?: string;
          };
          const { paymentId, amount, txid } = body;
          if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
            return Response.json(
              { success: false, error: "amount must be a non-negative number" },
              { status: 400 },
            );
          }

          const reconstructionShare = Number((amount * 0.025).toFixed(7));

          return Response.json({
            success: true,
            report: {
              event: "RECONSTRUCTION_FLOW_ACTIVATED",
              paymentId: paymentId ?? null,
              txid: txid ?? null,
              total_amount: amount,
              reconstruction_share: reconstructionShare,
              status: "Sovereign Asset Recorded",
              verified_by: "Kun Faya Kun Yass Rule",
            },
          });
        } catch (error) {
          return Response.json(
            { success: false, error: error instanceof Error ? error.message : String(error) },
            { status: 400 },
          );
        }
      },
    },
  },
});
