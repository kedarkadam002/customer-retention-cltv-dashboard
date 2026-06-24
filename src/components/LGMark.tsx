// Stylized LG-inspired brand mark (custom mark — not a reproduction of the trademarked LG logo art)
interface Props {
  size?: number;
  showWordmark?: boolean;
}

export function LGMark({ size = 36, showWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative rounded-full flex items-center justify-center font-bold text-white shrink-0"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle at 30% 30%, oklch(0.65 0.24 18), oklch(0.42 0.2 15))",
          boxShadow: "0 4px 14px -2px oklch(0.58 0.21 18 / 60%), inset 0 1px 0 oklch(1 0 0 / 25%)",
          fontSize: size * 0.42,
          letterSpacing: "-0.05em",
        }}
      >
        <span className="leading-none tracking-tighter">LG</span>
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-foreground">LG Electronics</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Retention Cloud</div>
        </div>
      )}
    </div>
  );
}
