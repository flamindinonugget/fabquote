import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused"
  | "unknown";

export type SubscriptionState = {
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  customerEmail?: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: number;
  checkoutSessionIds: string[];
  lastInvoiceId?: string;
  lastPaymentFailedAt?: string;
  lastEventType?: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionLookup = {
  checkoutSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail?: string;
};

type CheckoutCompletedInput = {
  checkoutSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail?: string;
};

type SubscriptionEventInput = {
  eventType: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: number;
};

type InvoiceEventInput = {
  eventType: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  invoiceId?: string;
};

type CheckoutSessionState = {
  checkoutSessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
};

type SubscriptionStore = {
  subscriptions: Record<string, SubscriptionState>;
  checkoutSessions: Record<string, CheckoutSessionState>;
};

const emptyStore: SubscriptionStore = {
  subscriptions: {},
  checkoutSessions: {},
};

const activeStatuses = new Set<SubscriptionStatus>(["active", "trialing"]);

export const subscriptionRepository = {
  async recordCheckoutCompleted(input: CheckoutCompletedInput) {
    await updateStore((store, now) => {
      if (input.checkoutSessionId) {
        const existing = store.checkoutSessions[input.checkoutSessionId];
        store.checkoutSessions[input.checkoutSessionId] = {
          checkoutSessionId: input.checkoutSessionId,
          stripeCustomerId:
            input.stripeCustomerId || existing?.stripeCustomerId,
          stripeSubscriptionId:
            input.stripeSubscriptionId || existing?.stripeSubscriptionId,
          customerEmail: normalizeEmail(input.customerEmail) || existing?.customerEmail,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
        };
      }

      const existing = findSubscription(store, input);

      if (!existing && !input.stripeSubscriptionId) {
        return;
      }

      const subscriptionId = existing?.stripeSubscriptionId || input.stripeSubscriptionId;

      if (!subscriptionId) {
        return;
      }

      const record = existing || createSubscriptionRecord(subscriptionId, now);
      store.subscriptions[subscriptionId] = mergeSubscription(record, {
        stripeCustomerId: input.stripeCustomerId || record.stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
        customerEmail: normalizeEmail(input.customerEmail) || record.customerEmail,
        checkoutSessionIds: appendUnique(
          record.checkoutSessionIds,
          input.checkoutSessionId,
        ),
        lastEventType: "checkout.session.completed",
        updatedAt: now,
      });
    });
  },

  async upsertSubscription(input: SubscriptionEventInput) {
    if (!input.stripeSubscriptionId) {
      console.warn(
        `[billing] ${input.eventType} did not include a subscription id.`,
      );
      return;
    }

    const stripeSubscriptionId = input.stripeSubscriptionId;

    await updateStore((store, now) => {
      const existing =
        store.subscriptions[stripeSubscriptionId] ||
        createSubscriptionRecord(stripeSubscriptionId, now);

      store.subscriptions[stripeSubscriptionId] = mergeSubscription(existing, {
        stripeCustomerId: input.stripeCustomerId || existing.stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId: input.stripePriceId || existing.stripePriceId,
        status: input.status,
        currentPeriodEnd: input.currentPeriodEnd ?? existing.currentPeriodEnd,
        lastEventType: input.eventType,
        updatedAt: now,
      });
    });
  },

  async recordInvoiceEvent(input: InvoiceEventInput) {
    await updateStore((store, now) => {
      const existing = findSubscription(store, input);

      if (!existing) {
        return;
      }

      const stripeSubscriptionId = existing.stripeSubscriptionId;

      if (!stripeSubscriptionId) {
        return;
      }

      store.subscriptions[stripeSubscriptionId] = mergeSubscription(existing, {
        stripeCustomerId: input.stripeCustomerId || existing.stripeCustomerId,
        stripeSubscriptionId,
        lastInvoiceId: input.invoiceId || existing.lastInvoiceId,
        lastPaymentFailedAt:
          input.eventType === "invoice.payment_failed"
            ? now
            : existing.lastPaymentFailedAt,
        lastEventType: input.eventType,
        updatedAt: now,
      });
    });
  },

  async findSubscription(lookup: SubscriptionLookup) {
    const store = await readStore();
    return findSubscription(store, lookup);
  },

  async getActiveProSubscription(lookup: SubscriptionLookup) {
    const store = await readStore();
    const subscription = findSubscription(store, lookup);

    if (!subscription || !isActiveProSubscription(subscription)) {
      return null;
    }

    return subscription;
  },

  async getActiveSubscriptionForCurrentUser() {
    return null as SubscriptionState | null;
  },
};

export function isActiveProSubscription(subscription: SubscriptionState) {
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID?.trim();
  const isProPrice = !proPriceId || subscription.stripePriceId === proPriceId;

  return isProPrice && activeStatuses.has(subscription.status);
}

export function getSubscriptionStateFilePath() {
  return (
    process.env.SUBSCRIPTION_STATE_FILE ||
    path.join(process.cwd(), "logs", "stripe-subscriptions.json")
  );
}

async function updateStore(
  updater: (store: SubscriptionStore, now: string) => void,
) {
  const store = await readStore();
  updater(store, new Date().toISOString());
  await writeStore(store);
}

async function readStore(): Promise<SubscriptionStore> {
  try {
    const raw = await readFile(getSubscriptionStateFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<SubscriptionStore>;

    return {
      subscriptions: parsed.subscriptions || {},
      checkoutSessions: parsed.checkoutSessions || {},
    };
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return structuredClone(emptyStore);
    }

    throw error;
  }
}

async function writeStore(store: SubscriptionStore) {
  const filePath = getSubscriptionStateFilePath();
  const directory = path.dirname(filePath);
  const temporaryPath = `${filePath}.tmp`;

  await mkdir(directory, { recursive: true });
  await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

function createSubscriptionRecord(
  stripeSubscriptionId: string,
  now: string,
): SubscriptionState {
  return {
    stripeCustomerId: "",
    stripeSubscriptionId,
    status: "unknown",
    checkoutSessionIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

function mergeSubscription(
  existing: SubscriptionState,
  next: Partial<SubscriptionState>,
): SubscriptionState {
  return {
    ...existing,
    ...next,
    checkoutSessionIds: next.checkoutSessionIds || existing.checkoutSessionIds,
  };
}

function findSubscription(
  store: SubscriptionStore,
  lookup: SubscriptionLookup,
) {
  const sessionId = lookup.checkoutSessionId?.trim();

  if (sessionId) {
    const session = store.checkoutSessions[sessionId];

    if (session?.stripeSubscriptionId) {
      const subscription = store.subscriptions[session.stripeSubscriptionId];

      if (subscription) {
        return subscription;
      }
    }

    return findSubscription(store, {
      stripeCustomerId: session?.stripeCustomerId,
      customerEmail: session?.customerEmail,
    });
  }

  const subscriptionId = lookup.stripeSubscriptionId?.trim();

  if (subscriptionId && store.subscriptions[subscriptionId]) {
    return store.subscriptions[subscriptionId];
  }

  const customerId = lookup.stripeCustomerId?.trim();
  const customerEmail = normalizeEmail(lookup.customerEmail);

  return Object.values(store.subscriptions).find((subscription) => {
    return (
      (!!customerId && subscription.stripeCustomerId === customerId) ||
      (!!customerEmail && subscription.customerEmail === customerEmail)
    );
  });
}

function appendUnique(values: string[], value?: string) {
  if (!value || values.includes(value)) {
    return values;
  }

  return [...values, value];
}

function normalizeEmail(value?: string) {
  return value?.trim().toLowerCase() || undefined;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
