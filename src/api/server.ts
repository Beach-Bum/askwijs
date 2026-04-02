import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import Stripe from "stripe";

const app = new Hono();
app.use("/*", cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

// ── Helper: Get Tink access token ─────────────────────────────────
async function getTinkToken(scope: string): Promise<string> {
  const res = await fetch("https://api.tink.com/api/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TINK_CLIENT_ID!,
      client_secret: process.env.TINK_CLIENT_SECRET!,
      grant_type: "client_credentials",
      scope,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Tink auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── Stripe: Create checkout session ────────────────────────────────
app.post("/api/stripe/checkout", async (c) => {
  const { userId, email } = await c.req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { userId },
    },
    success_url: `${process.env.VITE_APP_URL || "http://localhost:5173"}/dashboard?subscribed=true`,
    cancel_url: `${process.env.VITE_APP_URL || "http://localhost:5173"}/subscribe`,
  });

  return c.json({ url: session.url });
});

// ── Stripe: Webhook ────────────────────────────────────────────────
app.post("/api/stripe/webhook", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      console.log("Subscription event:", event.type);
      break;
    case "customer.subscription.deleted":
      console.log("Subscription cancelled");
      break;
  }

  return c.json({ received: true });
});

// ── Tink: Create user and get authorization link ──────────────────
app.post("/api/banking/connect", async (c) => {
  const { bankId, userId } = await c.req.json();
  const redirectUri = `${process.env.VITE_APP_URL || "http://localhost:5173"}/dashboard?bank_connected=true`;

  // 1. Get client access token
  const token = await getTinkToken("user:create,authorization:grant");

  // 2. Create a Tink user (or use existing external user ID)
  const userRes = await fetch("https://api.tink.com/api/v1/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      external_user_id: userId,
      market: "NL",
      locale: "en_US",
    }),
  });
  const userData = await userRes.json();

  // 3. Grant authorization code for the user
  const authRes = await fetch("https://api.tink.com/api/v1/oauth/authorization-grant", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: new URLSearchParams({
      external_user_id: userId,
      scope: "accounts:read,transactions:read,credentials:write,credentials:read",
    }),
  });
  const authData = await authRes.json();

  // 4. Build Tink Link URL for bank connection
  const tinkLinkUrl = new URL("https://link.tink.com/1.0/transactions/connect-accounts");
  tinkLinkUrl.searchParams.set("client_id", process.env.TINK_CLIENT_ID!);
  tinkLinkUrl.searchParams.set("redirect_uri", redirectUri);
  tinkLinkUrl.searchParams.set("authorization_code", authData.code);
  tinkLinkUrl.searchParams.set("market", "NL");
  tinkLinkUrl.searchParams.set("locale", "en_US");

  return c.json({ redirectUrl: tinkLinkUrl.toString(), tinkUserId: userData.user_id || userId });
});

// ── Tink: Fetch transactions after bank connect ───────────────────
app.get("/api/banking/transactions/:userId", async (c) => {
  const { userId } = c.req.param();

  // 1. Get client token and then user-scoped token
  const clientToken = await getTinkToken("authorization:grant");

  // 2. Get authorization code for this user
  const authRes = await fetch("https://api.tink.com/api/v1/oauth/authorization-grant", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${clientToken}`,
    },
    body: new URLSearchParams({
      external_user_id: userId,
      scope: "accounts:read,transactions:read",
    }),
  });
  const { code } = await authRes.json();

  // 3. Exchange code for user access token
  const tokenRes = await fetch("https://api.tink.com/api/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TINK_CLIENT_ID!,
      client_secret: process.env.TINK_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
    }),
  });
  const { access_token: userToken } = await tokenRes.json();

  // 4. Fetch accounts
  const accountsRes = await fetch("https://api.tink.com/data/v2/accounts", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const accountsData = await accountsRes.json();

  if (!accountsData.accounts || accountsData.accounts.length === 0) {
    return c.json({ error: "No accounts linked yet" }, 400);
  }

  // 5. Fetch transactions
  const txRes = await fetch("https://api.tink.com/data/v2/transactions?pageSize=100", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const txData = await txRes.json();

  const transactions = (txData.transactions || []).map((tx: any) => ({
    id: tx.id,
    date: tx.dates?.booked || tx.dates?.value,
    amount: parseFloat(tx.amount?.value?.unscaledValue || "0") / Math.pow(10, tx.amount?.value?.scale || 0),
    currency: tx.amount?.currencyCode || "EUR",
    counterpartyName: tx.descriptions?.display || tx.descriptions?.original || "Unknown",
    description: tx.descriptions?.original || "",
    status: tx.status,
  }));

  return c.json({
    transactions,
    accounts: accountsData.accounts.map((a: any) => ({
      id: a.id,
      name: a.name,
      iban: a.identifiers?.iban?.iban,
      balance: a.balances?.booked?.amount,
    })),
  });
});

// ── User profile ───────────────────────────────────────────────────
app.post("/api/user/profile", async (c) => {
  const body = await c.req.json();
  console.log("Profile saved:", body);
  return c.json({ ok: true });
});

// ── Start server ───────────────────────────────────────────────────
const port = parseInt(process.env.PORT || "3001");
console.log(`askwijs API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
