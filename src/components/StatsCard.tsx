import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  /** Numeric delta vs último teste. Positive = up, negative = down, 0/undefined = neutral/none */
  delta?: number | null;
  /** Suffix to display next to delta (e.g. "%", "pts") */
  deltaSuffix?: string;
  /** Label that explains comparison context */
  deltaLabel?: string;
  /** If true, a negative delta is considered good (e.g. for time metrics). Default: false */
  invertColors?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  delta = null,
  deltaSuffix = "",
  deltaLabel,
  invertColors = false,
}: StatsCardProps) {
  const hasDelta = delta !== null && delta !== undefined;
  const isUp = hasDelta && delta! > 0;
  const isDown = hasDelta && delta! < 0;
  const isPositive = invertColors ? isDown : isUp;
  const isNegative = invertColors ? isUp : isDown;

  const trendColor = isPositive
    ? "text-success"
    : isNegative
    ? "text-destructive"
    : "text-muted-foreground";

  const TrendIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;

  return (
    <Card className="border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm transition-colors">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {hasDelta ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${trendColor}`}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {delta! > 0 ? "+" : ""}
              {delta}
              {deltaSuffix}
            </span>
            <span className="text-muted-foreground">
              {deltaLabel ?? "vs último teste"}
            </span>
          </div>
        ) : subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : (
          <p className="text-xs text-muted-foreground/70">Sem dados anteriores</p>
        )}
      </CardContent>
    </Card>
  );
}
