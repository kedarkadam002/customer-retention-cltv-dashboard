// Deterministic enterprise mock dataset for LG Electronics TV business (US + UK)
// Generates ~2,000 customers in-memory (representative of a 100K+ enterprise dataset)

export type Region = "US" | "UK";
export type Segment = "Enterprise" | "Mid-Market" | "SMB" | "Consumer";
export type Industry = "Retail" | "Hospitality" | "Education" | "Healthcare" | "Corporate" | "Residential";
export type RfmSegment =
  | "Champions"
  | "Loyal Customers"
  | "Potential Loyalists"
  | "At Risk"
  | "Lost Customers"
  | "New Customers";

export interface Customer {
  id: string;
  name: string;
  signupDate: string;
  region: Region;
  industry: Industry;
  segment: Segment;
  product: string;
  revenue: number;
  orders: number;
  purchaseFrequency: number;
  retentionScore: number;
  churnFlag: 0 | 1;
  churnProbability: number;
  cltv: number;
  predictedCltv: number;
  engagementScore: number;
  supportTickets: number;
  lastPurchaseDate: string;
  tenureMonths: number;
  rfmSegment: RfmSegment;
}

// Mulberry32 seeded RNG
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Atlas", "Beacon", "Crown", "Delta", "Echo", "Falcon", "Greenfield", "Harbor", "Ironclad", "Junction", "Keystone", "Lumen", "Meridian", "Nimbus", "Oakridge", "Pinnacle", "Quantum", "Riverside", "Summit", "Trident", "Union", "Vertex", "Westgate", "Zenith"];
const LAST = ["Holdings", "Group", "Hospitality", "Retail", "Hotels", "Schools", "Health", "Partners", "Industries", "Ventures", "Stores", "Resorts", "Systems", "Networks", "Properties"];
const PRODUCTS = ["OLED evo G4", "QNED MiniLED 90", "NanoCell 80", "UltraGear OLED", "StanbyME Go", "Signage Pro", "Commercial 4K UR340C", "Hospitality Pro:Centric"];

