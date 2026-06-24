import { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { InfoTerm } from "./InfoTerm";
import { TERMS } from "@/lib/terms";

interface Props {
  label: string;
  value: ReactNode;
  delta?: number; // % change
  deltaPositiveIsGood?: boolean;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export function KpiCard({ label, value, delta, deltaPositiveIsGood = true, hint, icon, accent = "neutral" }: Props) {
  const good = delta === undefined ? null : deltaPositiveIsGood ? delta >= 0 : delta <= 0;
  const accentRing = {
    primary: "before:bg-primary",
    success: "before:bg-[color:var(--success)]",
    warning: "before:bg-[color:var(--warning)]",
    danger: "before:bg-[color:var(--danger)]",
    neutral: "before:bg-muted-foreground/30",
  }[accent];

  const hasTerm = TERMS[label] !== undefined;

  return (
    <div
      className={
        "glass-card relative overflow-hidden p-5 group transition-all hover:translate-y-[-1px] " +
        "before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:rounded-r-full " +
        accentRing
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
          {hasTerm ? <InfoTerm term={label}>{label}</InfoTerm> : label}
        </div>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>
      <div className="mt-3 text-[28px] font-semibold kpi-value text-foreground">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={
              "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-medium " +
              (good
                ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                : "bg-[color:var(--danger)]/15 text-[color:var(--danger)]")
            }
          >
            {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
