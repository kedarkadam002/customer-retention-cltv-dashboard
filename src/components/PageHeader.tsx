import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Filter } from "lucide-react";

interface Props {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/60">
          <Filter className="h-3.5 w-3.5" /> Filters
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/60">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
        </Button>
        <Button size="sm" className="h-8 gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export PDF
        </Button>
      </div>
    </div>
  );
}
