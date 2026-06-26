import { Brain, Target, Coins, Repeat, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS, AXIS, GRID, tooltipStyle } from "@/components/chartTheme";
import { InfoTerm } from "@/components/InfoTerm";


const MODELS = [
  {
    name: "Customer Churn Prediction",
    icon: ShieldCheck,
    accuracy: 92.4,
    auc: 0.94,
    algo: "Gradient Boosted Trees · XGBoost",
    features: [
      { f: "Engagement Score", w: 28 },
      { f: "Purchase Recency", w: 22 },
      { f: "Support Tickets", w: 16 },
      { f: "Order Frequency", w: 14 },
      { f: "Tenure", w: 11 },
      { f: "Segment", w: 9 },
    ],
  },
  {
    name: "Customer Lifetime Value Prediction",
    icon: Coins,
    accuracy: 88.7,
    auc: 0.91,
    algo: "Gamma-Gamma + BG/NBD",
    features: [
      { f: "Avg Order Value", w: 31 },
      { f: "Purchase Frequency", w: 24 },
      { f: "Segment", w: 18 },
      { f: "Tenure", w: 14 },
      { f: "Region", w: 8 },
      { f: "Industry", w: 5 },
    ],
  },
  {
    name: "Next Purchase Prediction",
    icon: Repeat,
    accuracy: 85.1,
    auc: 0.87,
    algo: "LightGBM + temporal features",
    features: [
      { f: "Days Since Last Order", w: 34 },
      { f: "Avg Inter-Order Gap", w: 22 },
      { f: "Engagement Score", w: 17 },
      { f: "Product Mix", w: 12 },
      { f: "Seasonality", w: 10 },
      { f: "Promotion Exposure", w: 5 },
    ],
  },
  {
    name: "Customer Retention Score",
    icon: Target,
    accuracy: 90.3,
    auc: 0.92,
    algo: "Ensemble (RF + Logistic)",
    features: [
      { f: "Recency", w: 26 },
      { f: "Engagement Score", w: 23 },
      { f: "Frequency", w: 18 },
      { f: "Service Health", w: 15 },
      { f: "Monetary", w: 12 },
      { f: "Tenure", w: 6 },
    ],
  },
];

export default function Predictive() {
  return (
    <div>
      <PageHeader title="Predictive Analytics" subtitle="Production ML models powering retention, lifetime value, and next-best-action recommendations." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {MODELS.map((m) => (
          <div key={m.name} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
                <m.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Model</div>
            </div>
            <div className="text-sm font-semibold leading-snug min-h-[40px]">{m.name}</div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-2xl font-semibold kpi-value text-[color:var(--success)]">{m.accuracy}%</div>
              <div className="text-[11px] text-muted-foreground"><InfoTerm term="Model Accuracy">accuracy</InfoTerm></div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">AUC {m.auc} · {m.algo}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MODELS.map((m) => (
          <ChartCard
            key={m.name}
            title={m.name}
            subtitle={<><InfoTerm term="Feature Importance">Feature importance</InfoTerm> — top inputs driving predictions</> as unknown as string}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={m.features} layout="vertical">
                <CartesianGrid {...GRID} />
                <XAxis type="number" {...AXIS} tickFormatter={(v) => `${v}%`} domain={[0, 40]} />
                <YAxis type="category" dataKey="f" {...AXIS} width={140} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="w" radius={[0, 6, 6, 0]}>
                  {m.features.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-md bg-muted/30 px-2 py-1.5 border border-border/40">
                <div className="text-muted-foreground">Predictions / day</div>
                <div className="font-semibold text-foreground">112,400</div>
              </div>
              <div className="rounded-md bg-muted/30 px-2 py-1.5 border border-border/40">
                <div className="text-muted-foreground">Last trained</div>
                <div className="font-semibold text-foreground">2 days ago</div>
              </div>
              <div className="rounded-md bg-muted/30 px-2 py-1.5 border border-border/40">
                <div className="text-muted-foreground">Drift</div>
                <div className="font-semibold text-[color:var(--success)]">Stable</div>
              </div>
            </div>
          </ChartCard>
        ))}
      </div>

      <div className="glass-card p-5 mt-6 flex gap-4">
        <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center shrink-0">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="text-sm font-semibold mb-1">Model Operations</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All four production models are retrained weekly on the unified customer warehouse (S3 + Snowflake). Predictions are scored nightly and surfaced into Salesforce and Gainsight for CSM workflows. SHAP-based explanations are available per prediction.
          </p>
        </div>
      </div>
    </div>
  );
}