export function generateCustomers(count = 2000, seed = 42): Customer[] {
  const r = rng(seed);
  const now = new Date("2025-01-15");
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const region: Region = r() < 0.62 ? "US" : "UK";
    const segRoll = r();
    const segment: Segment =
      segRoll < 0.08 ? "Enterprise" : segRoll < 0.28 ? "Mid-Market" : segRoll < 0.6 ? "SMB" : "Consumer";

    const industry: Industry = (["Retail", "Hospitality", "Education", "Healthcare", "Corporate", "Residential"] as Industry[])[
      Math.floor(r() * 6)
    ];

    const signupOffsetDays = Math.floor(r() * 365 * 5); // last 5 years
    const signupDate = new Date(now.getTime() - signupOffsetDays * 86400000);
    const tenureMonths = Math.floor(signupOffsetDays / 30);

    const baseRev =
      segment === "Enterprise" ? 280000 : segment === "Mid-Market" ? 65000 : segment === "SMB" ? 14000 : 3200;
    const revenue = Math.round(baseRev * (0.5 + r() * 1.5));
    const orders = Math.max(1, Math.round((segment === "Consumer" ? 2 : 12) * (0.4 + r() * 1.8)));
    const purchaseFrequency = +(orders / Math.max(1, tenureMonths / 12)).toFixed(2);

    const engagementScore = Math.round((segment === "Enterprise" ? 70 : 50) + r() * 35 - (segment === "SMB" ? 10 : 0));
    const supportTickets = Math.floor(r() * (segment === "Enterprise" ? 24 : 8));

    // Churn probability biased by segment + engagement
    const segBias = segment === "SMB" ? 0.25 : segment === "Consumer" ? 0.35 : segment === "Mid-Market" ? 0.12 : 0.06;
    const engPenalty = engagementScore < 50 ? 0.3 : engagementScore < 70 ? 0.12 : 0;
    const churnProbability = Math.min(0.98, Math.max(0.02, segBias + engPenalty + (r() * 0.4 - 0.15)));
    const churnFlag: 0 | 1 = churnProbability > 0.7 && r() < 0.55 ? 1 : 0;

    const retentionScore = Math.round((1 - churnProbability) * 100);
    const cltv = Math.round(revenue * (1.4 + r() * 2.2));
    const predictedCltv = Math.round(cltv * (churnFlag ? 0.4 : 0.9 + r() * 0.6));

    const lastDaysAgo = churnFlag ? 90 + Math.floor(r() * 400) : Math.floor(r() * 90);
    const lastPurchaseDate = new Date(now.getTime() - lastDaysAgo * 86400000);

    // RFM segment
    const recency = lastDaysAgo;
    const rfm: RfmSegment = (() => {
      if (tenureMonths < 6) return "New Customers";
      if (recency > 300) return "Lost Customers";
      if (recency > 150 && churnProbability > 0.5) return "At Risk";
      if (orders > 20 && recency < 60) return "Champions";
      if (orders > 10 && recency < 120) return "Loyal Customers";
      return "Potential Loyalists";
    })();

    customers.push({
      id: `LG-${100000 + i}`,
      name: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`,
      signupDate: signupDate.toISOString().slice(0, 10),
      region,
      industry,
      segment,
      product: PRODUCTS[Math.floor(r() * PRODUCTS.length)],
      revenue,
      orders,
      purchaseFrequency,
      retentionScore,
      churnFlag,
      churnProbability: +churnProbability.toFixed(3),
      cltv,
      predictedCltv,
      engagementScore,
      supportTickets,
      lastPurchaseDate: lastPurchaseDate.toISOString().slice(0, 10),
      tenureMonths,
      rfmSegment: rfm,
    });
  }

  return customers;
}

let _cache: Customer[] | null = null;
export function getCustomers(): Customer[] {
  if (!_cache) _cache = generateCustomers();
  return _cache;
}

// ---------- Aggregates ----------

export function getKpis() {
  const all = getCustomers();
  const total = all.length;
  const churned = all.filter((c) => c.churnFlag === 1).length;
  const active = total - churned;
  const retained = active;
  const revenue = all.reduce((s, c) => s + c.revenue, 0);
  const lostRevenue = all.filter((c) => c.churnFlag === 1).reduce((s, c) => s + c.revenue, 0);
  const atRiskRevenue = all
    .filter((c) => c.churnFlag === 0 && c.churnProbability > 0.6)
    .reduce((s, c) => s + c.revenue, 0);
  const avgCltv = Math.round(all.reduce((s, c) => s + c.cltv, 0) / total);

  return {
    total,
    active,
    retained,
    churned,
    retentionRate: +((active / total) * 100).toFixed(1),
    churnRate: +((churned / total) * 100).toFixed(1),
    avgCltv,
    revenueRetained: revenue - lostRevenue,
    revenueLost: lostRevenue,
    revenueAtRisk: atRiskRevenue,
    totalRevenue: revenue,
  };
}

export function getMonthlyTrend() {
  const all = getCustomers();
  const months: { month: string; customers: number; revenue: number; retention: number; churn: number }[] = [];
  const now = new Date("2025-01-15");
  for (let m = 23; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    const upTo = all.filter((c) => new Date(c.signupDate) <= d);
    const activeCount = upTo.filter((c) => c.churnFlag === 0 || new Date(c.lastPurchaseDate) > d).length;
    const churnCount = upTo.length - activeCount;
    const revenue = upTo.reduce((s, c) => s + c.revenue, 0) / 24; // monthly slice
    months.push({
      month: label,
      customers: upTo.length,
      revenue: Math.round(revenue),
      retention: upTo.length ? +((activeCount / upTo.length) * 100).toFixed(1) : 0,
      churn: upTo.length ? +((churnCount / upTo.length) * 100).toFixed(1) : 0,
    });
  }
  return months;
}

export function getCohortRetention() {
  // 12 cohorts × 12 months
  const cohorts: { cohort: string; values: number[] }[] = [];
  const now = new Date("2025-01-15");
  const r = rng(99);
  for (let c = 11; c >= 0; c--) {
    const d = new Date(now.getFullYear(), now.getMonth() - c, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    const values: number[] = [];
    let v = 100;
    for (let m = 0; m <= c; m++) {
      values.push(Math.round(v));
      v = v * (0.85 + r() * 0.1) - (m === 0 ? 0 : 1.5);
      v = Math.max(20, v);
    }
    while (values.length < 12) values.push(NaN);
    cohorts.push({ cohort: label, values });
  }
  return cohorts;
}

export function groupBy<K extends keyof Customer>(field: K) {
  const all = getCustomers();
  const map = new Map<string, Customer[]>();
  for (const c of all) {
    const k = String(c[field]);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(c);
  }
  return map;
}

export function bySegmentMetrics() {
  const map = groupBy("segment");
  return Array.from(map.entries()).map(([segment, list]) => {
    const total = list.length;
    const churned = list.filter((c) => c.churnFlag === 1).length;
    return {
      segment,
      customers: total,
      retention: +(((total - churned) / total) * 100).toFixed(1),
      churn: +((churned / total) * 100).toFixed(1),
      revenue: list.reduce((s, c) => s + c.revenue, 0),
      cltv: Math.round(list.reduce((s, c) => s + c.cltv, 0) / total),
    };
  });
}

export function byRfmSegment() {
  const map = groupBy("rfmSegment");
  return Array.from(map.entries()).map(([rfmSegment, list]) => ({
    rfmSegment,
    customers: list.length,
    revenue: list.reduce((s, c) => s + c.revenue, 0),
    avgCltv: Math.round(list.reduce((s, c) => s + c.cltv, 0) / list.length),
    avgRetention: Math.round(list.reduce((s, c) => s + c.retentionScore, 0) / list.length),
  }));
}

export function byRegion() {
  const map = groupBy("region");
  return Array.from(map.entries()).map(([region, list]) => {
    const churned = list.filter((c) => c.churnFlag === 1).length;
    return {
      region,
      customers: list.length,
      retention: +(((list.length - churned) / list.length) * 100).toFixed(1),
      revenue: list.reduce((s, c) => s + c.revenue, 0),
      cltv: Math.round(list.reduce((s, c) => s + c.cltv, 0) / list.length),
    };
  });
}

export function byIndustry() {
  const map = groupBy("industry");
  return Array.from(map.entries()).map(([industry, list]) => {
    const churned = list.filter((c) => c.churnFlag === 1).length;
    return {
      industry,
      customers: list.length,
      retention: +(((list.length - churned) / list.length) * 100).toFixed(1),
      revenue: list.reduce((s, c) => s + c.revenue, 0),
      cltv: Math.round(list.reduce((s, c) => s + c.cltv, 0) / list.length),
    };
  });
}

export function byProduct() {
  const map = groupBy("product");
  return Array.from(map.entries()).map(([product, list]) => ({
    product,
    customers: list.length,
    revenue: list.reduce((s, c) => s + c.revenue, 0),
    retention: +(((list.length - list.filter((c) => c.churnFlag).length) / list.length) * 100).toFixed(1),
  }));
}

export function topChurnRisk(limit = 15) {
  return getCustomers()
    .filter((c) => c.churnFlag === 0)
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, limit);
}

export function topByCltv(limit = 10) {
  return getCustomers()
    .sort((a, b) => b.cltv - a.cltv)
    .slice(0, limit);
}

export function fmtCurrency(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export function fmtNumber(n: number) {
  return n.toLocaleString("en-US");
}
