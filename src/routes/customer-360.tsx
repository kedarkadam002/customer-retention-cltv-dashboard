import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { fmtCurrency, getCustomers } from "@/lib/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/customer-360")({
  head: () => ({ meta: [{ title: "Customer 360 · LG" }] }),
  component: Customer360,
});

function Customer360() {
  const all = getCustomers();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(all[0].id);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all.slice(0, 12);
    return all
      .filter((c) => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term))
      .slice(0, 12);
  }, [q, all]);

  const c = all.find((x) => x.id === selectedId) ?? all[0];

  const engagement = [
    { metric: "Logins", value: c.engagementScore + 10 },
    { metric: "Order Cadence", value: Math.min(100, c.purchaseFrequency * 18) },
    { metric: "Support Health", value: Math.max(20, 100 - c.supportTickets * 6) },
    { metric: "Email CTR", value: c.engagementScore - 5 },
    { metric: "Account Coverage", value: 70 + (c.segment === "Enterprise" ? 20 : 0) },
  ];

  return (
    <div>
      <PageHeader title="Customer 360 View" subtitle="Unified account profile spanning revenue, engagement, retention, and risk signals." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 glass-card p-3 h-fit">
          <div className="relative mb-3">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any customer…"
              className="pl-9 h-9 bg-muted/30 border-border/60"
            />
          </div>
          <div className="space-y-1 max-h-[640px] overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={
                  "w-full text-left px-3 py-2 rounded-md text-xs transition-colors " +
                  (r.id === selectedId ? "bg-primary/15 text-foreground border border-primary/30" : "hover:bg-muted/40")
                }
              >
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{r.id} · {r.segment} · {r.region}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative flex flex-col md:flex-row md:items-start gap-5">
              <div
                className="h-16 w-16 rounded-2xl grid place-items-center text-lg font-bold text-white shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              >
                {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold tracking-tight">{c.name}</h2>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{c.id}</span><span>·</span>
                  <span>{c.segment}</span><span>·</span>
                  <span>{c.industry}</span><span>·</span>
                  <span>{c.region}</span><span>·</span>
                  <span>Customer since {c.signupDate}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-primary/15 text-primary border border-primary/30">{c.rfmSegment}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-muted/40 border border-border/40">{c.product}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Retention Score</div>
                <div className="text-3xl font-semibold kpi-value text-[color:var(--success)]">{c.retentionScore}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Revenue" value={fmtCurrency(c.revenue)} accent="primary" />
            <KpiCard label="CLTV" value={fmtCurrency(c.cltv)} accent="success" hint={`Predicted: ${fmtCurrency(c.predictedCltv)}`} />
            <KpiCard label="Orders" value={c.orders.toString()} accent="neutral" hint={`${c.purchaseFrequency} / yr`} />
            <KpiCard label="Churn Probability" value={`${(c.churnProbability * 100).toFixed(0)}%`} accent={c.churnProbability > 0.6 ? "danger" : c.churnProbability > 0.4 ? "warning" : "success"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Engagement Metrics" subtitle="Behavioral signals (0–100)">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={engagement} layout="vertical">
                  <CartesianGrid {...GRID} />
                  <XAxis type="number" {...AXIS} domain={[0, 100]} />
                  <YAxis type="category" dataKey="metric" {...AXIS} width={120} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={CHART_COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Support History">
              <div className="space-y-3 mt-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">Total Tickets</span>
                  <span className="font-semibold">{c.supportTickets}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">Last Purchase</span>
                  <span className="font-semibold">{c.lastPurchaseDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">Tenure</span>
                  <span className="font-semibold">{c.tenureMonths} months</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground">Engagement Score</span>
                  <span className="font-semibold">{c.engagementScore}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Health Status</span>
                  <span className={"font-semibold " + (c.churnProbability > 0.6 ? "text-[color:var(--danger)]" : c.churnProbability > 0.4 ? "text-[color:var(--warning)]" : "text-[color:var(--success)]")}>
                    {c.churnProbability > 0.6 ? "Critical" : c.churnProbability > 0.4 ? "Watch" : "Healthy"}
                  </span>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
