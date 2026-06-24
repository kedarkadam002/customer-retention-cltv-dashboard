import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Filter, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCustomers } from "@/lib/mockData";
import { toast } from "sonner";

interface Props {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}

function downloadCsv() {
  const rows = getCustomers();
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? "")).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lg-tv-customers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${rows.length.toLocaleString()} customer records`);
}

const REGIONS = ["US", "UK"];
const SEGMENTS = ["Enterprise", "Mid-Market", "SMB", "Consumer"];

export function PageHeader({ title, subtitle, children }: Props) {
  const [region, setRegion] = useState<string[]>([...REGIONS]);
  const [segment, setSegment] = useState<string[]>([...SEGMENTS]);

  const toggle = (
    arr: string[],
    setter: (v: string[]) => void,
    v: string
  ) => setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const activeFilters =
    (region.length < REGIONS.length ? 1 : 0) +
    (segment.length < SEGMENTS.length ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border/60">
              <Filter className="h-3.5 w-3.5" /> Filters
              {activeFilters > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Region
            </div>
            <div className="space-y-1 mb-3">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggle(region, setRegion, r)}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted/50 text-sm"
                >
                  <span>{r}</span>
                  {region.includes(r) && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Segment
            </div>
            <div className="space-y-1">
              {SEGMENTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(segment, setSegment, s)}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted/50 text-sm"
                >
                  <span>{s}</span>
                  {segment.includes(s) && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-border/60"
          onClick={downloadCsv}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
        </Button>
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            window.print();
            toast.success("Opening print dialog — save as PDF");
          }}
        >
          <Download className="h-3.5 w-3.5" /> Export PDF
        </Button>
      </div>
    </div>
  );
}
