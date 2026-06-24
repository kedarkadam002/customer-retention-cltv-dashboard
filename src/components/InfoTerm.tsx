import { type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TERMS } from "@/lib/terms";

interface Props {
  term: string;
  children?: ReactNode;
  className?: string;
}

export function InfoTerm({ term, children, className }: Props) {
  const definition = TERMS[term];
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={
              "underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 cursor-help " +
              (className ?? "")
            }
          >
            {children ?? term}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed bg-card/95 border-border">
          <div className="font-medium text-primary mb-1">{term}</div>
          <div className="text-muted-foreground">{definition ?? "—"}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
