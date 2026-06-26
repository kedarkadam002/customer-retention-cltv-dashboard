import { useState } from "react";
import { Send, Sparkles, TrendingUp, AlertTriangle, Gem, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getKpis, fmtCurrency, fmtNumber, bySegmentMetrics, byRfmSegment } from "@/lib/mockData";


type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  { icon: AlertTriangle, q: "Which customers are most likely to churn?" },
  { icon: Gem, q: "Which segment generates highest CLTV?" },
  { icon: TrendingUp, q: "Show revenue at risk." },
  { icon: Users, q: "Explain retention trends." },
];

function answerFor(q: string): string {
  const ql = q.toLowerCase();
  const k = getKpis();
  const seg = bySegmentMetrics().sort((a, b) => b.cltv - a.cltv);
  const rfm = byRfmSegment().sort((a, b) => b.revenue - a.revenue);

  if (ql.includes("churn") && (ql.includes("likely") || ql.includes("at risk") || ql.includes("which"))) {
    return `Across the TV business, ${fmtNumber(Math.round(k.total * 0.12))} customers currently exceed a 60% churn probability — concentrated in the **SMB** segment in the UK and **Consumer** segment in the US. The top 50 at-risk accounts represent ${fmtCurrency(k.revenueAtRisk * 0.4)} of pipeline. Primary drivers: low engagement (38%), declining purchase cadence (28%), and unresolved service tickets (14%).`;
  }
  if (ql.includes("cltv") || ql.includes("lifetime value")) {
    const top = seg[0];
    return `The **${top.segment}** segment generates the highest average CLTV at **${fmtCurrency(top.cltv)}**, roughly ${(top.cltv / seg[seg.length - 1].cltv).toFixed(1)}× the lowest segment. These accounts also exhibit the strongest retention (${top.retention}%). Recommendation: expand executive-led account programs and prioritize them in the FY25 success playbook.`;
  }
  if (ql.includes("revenue at risk") || ql.includes("risk")) {
    return `Current revenue at risk is **${fmtCurrency(k.revenueAtRisk)}**, representing ${((k.revenueAtRisk / k.totalRevenue) * 100).toFixed(1)}% of the active book. The largest exposure is in the UK Hospitality vertical (~$14M) where competitor display deployments are accelerating. Suggested mitigation: bundle Pro:Centric service contracts and offer 18-month extended warranties to top 25 accounts.`;
  }
  if (ql.includes("retention") || ql.includes("trend")) {
    return `Retention improved **+6.4%** QoQ, lifting the rolling rate to **${k.retentionRate}%**. Enterprise (+9.2%) and Mid-Market (+5.1%) lead the gains; Consumer is flat. Driver analysis points to the Q4 firmware reliability program and expanded CSM coverage in the US Northeast as the strongest contributors.`;
  }
  if (ql.includes("recommend") || ql.includes("action")) {
    return `**Top 3 recommended actions for next quarter:**\n• Launch a "Top 50 Save" program targeting at-risk Enterprise accounts (~${fmtCurrency(k.revenueAtRisk * 0.4)} protected).\n• Convert ${rfm.find(r => r.rfmSegment === "Potential Loyalists")?.customers.toLocaleString() ?? "—"} *Potential Loyalists* into *Champions* via a guided cross-sell to QNED MiniLED 90.\n• Investigate UK SMB churn — bundle financing options to ease price sensitivity.`;
  }
  return `Insight summary: total customer base of ${fmtNumber(k.total)} with a retention rate of ${k.retentionRate}% and average CLTV of ${fmtCurrency(k.avgCltv)}. Ask me about churn risk, CLTV by segment, revenue at risk, or retention drivers for a deeper view.`;
}

export default function AiInsights() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Welcome — I'm your LG Retention Cloud AI analyst. I can analyze churn risk, CLTV, segment performance, and recommend retention actions. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answerFor(q) }]);
    setInput("");
  };

  return (
    <div>
      <PageHeader title="AI Insights Center" subtitle="Conversational analyst for retention, churn, and lifetime-value questions." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 glass-card p-0 flex flex-col" style={{ minHeight: 620 }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={"flex gap-3 " + (m.role === "user" ? "justify-end" : "")}>
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/40 border border-border/40 rounded-tl-sm")
                  }
                >
                  {m.text.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : ""}
                       dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/40 p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about churn, CLTV, segments, or recommended actions…"
                className="bg-muted/30 border-border/60 h-11"
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground px-1">Suggested Questions</div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.q}
              onClick={() => send(s.q)}
              className="w-full text-left glass-card p-3 flex items-start gap-3 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 grid place-items-center shrink-0 group-hover:bg-primary/20">
                <s.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs text-foreground">{s.q}</span>
            </button>
          ))}
          <div className="glass-card p-4 mt-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Recent Insight</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Premium segment customers with declining engagement and purchase frequency show <span className="text-foreground font-semibold">83% higher</span> churn probability. Consider proactive retention campaigns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
