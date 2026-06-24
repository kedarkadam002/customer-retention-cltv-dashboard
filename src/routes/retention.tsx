import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { bySegmentMetrics, byIndustry, byProduct, byRegion, fmtCurrency, getCohortRetention, getCustomers } from "@/lib/mockData";
import { InfoTerm } from "@/components/InfoTerm";

export const Route = createFileRoute("/retention")({
  head: () => ({ meta: [{ title: "Retention Analytics · LG" }] }),
  component: RetentionPage,
});

function RetentionPage() {
  const customers = getCustomers();
  const repeatRate = (customers.filter((c) => c.orders > 1).length / customers.length) * 100;
  const avgTenure = customers.reduce((s, c) => s + c.tenureMonths, 0) / customers.length;
  const avgFreq = customers.reduce((s, c) => s + c.purchaseFrequency, 0) / customers.length;
  const revRet = customers.filter((c) => !c.churnFlag).reduce((s, c) => s + c.revenue, 0);
  const retention = 100 - (customers.filter((c) => c.churnFlag).length / customers.length) * 100;

  const cohorts = getCohortRetention();
  const segMetrics = bySegmentMetrics();
  const regions = byRegion();
  const industries = byIndustry();
  const products = byProduct();

  const funnel = [
    { stage: "New Customer", value: customers.length },
    { stage: "Activated", value: Math.round(customers.length * 0.82) },
    { stage: "Engaged", value: Math.round(customers.length * 0.64) },
    { stage: "Repeat Purchase", value: Math.round(customers.length * 0.47) },
    { stage: "Loyal", value: Math.round(customers.length * 0.31) },
  ];

  return (
    <div>
      <PageHeader title="Retention Analytics" subtitle="Cohort behavior, retention funnel, and segment-level retention drivers for the TV business." />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Retention Rate" value={`${retention.toFixed(1)}%`} delta={6.4} accent="success" />
        <KpiCard label="Repeat Purchase Rate" value={`${repeatRate.toFixed(1)}%`} delta={3.8} accent="primary" />
        <KpiCard label="Customer Tenure" value={`${avgTenure.toFixed(0)} mo`} delta={2.1} accent="success" />
        <KpiCard label="Purchase Frequency" value={avgFreq.toFixed(1)} delta={1.4} accent="neutral" hint="orders / yr" />
        <KpiCard label="Revenue Retention" value={fmtCurrency(revRet)} delta={5.2} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard
          title="Cohort"
          subtitle="Cohort retention heatmap — % of customers still active by months after acquisition"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="text-[11px] w-full">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground font-medium pb-2 pr-3">Cohort</th>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <th key={i} className="text-center text-muted-foreground font-medium pb-2 px-1">M{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.cohort}>
                    <td className="pr-3 py-1 text-muted-foreground whitespace-nowrap">{c.cohort}</td>
                    {c.values.map((v, i) => {
                      if (isNaN(v)) return <td key={i} className="px-0.5 py-1" />;
                      const intensity = v / 100;
                      const bg = `oklch(${0.3 + intensity * 0.35} ${0.1 + intensity * 0.12} 18 / ${0.25 + intensity * 0.75})`;
                      return (
                        <td key={i} className="px-0.5 py-1">
                          <div className="h-7 rounded grid place-items-center font-medium text-white/95" style={{ background: bg }}>
                            {Math.round(v)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Retention Funnel" subtitle="New → Activated → Engaged → Repeat → Loyal">
          <div className="space-y-3 mt-2">
            {funnel.map((f, i) => {
              const pct = (f.value / funnel[0].value) * 100;
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{f.stage}</span>
                    <span className="text-muted-foreground">{f.value.toLocaleString()} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-7 rounded-md bg-muted/30 overflow-hidden relative">
                    <div
                      className="h-full rounded-md transition-all"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              <InfoTerm term="Conversion Rate">Avg stage conversion</InfoTerm>: 74.6% · <InfoTerm term="Drop-off Rate">Largest drop-off</InfoTerm>: Engaged → Repeat (26.6%)
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Retention by Segment">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={segMetrics} layout="vertical">
              <CartesianGrid {...GRID} />
              <XAxis type="number" {...AXIS} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <YAxis type="category" dataKey="segment" {...AXIS} width={80} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="retention" radius={[0, 6, 6, 0]}>
                {segMetrics.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retention by Geography">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regions}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="region" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="retention" radius={[6, 6, 0, 0]}>
                {regions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retention by Product">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={products} layout="vertical">
              <CartesianGrid {...GRID} />
              <XAxis type="number" {...AXIS} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <YAxis type="category" dataKey="product" {...AXIS} width={120} fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="retention" radius={[0, 6, 6, 0]} fill={CHART_COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Retention by Industry" className="mt-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={industries}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="industry" {...AXIS} />
            <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            <Bar dataKey="retention" radius={[6, 6, 0, 0]}>
              {industries.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
