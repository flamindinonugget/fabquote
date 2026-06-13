import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  subscriptionRepository,
  type SubscriptionStatus,
} from "@/lib/subscriptionState";

export const runtime = "nodejs";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

const handledEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (!signature || !verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }

  let event: StripeEvent;

  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook payload." },
      { status: 400 },
    );
  }

  if (!handledEvents.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  await handleStripeEvent(event);

  return NextResponse.json({ received: true });
}

async function handleStripeEvent(event: StripeEvent) {
  const object = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      await subscriptionRepository.recordCheckoutCompleted({
        checkoutSessionId: getStringField(object, "id"),
        stripeCustomerId: getStringField(object, "customer"),
        stripeSubscriptionId: getStringField(object, "subscription"),
        customerEmail:
          getNestedString(object, ["customer_details", "email"]) ||
          getStringField(object, "customer_email"),
      });
      return;

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await subscriptionRepository.upsertSubscription({
        eventType: event.type,
        stripeCustomerId: getStringField(object, "customer") || "",
        stripeSubscriptionId: getStringField(object, "id"),
        stripePriceId: getSubscriptionPriceId(object),
        status: getSubscriptionStatus(object),
        currentPeriodEnd: getNumberField(object, "current_period_end"),
      });
      return;

    case "invoice.payment_succeeded":
    case "invoice.payment_failed":
      await subscriptionRepository.recordInvoiceEvent({
        eventType: event.type,
        stripeCustomerId: getStringField(object, "customer"),
        stripeSubscriptionId:
          getStringField(object, "subscription") ||
          getNestedString(object, ["parent", "subscription_details", "subscription"]),
        invoiceId: getStringField(object, "id"),
      });
      return;
  }
}

function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
) {
  const parts = signatureHeader.split(",");
  const timestamp = parts
    .find((part) => part.startsWith("t="))
    ?.replace("t=", "");
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const expectedSignature = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");
  const expected = Buffer.from(expectedSignature, "hex");

  return signatures.some((signature) => {
    const actual = Buffer.from(signature, "hex");

    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}

function getStringField(object: Record<string, unknown>, key: string) {
  const value = object[key];

  return typeof value === "string" ? value : undefined;
}

function getNumberField(object: Record<string, unknown>, key: string) {
  const value = object[key];

  return typeof value === "number" ? value : undefined;
}

function getNestedString(object: Record<string, unknown>, path: string[]) {
  let current: unknown = object;

  for (const key of path) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[key];
  }

  return typeof current === "string" ? current : undefined;
}

function getSubscriptionStatus(
  object: Record<string, unknown>,
): SubscriptionStatus {
  const status = getStringField(object, "status");

  if (
    status === "trialing" ||
    status === "active" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "incomplete" ||
    status === "incomplete_expired" ||
    status === "unpaid" ||
    status === "paused"
  ) {
    return status;
  }

  return "unknown";
}

function getSubscriptionPriceId(object: Record<string, unknown>) {
  const items = object.items;

  if (!isRecord(items) || !Array.isArray(items.data)) {
    return undefined;
  }

  const firstItem = items.data[0];

  if (!isRecord(firstItem) || !isRecord(firstItem.price)) {
    return undefined;
  }

  return getStringField(firstItem.price, "id");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
