import { useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TERMS } from "@/lib/terms";
import { Info } from "lucide-react";

interface Props {
  term: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Definition popover that opens on hover AND click — works on desktop
 * (hover) and touch (tap). Uses Radix Popover controlled state.
 */
export function InfoTerm({ term, children, className }: Props) {
  const [open, setOpen] = useState(false);
  const definition = TERMS[term];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          tabIndex={0}
          className={
            "inline-flex items-center gap-1 underline decoration-dotted decoration-primary/50 underline-offset-4 cursor-help outline-none " +
            (className ?? "")
          }
        >
          {children ?? term}
          <Info className="h-3 w-3 text-primary/70 shrink-0" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className="w-72 text-xs leading-relaxed bg-popover/95 backdrop-blur-md border-border p-3"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="font-semibold text-primary mb-1 text-[13px]">{term}</div>
        <div className="text-muted-foreground">{definition ?? "Definition not available."}</div>
      </PopoverContent>
    </Popover>
  );
}
