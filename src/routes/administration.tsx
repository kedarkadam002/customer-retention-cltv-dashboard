import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChartCard } from "@/components/ChartCard";
import { Calendar, Database, Key, Users, Shield, FileDown } from "lucide-react";

export const Route = createFileRoute("/administration")({
  head: () => ({ meta: [{ title: "Administration · LG" }] }),
  component: Administration,
});

function Administration() {
  return (
    <div>
      <PageHeader title="Administration" subtitle="Workspace configuration, scheduled reports, integrations, and access controls." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Scheduled Reports" subtitle="Automated executive distribution">
          <div className="space-y-3 mt-1">
            {[
              { name: "CRO Weekly Retention Brief", cadence: "Mondays · 7:00 AM EST", recipients: 8, enabled: true },
              { name: "Churn Risk Daily Digest", cadence: "Daily · 6:00 AM EST", recipients: 22, enabled: true },
              { name: "Quarterly CLTV Executive Pack", cadence: "Quarterly · End of quarter", recipients: 14, enabled: true },
              { name: "UK Region Performance Brief", cadence: "Fridays · 4:00 PM GMT", recipients: 6, enabled: false },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-3 p-3 rounded-md border border-border/40 bg-muted/15">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.cadence} · {r.recipients} recipients</div>
                </div>
                <Switch defaultChecked={r.enabled} />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2">+ New scheduled report</Button>
          </div>
        </ChartCard>

        <ChartCard title="Saved Filters & Views">
          <div className="space-y-2 mt-1">
            {[
              "US Enterprise · High CLTV · Low Engagement",
              "UK SMB · At Risk · Q4 cohort",
              "Hospitality · Pro:Centric · Active",
              "Top 50 Save Program · Watchlist",
              "OLED evo G4 · First-time buyers",
            ].map((f) => (
              <div key={f} className="flex items-center justify-between px-3 py-2 rounded-md border border-border/40 bg-muted/15 text-sm">
                <span>{f}</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Open</Button>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Data Sources & Integrations">
          <div className="space-y-2 mt-1">
            {[
              { name: "Snowflake — LG_DW_CUSTOMER", status: "Connected", color: "text-[color:var(--success)]" },
              { name: "Salesforce — Service Cloud", status: "Connected", color: "text-[color:var(--success)]" },
              { name: "Gainsight CS", status: "Connected", color: "text-[color:var(--success)]" },
              { name: "SAP S/4HANA — Orders", status: "Syncing", color: "text-[color:var(--warning)]" },
              { name: "Marketo — Engagement", status: "Connected", color: "text-[color:var(--success)]" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border/40 bg-muted/15 text-sm">
                <div className="flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>{s.name}</span>
                </div>
                <span className={"text-xs font-medium " + s.color}>{s.status}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Access & Roles">
          <div className="space-y-2 mt-1 text-sm">
            {[
              { role: "Executive (CRO, VP Sales)", users: 12, icon: Shield },
              { role: "Customer Success Managers", users: 84, icon: Users },
              { role: "Revenue Operations", users: 23, icon: Key },
              { role: "Marketing Analysts", users: 17, icon: Users },
            ].map((r) => (
              <div key={r.role} className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border/40 bg-muted/15">
                <div className="flex items-center gap-2.5">
                  <r.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{r.role}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.users} users</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="glass-card p-5 mt-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FileDown className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">Workspace Export</div>
            <div className="text-xs text-muted-foreground">Export full configuration, dashboards, and saved views.</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Config</Button>
          <Button size="sm">Generate Workspace Backup</Button>
        </div>
      </div>
    </div>
  );
}
