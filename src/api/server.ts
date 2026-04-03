import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

// ── CORS — restrict to known origins ──────────────────────────────
const allowedOrigins = [
  process.env.VITE_APP_URL || "http://localhost:5173",
  "http://localhost:5173",
];

app.use(
  "/*",
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Supabase admin client (for JWT verification) ──────────────────
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Auth middleware — verifies Supabase JWT ────────────────────────
async function requireAuth(
  c: any,
  next: () => Promise<void>
): Promise<Response | void> {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing authorization header" }, 401);
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  c.set("authUser", user);
  await next();
}

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Stripe ────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// ── Stripe: Create checkout session (auth required) ───────────────
app.post("/api/stripe/checkout", requireAuth, async (c) => {
  const user = c.get("authUser");
  const { email } = await c.req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email || user.email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { userId: user.id },
    },
    success_url: `${process.env.VITE_APP_URL || "http://localhost:5173"}/dashboard?subscribed=true`,
    cancel_url: `${process.env.VITE_APP_URL || "http://localhost:5173"}/subscribe`,
  });

  return c.json({ url: session.url });
});

// ── Stripe: Webhook (no auth — Stripe signs it) ──────────────────
app.post("/api/stripe/webhook", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json({ error: "Missing stripe-signature" }, 400);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await db
          .update(users)
          .set({
            stripeCustomerId: sub.customer as string,
            subscriptionStatus: sub.status === "active" ? "active" : "trial",
            updatedAt: new Date(),
          })
          .where(eq(users.authId, userId));
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await db
          .update(users)
          .set({
            subscriptionStatus: "cancelled",
            updatedAt: new Date(),
          })
          .where(eq(users.authId, userId));
      }
      break;
    }
  }

  return c.json({ received: true });
});

// ── Helper: Get Tink access token ─────────────────────────────────
let tinkTokenCache: { token: string; expiresAt: number } | null = null;

async function getTinkToken(scope: string): Promise<string> {
  if (tinkTokenCache && Date.now() < tinkTokenCache.expiresAt) {
    return tinkTokenCache.token;
  }

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
  if (!data.access_token)
    throw new Error(`Tink auth failed: ${JSON.stringify(data)}`);

  tinkTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

// ── Tink: Create user and get authorization link (auth required) ──
app.post("/api/banking/connect", requireAuth, async (c) => {
  const user = c.get("authUser");
  const { bankId } = await c.req.json();

  if (!bankId || typeof bankId !== "string") {
    return c.json({ error: "bankId is required" }, 400);
  }

  const redirectUri = `${process.env.VITE_APP_URL || "http://localhost:5173"}/dashboard?bank_connected=true`;

  const token = await getTinkToken("user:create,authorization:grant");

  const userRes = await fetch("https://api.tink.com/api/v1/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      external_user_id: user.id,
      market: "NL",
      locale: "en_US",
    }),
  });
  const userData = await userRes.json();

  const authRes = await fetch(
    "https://api.tink.com/api/v1/oauth/authorization-grant",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        external_user_id: user.id,
        scope:
          "accounts:read,transactions:read,credentials:write,credentials:read",
      }),
    }
  );
  const authData = await authRes.json();

  const tinkLinkUrl = new URL(
    "https://link.tink.com/1.0/transactions/connect-accounts"
  );
  tinkLinkUrl.searchParams.set("client_id", process.env.TINK_CLIENT_ID!);
  tinkLinkUrl.searchParams.set("redirect_uri", redirectUri);
  tinkLinkUrl.searchParams.set("authorization_code", authData.code);
  tinkLinkUrl.searchParams.set("market", "NL");
  tinkLinkUrl.searchParams.set("locale", "en_US");

  return c.json({
    redirectUrl: tinkLinkUrl.toString(),
    tinkUserId: userData.user_id || user.id,
  });
});

// ── Tink: Fetch transactions after bank connect (auth required) ───
app.get("/api/banking/transactions", requireAuth, async (c) => {
  const user = c.get("authUser");

  const clientToken = await getTinkToken("authorization:grant");

  const authRes = await fetch(
    "https://api.tink.com/api/v1/oauth/authorization-grant",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${clientToken}`,
      },
      body: new URLSearchParams({
        external_user_id: user.id,
        scope: "accounts:read,transactions:read",
      }),
    }
  );
  const { code } = await authRes.json();

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

  const accountsRes = await fetch("https://api.tink.com/data/v2/accounts", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const accountsData = await accountsRes.json();

  if (!accountsData.accounts || accountsData.accounts.length === 0) {
    return c.json({ error: "No accounts linked yet" }, 400);
  }

  const txRes = await fetch(
    "https://api.tink.com/data/v2/transactions?pageSize=100",
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  const txData = await txRes.json();

  const transactions = (txData.transactions || []).map((tx: any) => ({
    id: tx.id,
    date: tx.dates?.booked || tx.dates?.value,
    amount:
      parseFloat(tx.amount?.value?.unscaledValue || "0") /
      Math.pow(10, tx.amount?.value?.scale || 0),
    currency: tx.amount?.currencyCode || "EUR",
    counterpartyName:
      tx.descriptions?.display || tx.descriptions?.original || "Unknown",
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

// ── User profile — save to database (auth required) ───────────────
app.post("/api/user/profile", requireAuth, async (c) => {
  const user = c.get("authUser");
  const body = await c.req.json();

  const { name, companyName, kvkNumber, btwId, phone } = body;

  // Upsert: create user row if not exists, update if exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      authId: user.id,
      email: user.email!,
      name: name || null,
      companyName: companyName || null,
      kvkNumber: kvkNumber || null,
      btwId: btwId || null,
      phone: phone || null,
    });
  } else {
    await db
      .update(users)
      .set({
        name: name || existing[0].name,
        companyName: companyName || existing[0].companyName,
        kvkNumber: kvkNumber || existing[0].kvkNumber,
        btwId: btwId || existing[0].btwId,
        phone: phone || existing[0].phone,
        updatedAt: new Date(),
      })
      .where(eq(users.authId, user.id));
  }

  return c.json({ ok: true });
});

// ── User profile — get from database (auth required) ──────────────
app.get("/api/user/profile", requireAuth, async (c) => {
  const user = c.get("authUser");

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ profile: null });
  }

  return c.json({ profile: rows[0] });
});

// ── Global error handler ──────────────────────────────────────────
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// ── Start server ──────────────────────────────────────────────────
const port = parseInt(process.env.PORT || "3001");
console.log(`askwijs API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
