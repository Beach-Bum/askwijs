import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import Stripe from "stripe";

const app = new Hono();
app.use("/*", cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

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
      // TODO: update user subscription status in DB
      console.log("Subscription event:", event.type);
      break;
    case "customer.subscription.deleted":
      console.log("Subscription cancelled");
      break;
  }

  return c.json({ received: true });
});

// ── Nordigen: Initiate bank connection ─────────────────────────────
app.post("/api/banking/connect", async (c) => {
  const { bankId, userId } = await c.req.json();

  // Get Nordigen access token
  const tokenRes = await fetch("https://bankaccountdata.gocardless.com/api/v2/token/new/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  });
  const { access } = await tokenRes.json();

  // Map bank ID to Nordigen institution ID
  const institutionMap: Record<string, string> = {
    ING: "ING_INGBNL2A",
    ABNAMRO: "ABNAMRO_ABNANL2A",
    RABOBANK: "RABOBANK_RABONL2U",
    BUNQ: "BUNQ_BUNQNL2A",
    SNS: "SNS_SNSBNL2A",
    REVOLUT: "REVOLUT_REVOLT21",
  };

  const institutionId = institutionMap[bankId] || bankId;

  // Create end user agreement
  const agreementRes = await fetch("https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify({
      institution_id: institutionId,
      max_historical_days: 90,
      access_valid_for_days: 90,
      access_scope: ["balances", "details", "transactions"],
    }),
  });
  const agreement = await agreementRes.json();

  // Create requisition (link)
  const reqRes = await fetch("https://bankaccountdata.gocardless.com/api/v2/requisitions/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify({
      redirect: `${process.env.VITE_APP_URL || "http://localhost:5173"}/dashboard?bank_connected=true`,
      institution_id: institutionId,
      reference: userId,
      agreement: agreement.id,
      user_language: "EN",
    }),
  });
  const requisition = await reqRes.json();

  return c.json({ redirectUrl: requisition.link, requisitionId: requisition.id });
});

// ── Nordigen: Fetch transactions after bank connect ────────────────
app.get("/api/banking/transactions/:requisitionId", async (c) => {
  const { requisitionId } = c.req.param();

  // Get access token
  const tokenRes = await fetch("https://bankaccountdata.gocardless.com/api/v2/token/new/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  });
  const { access } = await tokenRes.json();

  // Get requisition to find account IDs
  const reqRes = await fetch(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const requisition = await reqRes.json();

  if (!requisition.accounts || requisition.accounts.length === 0) {
    return c.json({ error: "No accounts linked yet", status: requisition.status }, 400);
  }

  // Fetch transactions from first account
  const accountId = requisition.accounts[0];
  const txRes = await fetch(`https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const txData = await txRes.json();

  return c.json({ transactions: txData.transactions?.booked || [], accountId });
});

// ── User profile ───────────────────────────────────────────────────
app.post("/api/user/profile", async (c) => {
  const body = await c.req.json();
  // TODO: save to database
  console.log("Profile saved:", body);
  return c.json({ ok: true });
});

// ── Start server ───────────────────────────────────────────────────
const port = parseInt(process.env.PORT || "3001");
console.log(`askwijs API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
