import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Sparkles, Users, Activity, UserCheck, UserX, TrendingUp, TrendingDown, DollarSign, Coins, AlertTriangle, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { bySegmentMetrics, fmtCurrency, fmtNumber, getKpis, getMonthlyTrend } from "@/lib/mockData";


export default function ExecutiveOverview() {
  const k = getKpis();
  const trend = getMonthlyTrend();
  const segMetrics = bySegmentMetrics();

  return (
    <div>
      <PageHeader
        title="Executive Overview"
        subtitle="Strategic snapshot of LG TV customer retention, lifetime value, and revenue health across US and UK markets."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Total Customers" value={fmtNumber(k.total)} delta={4.2} icon={<Users className="h-4 w-4" />} accent="primary" />
        <KpiCard label="Active Customers" value={fmtNumber(k.active)} delta={3.1} icon={<Activity className="h-4 w-4" />} accent="success" />
        <KpiCard label="Retained Customers" value={fmtNumber(k.retained)} delta={2.7} icon={<UserCheck className="h-4 w-4" />} accent="success" />
        <KpiCard label="Churned Customers" value={fmtNumber(k.churned)} delta={-1.4} deltaPositiveIsGood={false} icon={<UserX className="h-4 w-4" />} accent="danger" />
        <KpiCard label="Retention Rate" value={`${k.retentionRate}%`} delta={6.4} icon={<ShieldCheck className="h-4 w-4" />} accent="success" />
        <KpiCard label="Churn Rate" value={`${k.churnRate}%`} delta={-2.1} deltaPositiveIsGood={false} icon={<TrendingDown className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Average CLTV" value={fmtCurrency(k.avgCltv)} delta={8.9} icon={<Coins className="h-4 w-4" />} accent="primary" />
        <KpiCard label="Revenue Retained" value={fmtCurrency(k.revenueRetained)} delta={5.2} icon={<DollarSign className="h-4 w-4" />} accent="success" />
        <KpiCard label="Revenue Lost" value={fmtCurrency(k.revenueLost)} delta={-3.8} deltaPositiveIsGood={false} icon={<TrendingDown className="h-4 w-4" />} accent="danger" />
        <KpiCard label="Revenue at Risk" value={fmtCurrency(k.revenueAtRisk)} delta={1.2} deltaPositiveIsGood={false} icon={<AlertTriangle className="h-4 w-4" />} accent="warning" />
      </div>

      {/* AI summary panel */}
      <div className="glass-card p-5 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative flex gap-4">
          <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-sm font-semibold">AI Executive Summary</h3>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">Live</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customer retention improved by <span className="text-foreground font-medium">6.4%</span> versus last quarter, driven by strong performance in
              the <span className="text-foreground font-medium">Enterprise</span> and <span className="text-foreground font-medium">Mid-Market</span> segments across US markets.
              The <span className="text-foreground font-medium">SMB segment</span> in the UK shows elevated churn risk —
              <span className="text-foreground font-medium"> {fmtCurrency(k.revenueAtRisk)}</span> in revenue is currently flagged at risk.
              Recommended action: launch a proactive engagement program for the top <span className="text-foreground font-medium">5%</span> of at-risk accounts to protect FY25 expansion targets.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Revenue Trend" subtitle="Monthly recognized revenue (last 24 months)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="month" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#grad-rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Growth Trend" subtitle="Cumulative customer base">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="grad-cust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="month" {...AXIS} />
              <YAxis {...AXIS} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="customers" stroke={CHART_COLORS[1]} strokeWidth={2} fill="url(#grad-cust)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Retention vs Churn Trend" subtitle="Rolling 24-month rates">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="month" {...AXIS} />
              <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="retention" stroke={CHART_COLORS[2]} strokeWidth={2.5} dot={false} name="Retention" />
              <Line type="monotone" dataKey="churn" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} name="Churn" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue & Retention by Segment" subtitle="Customer segment performance">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={segMetrics}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="segment" {...AXIS} />
              <YAxis yAxisId="l" {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <YAxis yAxisId="r" orientation="right" {...AXIS} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="l" dataKey="revenue" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} name="Revenue">
                {segMetrics.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
              <Line yAxisId="r" type="monotone" dataKey="retention" stroke={CHART_COLORS[2]} strokeWidth={2} name="Retention %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
