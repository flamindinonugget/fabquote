import { NextResponse } from "next/server";
import {
  isActiveProSubscription,
  subscriptionRepository,
} from "@/lib/subscriptionState";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const checkoutSessionId = url.searchParams.get("session_id") || undefined;
  const stripeCustomerId = url.searchParams.get("customer_id") || undefined;
  const stripeSubscriptionId =
    url.searchParams.get("subscription_id") || undefined;
  const customerEmail = url.searchParams.get("email") || undefined;

  const subscription = await subscriptionRepository.findSubscription({
    checkoutSessionId,
    stripeCustomerId,
    stripeSubscriptionId,
    customerEmail,
  });

  return NextResponse.json({
    active: subscription ? isActiveProSubscription(subscription) : false,
    subscription: subscription
      ? {
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
          stripePriceId: subscription.stripePriceId,
          customerEmail: subscription.customerEmail,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          lastPaymentFailedAt: subscription.lastPaymentFailedAt,
          updatedAt: subscription.updatedAt,
        }
      : null,
  });
}
