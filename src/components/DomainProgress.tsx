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
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{DOMAIN_LABELS[domain]}</span>
        <span className="text-sm text-muted-foreground">
          {total > 0 ? `${correct}/${total} (${percent}%)` : "—"}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
