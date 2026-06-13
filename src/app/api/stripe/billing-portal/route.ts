import { NextResponse } from "next/server";
import { createBillingPortalSession } from "@/lib/stripeServer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerId?: unknown;
    };

    if (typeof body.customerId !== "string" || !body.customerId.startsWith("cus_")) {
      return NextResponse.json(
        {
          error:
            "A Stripe customer ID is required until FabQuote has authenticated users.",
          todo: "After auth is added, load the current user's Stripe customer ID from the subscription table instead of accepting it from the request body.",
        },
        { status: 400 },
      );
    }

    const session = await createBillingPortalSession(body.customerId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe Billing Portal Session", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create billing portal session.",
      },
      { status: 500 },
    );
  }
}

