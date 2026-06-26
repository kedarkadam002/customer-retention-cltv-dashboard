import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, Legend } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { bySegmentMetrics, fmtCurrency, fmtNumber, getCustomers, getMonthlyTrend, topChurnRisk } from "@/lib/mockData";
import { InfoTerm } from "@/components/InfoTerm";


export default function ChurnPage() {
  const customers = getCustomers();
  const churned = customers.filter((c) => c.churnFlag);
  const churnRate = (churned.length / customers.length) * 100;
  const atRisk = customers.filter((c) => !c.churnFlag && c.churnProbability > 0.6);
  const atRiskRevenue = atRisk.reduce((s, c) => s + c.revenue, 0);
  const avgTimeBeforeChurn = churned.reduce((s, c) => s + c.tenureMonths, 0) / Math.max(1, churned.length);

  const trend = getMonthlyTrend();
  const segMetrics = bySegmentMetrics();

  const riskDist = [
    { name: "Low Risk", value: customers.filter((c) => c.churnProbability <= 0.4).length, color: "oklch(0.72 0.16 160)" },
    { name: "Medium Risk", value: customers.filter((c) => c.churnProbability > 0.4 && c.churnProbability <= 0.7).length, color: "oklch(0.78 0.16 75)" },
    { name: "High Risk", value: customers.filter((c) => c.churnProbability > 0.7).length, color: "oklch(0.65 0.23 22)" },
  ];

  const drivers = [
    { driver: "Low Engagement", impact: 38 },
    { driver: "Declining Purchases", impact: 28 },
    { driver: "Service Issues", impact: 14 },
    { driver: "Competitor Migration", impact: 11 },
    { driver: "Price Sensitivity", impact: 9 },
  ];

  const top = topChurnRisk(15);

  return (
    <div>
      <PageHeader title="Churn Intelligence" subtitle="Identify at-risk revenue, root-cause drivers, and prioritize proactive retention actions." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Churn Rate" value={`${churnRate.toFixed(1)}%`} delta={-2.1} deltaPositiveIsGood={false} accent="danger" />
        <KpiCard label="Customers At Risk" value={fmtNumber(atRisk.length)} delta={1.4} deltaPositiveIsGood={false} accent="warning" />
        <KpiCard label="Revenue at Risk" value={fmtCurrency(atRiskRevenue)} delta={2.6} deltaPositiveIsGood={false} accent="warning" />
        <KpiCard label="Avg Time Before Churn" value={`${avgTimeBeforeChurn.toFixed(0)} mo`} delta={3.2} accent="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Churn Trend" subtitle="Rolling churn rate" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="month" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Line type="monotone" dataKey="churn" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Risk Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={riskDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Churn by Segment">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={segMetrics}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="segment" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="churn" radius={[6, 6, 0, 0]}>
                {segMetrics.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Drivers Analysis" subtitle="Top contributing factors (model-derived)">
          <div className="space-y-3 mt-2">
            {drivers.map((d, i) => (
              <div key={d.driver}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{d.driver}</span>
                  <span className="text-muted-foreground">{d.impact}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.impact * 2}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Customer Churn Prediction" subtitle="Top at-risk accounts ranked by churn probability">
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border/40">
                <th className="font-medium py-2 px-2">Customer ID</th>
                <th className="font-medium py-2 px-2">Customer Name</th>
                <th className="font-medium py-2 px-2">Segment</th>
                <th className="font-medium py-2 px-2">Region</th>
                <th className="font-medium py-2 px-2 text-right"><InfoTerm term="Churn Probability">Churn Prob.</InfoTerm></th>
                <th className="font-medium py-2 px-2 text-right">Revenue Impact</th>
                <th className="font-medium py-2 px-2">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {top.map((c) => {
                const p = c.churnProbability * 100;
                const color = p > 70 ? "text-[color:var(--danger)] bg-[color:var(--danger)]/10"
                  : p > 40 ? "text-[color:var(--warning)] bg-[color:var(--warning)]/10"
                  : "text-[color:var(--success)] bg-[color:var(--success)]/10";
                const action = p > 70 ? "Executive outreach + retention offer"
                  : p > 40 ? "CSM check-in + tailored content" : "Continue nurture cadence";
                return (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="py-2.5 px-2 font-mono text-muted-foreground">{c.id}</td>
                    <td className="py-2.5 px-2 font-medium">{c.name}</td>
                    <td className="py-2.5 px-2">{c.segment}</td>
                    <td className="py-2.5 px-2">{c.region}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={"inline-block px-2 py-0.5 rounded-md font-semibold " + color}>{p.toFixed(0)}%</span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium">{fmtCurrency(c.revenue)}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
