import { PageHeader } from "@/components/PageHeader";
import { ChartCard } from "@/components/ChartCard";
import { CHART_COLORS } from "@/components/chartTheme";
import { ArrowRight } from "lucide-react";
import { InfoTerm } from "@/components/InfoTerm";


const STAGES = [
  { name: "Lead", value: 25000, color: CHART_COLORS[1] },
  { name: "First Purchase", value: 12500, color: CHART_COLORS[2] },
  { name: "Repeat Purchase", value: 7400, color: CHART_COLORS[3] },
  { name: "Loyal Customer", value: 3200, color: CHART_COLORS[4] },
  { name: "Advocate", value: 980, color: CHART_COLORS[0] },
];

export default function JourneyPage() {
  return (
    <div>
      <PageHeader title="Customer Journey Analytics" subtitle="Lifecycle progression from lead to advocate — conversion, drop-off, and bottlenecks." />

      <ChartCard title="Lifecycle Funnel" subtitle="Stage volumes and conversion between stages">
        <div className="flex items-stretch gap-2 md:gap-3 overflow-x-auto py-4">
          {STAGES.map((s, i) => {
            const next = STAGES[i + 1];
            const conv = next ? (next.value / s.value) * 100 : null;
            const dropoff = conv === null ? null : 100 - conv;
            return (
              <div key={s.name} className="flex items-center gap-2 md:gap-3 min-w-0">
                <div
                  className="relative rounded-xl p-5 min-w-[160px] flex-1 border border-border/40 transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(160deg, ${s.color}30, ${s.color}10)`,
                    borderColor: `${s.color}40`,
                  }}
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Stage {i + 1}</div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-2xl font-semibold kpi-value mt-2" style={{ color: s.color }}>
                    {s.value.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">customers</div>
                </div>
                {next && (
                  <div className="flex flex-col items-center min-w-[80px]">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-[11px] font-semibold mt-1" style={{ color: CHART_COLORS[2] }}>{conv!.toFixed(0)}%</div>
                    <div className="text-[10px] text-muted-foreground">conversion</div>
                    <div className="text-[10px] text-[color:var(--danger)] mt-1">↓ {dropoff!.toFixed(0)}% drop</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Journey Bottlenecks" subtitle="Largest drop-offs in the lifecycle">
          <div className="space-y-3 mt-2">
            {[
              { from: "Lead → First Purchase", drop: 50 },
              { from: "First Purchase → Repeat", drop: 41 },
              { from: "Repeat → Loyal", drop: 57 },
              { from: "Loyal → Advocate", drop: 69 },
            ].map((b, i) => (
              <div key={b.from}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{b.from}</span>
                  <span className="text-[color:var(--danger)] font-medium">{b.drop}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.drop}%`, background: CHART_COLORS[(i + 1) % CHART_COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Average Time in Stage">
          <div className="space-y-3 mt-2 text-sm">
            {[
              { s: "Lead", t: "18 days" },
              { s: "First Purchase", t: "94 days" },
              { s: "Repeat Purchase", t: "7 months" },
              { s: "Loyal Customer", t: "21 months" },
              { s: "Advocate", t: "42 months" },
            ].map((r) => (
              <div key={r.s} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                <span>{r.s}</span>
                <span className="text-muted-foreground">{r.t}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Key Insights">
          <ul className="space-y-2.5 text-sm mt-1">
            <li className="flex gap-2"><span className="text-primary">›</span><span>Largest <InfoTerm term="Drop-off Rate">drop-off</InfoTerm> occurs between Loyal and Advocate stages (69%) — consider an ambassador program.</span></li>
            <li className="flex gap-2"><span className="text-primary">›</span><span>Lead-to-First-Purchase conversion is below industry benchmark of 58%.</span></li>
            <li className="flex gap-2"><span className="text-primary">›</span><span>Repeat-purchase customers show 4.2× higher CLTV than single-purchase ones.</span></li>
            <li className="flex gap-2"><span className="text-primary">›</span><span>UK Hospitality segment moves through stages 32% faster than US average.</span></li>
          </ul>
        </ChartCard>
      </div>
    </div>
  );
}
