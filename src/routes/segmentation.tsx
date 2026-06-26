import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { byRfmSegment, fmtCurrency, fmtNumber } from "@/lib/mockData";
import { InfoTerm } from "@/components/InfoTerm";


const SEG_COLORS: Record<string, string> = {
  Champions: "oklch(0.72 0.18 160)",
  "Loyal Customers": "oklch(0.65 0.18 220)",
  "Potential Loyalists": "oklch(0.7 0.17 200)",
  "At Risk": "oklch(0.78 0.16 75)",
  "Lost Customers": "oklch(0.6 0.22 22)",
  "New Customers": "oklch(0.7 0.15 280)",
};

export default function SegmentationPage() {
  const rfm = byRfmSegment();
  const total = rfm.reduce((s, r) => s + r.customers, 0);

  return (
    <div>
      <PageHeader
        title="Customer Segmentation"
        subtitle={
          <>Behavioral segmentation using the <InfoTerm term="RFM">RFM</InfoTerm> framework — <InfoTerm term="Recency">Recency</InfoTerm>, <InfoTerm term="Frequency">Frequency</InfoTerm>, and <InfoTerm term="Monetary">Monetary</InfoTerm> value.</> as unknown as string
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {rfm.map((r) => (
          <div key={r.rfmSegment} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: SEG_COLORS[r.rfmSegment] }} />
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <InfoTerm term={r.rfmSegment}>{r.rfmSegment}</InfoTerm>
              </div>
            </div>
            <div className="text-2xl font-semibold kpi-value">{fmtNumber(r.customers)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{((r.customers / total) * 100).toFixed(1)}% of base</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Segment Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={rfm} dataKey="customers" nameKey="rfmSegment" innerRadius={70} outerRadius={110} paddingAngle={2}>
                {rfm.map((r) => <Cell key={r.rfmSegment} fill={SEG_COLORS[r.rfmSegment]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Segment">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rfm} layout="vertical">
              <CartesianGrid {...GRID} />
              <XAxis type="number" {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <YAxis type="category" dataKey="rfmSegment" {...AXIS} width={130} fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {rfm.map((r) => <Cell key={r.rfmSegment} fill={SEG_COLORS[r.rfmSegment]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Retention by Segment">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rfm}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="rfmSegment" {...AXIS} fontSize={10} />
              <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="avgRetention" radius={[6, 6, 0, 0]}>
                {rfm.map((r) => <Cell key={r.rfmSegment} fill={SEG_COLORS[r.rfmSegment]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CLTV by Segment">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rfm}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="rfmSegment" {...AXIS} fontSize={10} />
              <YAxis {...AXIS} tickFormatter={(v) => fmtCurrency(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCurrency(v)} />
              <Bar dataKey="avgCltv" radius={[6, 6, 0, 0]}>
                {rfm.map((r) => <Cell key={r.rfmSegment} fill={SEG_COLORS[r.rfmSegment]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
