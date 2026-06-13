import { NextResponse } from "next/server";
import { isBillingPlanId } from "@/lib/billing";
import { createSubscriptionCheckoutSession } from "@/lib/stripeServer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      planId?: unknown;
      customerEmail?: unknown;
      acceptedTerms?: unknown;
    };

    if (!isBillingPlanId(body.planId)) {
      return NextResponse.json({ error: "Invalid billing plan." }, { status: 400 });
    }

    if (body.acceptedTerms !== true) {
      return NextResponse.json(
        { error: "Terms and Privacy Policy acceptance is required." },
        { status: 400 },
      );
    }

    const session = await createSubscriptionCheckoutSession({
      planId: body.planId,
      customerEmail:
        typeof body.customerEmail === "string" ? body.customerEmail : undefined,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      { status: 500 },
    );
  }
}

