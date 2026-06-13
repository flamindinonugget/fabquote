import { billingPlans, type BillingPlanId, trialDays } from "@/lib/billing";

type StripeCheckoutSession = {
  id: string;
  url: string | null;
};

type StripeBillingPortalSession = {
  id: string;
  url: string;
};

type CreateCheckoutSessionInput = {
  planId: BillingPlanId;
  customerEmail?: string;
};

type StripeMode = "test" | "live";

type StripeCheckoutConfig = {
  secretKey: string;
  publishableKey: string;
  priceId: string;
  mode: StripeMode;
};

const stripeApiBaseUrl = "https://api.stripe.com/v1";
const stripeApiVersion = "2026-02-25.clover";

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

export function getStripeCheckoutConfig(planId: BillingPlanId) {
  const plan = billingPlans[planId];
  const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");
  const publishableKey = getRequiredEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const priceId = getRequiredEnv(plan.priceIdEnv);
  const secretMode = getStripeKeyMode(secretKey, "STRIPE_SECRET_KEY", "sk");
  const publishableMode = getStripeKeyMode(
    publishableKey,
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "pk",
  );

  if (secretMode !== publishableMode) {
    throw new Error(
      "Stripe secret and publishable keys must both be test keys or both be live keys.",
    );
  }

  return {
    secretKey,
    publishableKey,
    priceId: getStripePriceId(priceId, plan.priceIdEnv),
    mode: secretMode,
  } satisfies StripeCheckoutConfig;
}

export async function createSubscriptionCheckoutSession({
  planId,
  customerEmail,
}: CreateCheckoutSessionInput) {
  const plan = billingPlans[planId];
  const { secretKey, priceId } = getStripeCheckoutConfig(planId);
  const appUrl = getAppUrl();
  const trimmedCustomerEmail = customerEmail?.trim();

  const params = new URLSearchParams({
    mode: "subscription",
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing/cancel?plan=${planId}`,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "subscription_data[trial_period_days]": String(trialDays),
    "subscription_data[metadata][plan_id]": plan.id,
    "metadata[plan_id]": plan.id,
    allow_promotion_codes: "true",
    billing_address_collection: "auto",
  });

  if (trimmedCustomerEmail) {
    params.set("customer_email", trimmedCustomerEmail);
  }

  return stripeRequest<StripeCheckoutSession>(
    "/checkout/sessions",
    params,
    secretKey,
  );
}

export async function createBillingPortalSession(customerId: string) {
  const params = new URLSearchParams({
    customer: customerId,
    return_url: `${getAppUrl()}/pricing`,
  });

  return stripeRequest<StripeBillingPortalSession>(
    "/billing_portal/sessions",
    params,
    getRequiredEnv("STRIPE_SECRET_KEY"),
  );
}

async function stripeRequest<ResponseBody>(
  path: string,
  params: URLSearchParams,
  secretKey: string,
) {
  const response = await fetch(`${stripeApiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": stripeApiVersion,
    },
    body: params,
  });

  const body = (await response.json()) as ResponseBody & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(body.error?.message || "Stripe request failed.");
  }

  return body;
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getStripeKeyMode(value: string, envName: string, prefix: "sk" | "pk") {
  if (value.startsWith(`${prefix}_test_`)) {
    return "test";
  }

  if (value.startsWith(`${prefix}_live_`)) {
    return "live";
  }

  throw new Error(`${envName} must start with ${prefix}_test_ or ${prefix}_live_.`);
}

function getStripePriceId(value: string, envName: string) {
  if (!value.startsWith("price_")) {
    throw new Error(`${envName} must be a Stripe Price ID that starts with price_.`);
  }

  return value;
}
