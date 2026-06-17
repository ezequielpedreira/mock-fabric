import { type Domain, DOMAIN_LABELS } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";

interface DomainProgressProps {
  domain: Domain;
  correct: number;
  total: number;
}

export function DomainProgress({ domain, correct, total }: DomainProgressProps) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-foreground min-w-0 truncate">{DOMAIN_LABELS[domain]}</span>
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
          {total > 0 ? `${correct}/${total} (${percent}%)` : "—"}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
