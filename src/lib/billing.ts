export type BillingPlanId = "pro";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  price: string;
  priceIdEnv: "STRIPE_PRO_PRICE_ID";
};

export const trialDays = 14;

export const billingPlans = {
  pro: {
    id: "pro",
    name: "Pro",
    price: "$19/month",
    priceIdEnv: "STRIPE_PRO_PRICE_ID",
  },
} satisfies Record<BillingPlanId, BillingPlan>;

export function isBillingPlanId(value: unknown): value is BillingPlanId {
  return value === "pro";
}
