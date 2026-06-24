import { type ReactNode } from "react";
import { InfoTerm } from "./InfoTerm";
import { TERMS } from "@/lib/terms";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className, action }: Props) {
  const hasTerm = TERMS[title] !== undefined;
  return (
    <div className={"glass-card p-5 " + (className ?? "")}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {hasTerm ? <InfoTerm term={title}>{title}</InfoTerm> : title}
          </h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
