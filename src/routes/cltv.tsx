import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, ReferenceLine } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { bySegmentMetrics, byRegion, fmtCurrency, fmtNumber, getCustomers, topByCltv } from "@/lib/mockData";


export default function CltvPage() {
  const customers = getCustomers();
  const avg = customers.reduce((s, c) => s + c.cltv, 0) / customers.length;
  const predicted = customers.reduce((s, c) => s + c.predictedCltv, 0) / customers.length;
  const totalEquity = customers.reduce((s, c) => s + c.cltv, 0);
  const highValue = customers.filter((c) => c.cltv > avg * 2).length;

  // CLTV distribution buckets
  const buckets = [
    { range: "<$10K", min: 0, max: 10000 },
    { range: "$10–50K", min: 10000, max: 50000 },
    { range: "$50–150K", min: 50000, max: 150000 },
    { range: "$150–500K", min: 150000, max: 500000 },
    { range: "$500K–1M", min: 500000, max: 1000000 },
    { range: ">$1M", min: 1000000, max: Infinity },
  ].map((b) => ({
    range: b.range,
    customers: customers.filter((c) => c.cltv >= b.min && c.cltv < b.max).length,
  }));

  const top = topByCltv(10);
  const segMetrics = bySegmentMetrics();
  const regions = byRegion();

  // Scatter: CLTV vs Churn
  const scatter = customers.slice(0, 600).map((c) => ({
    x: c.churnProbability * 100,
    y: c.cltv,
    z: c.revenue,
    segment: c.segment,
  }));

  return (
    <div>
      <PageHeader title="Customer Lifetime Value" subtitle="Value distribution, top accounts, and the relationship between lifetime value and churn risk." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Average CLTV" value={fmtCurrency(avg)} delta={8.9} accent="primary" />
        <KpiCard label="Predicted CLTV" value={fmtCurrency(predicted)} delta={11.4} accent="success" />
        <KpiCard label="Customer Equity" value={fmtCurrency(totalEquity)} delta={6.7} accent="success" hint="Total customer-base worth" />
        <KpiCard label="High Value Customer Count" value={fmtNumber(highValue)} delta={4.1} accent="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="CLTV Distribution" subtitle="Customers by lifetime-value bracket" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={buckets}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="range" {...AXIS} />
              <YAxis {...AXIS} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="customers" radius={[6, 6, 0, 0]}>
                {buckets.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CLTV by Geography">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regions}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="region" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
              <Bar dataKey="cltv" radius={[6, 6, 0, 0]}>
                {regions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Top Customers by CLTV">
          <div className="space-y-2 mt-1">
            {top.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 py-1.5">
                <div className="text-[11px] w-6 text-muted-foreground tabular-nums">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.segment} · {c.region} · {c.industry}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{fmtCurrency(c.cltv)}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="CLTV by Segment">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={segMetrics} layout="vertical">
              <CartesianGrid {...GRID} />
              <XAxis type="number" {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <YAxis type="category" dataKey="segment" {...AXIS} width={90} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
              <Bar dataKey="cltv" radius={[0, 6, 6, 0]}>
                {segMetrics.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="CLTV vs Churn Matrix" subtitle="Quadrants: invest, protect, monitor, deprioritize">
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
            <CartesianGrid {...GRID} />
            <XAxis type="number" dataKey="x" name="Churn Probability" unit="%" {...AXIS} domain={[0, 100]}
              label={{ value: "Churn Probability →", position: "insideBottom", offset: -4, fill: "oklch(0.7 0.02 255)", fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="CLTV" {...AXIS} tickFormatter={(v) => fmtCurrency(v)}
              label={{ value: "CLTV ↑", angle: -90, position: "insideLeft", fill: "oklch(0.7 0.02 255)", fontSize: 11 }} />
            <ZAxis type="number" dataKey="z" range={[20, 200]} />
            <ReferenceLine x={50} stroke="oklch(0.5 0.02 260 / 60%)" strokeDasharray="3 3" />
            <ReferenceLine y={avg} stroke="oklch(0.5 0.02 260 / 60%)" strokeDasharray="3 3" />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }}
              formatter={(v: number, n) => n === "CLTV" ? fmtCurrency(v) : `${v.toFixed(0)}%`} />
            <Scatter data={scatter} fill={CHART_COLORS[0]} fillOpacity={0.55} />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[11px]">
          <div className="p-2 rounded-md border border-border/40 bg-muted/20"><strong className="text-[color:var(--warning)]">High CLTV · High Churn</strong> — protect immediately</div>
          <div className="p-2 rounded-md border border-border/40 bg-muted/20"><strong className="text-[color:var(--success)]">High CLTV · Low Churn</strong> — invest & expand</div>
          <div className="p-2 rounded-md border border-border/40 bg-muted/20"><strong className="text-[color:var(--danger)]">Low CLTV · High Churn</strong> — deprioritize</div>
          <div className="p-2 rounded-md border border-border/40 bg-muted/20"><strong className="text-foreground">Low CLTV · Low Churn</strong> — nurture to grow</div>
        </div>
      </ChartCard>
    </div>
  );
}
