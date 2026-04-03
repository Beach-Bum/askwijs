import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface TransactionInput {
  date: string;
  amount: number;
  counterpartyName: string;
  counterpartyIban?: string;
  description: string;
}

export interface CategorizedTransaction {
  category: string;
  btwRate: number; // 0, 9, or 21
  isBusiness: boolean;
  isDeductible: boolean;
  confidenceScore: number;
  reasoning: string;
}

const CATEGORIES = [
  "revenue",
  "office_supplies",
  "software_subscriptions",
  "travel",
  "transport",
  "meals_entertainment",
  "professional_services",
  "insurance",
  "telecommunications",
  "marketing_advertising",
  "equipment",
  "rent_workspace",
  "education_training",
  "bank_fees",
  "taxes",
  "health_related",
  "personal",
  "other_business",
  "other_personal",
] as const;

const SYSTEM_PROMPT = `You are Wijs, the AI financial agent powering askwijs.ai. You are an expert Dutch tax accountant specializing in ZZP (freelancer) bookkeeping in the Netherlands. You categorize bank transactions automatically synced via PSD2 Open Banking. You speak English first, Dutch fluently — and always explain Dutch tax terms in plain language.

Rules:
- Incoming payments (positive amounts) are almost always "revenue" unless they're refunds
- Apply correct Dutch BTW (VAT) rates: 21% (standard), 9% (reduced: food, books, pharma), 0% (exempt: insurance, education, healthcare, bank fees, international B2B)
- Mark transactions as business vs personal
- Mark deductible business expenses
- Common Dutch counterparties:
  - Albert Heijn, Jumbo, Lidl, Plus = grocery (personal unless business lunch)
  - NS, OV-chipkaart, 9292 = transport (often business deductible)
  - Belastingdienst = taxes
  - KPN, Vodafone, T-Mobile, Ziggo = telecom
  - Bol.com = depends on description (office supplies vs personal)
  - Thuisbezorgd, Uber Eats = meals (usually personal)
  - WeWork, Spaces, Seats2meet = rent/workspace (business)

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

export async function categorizeTransaction(
  tx: TransactionInput,
  userRules?: Array<{ counterpartyPattern: string; category: string; btwRate: number; isBusiness: boolean }>
): Promise<CategorizedTransaction> {
  // Check user-defined rules first
  if (userRules) {
    for (const rule of userRules) {
      if (
        tx.counterpartyName
          ?.toLowerCase()
          .includes(rule.counterpartyPattern.toLowerCase())
      ) {
        return {
          category: rule.category,
          btwRate: rule.btwRate,
          isBusiness: rule.isBusiness,
          isDeductible: rule.isBusiness,
          confidenceScore: 0.99,
          reasoning: `Matched user rule for "${rule.counterpartyPattern}"`,
        };
      }
    }
  }

  const userMessage = `Categorize this Dutch bank transaction:

Date: ${tx.date}
Amount: €${tx.amount.toFixed(2)} (${tx.amount >= 0 ? "INCOMING" : "OUTGOING"})
Counterparty: ${tx.counterpartyName || "Unknown"}
IBAN: ${tx.counterpartyIban || "N/A"}
Description: ${tx.description || "N/A"}

Respond with JSON:
{
  "category": one of [${CATEGORIES.map((c) => `"${c}"`).join(", ")}],
  "btwRate": 0 or 9 or 21,
  "isBusiness": true/false,
  "isDeductible": true/false (only true for business expenses),
  "confidenceScore": 0.0 to 1.0,
  "reasoning": "brief explanation"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]) as CategorizedTransaction;
  } catch {
    return {
      category: "other_business",
      btwRate: 21,
      isBusiness: true,
      isDeductible: true,
      confidenceScore: 0.5,
      reasoning: "Failed to parse AI response, defaulted to business expense",
    };
  }
}

export async function categorizeBatch(
  transactions: TransactionInput[],
  userRules?: Array<{ counterpartyPattern: string; category: string; btwRate: number; isBusiness: boolean }>
): Promise<CategorizedTransaction[]> {
  const CONCURRENCY = 5;
  const results: CategorizedTransaction[] = [];

  for (let i = 0; i < transactions.length; i += CONCURRENCY) {
    const batch = transactions.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(
      batch.map((tx) => categorizeTransaction(tx, userRules))
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({
          category: "other_business",
          btwRate: 21,
          isBusiness: true,
          isDeductible: true,
          confidenceScore: 0.3,
          reasoning: `Categorization failed: ${result.reason?.message || "Unknown error"}`,
        });
      }
    }
  }

  return results;
}
