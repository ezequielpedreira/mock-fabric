import { AlertTriangle, TrendingDown } from "lucide-react";
import { type Language } from "@/data/questions";
import { translations } from "@/data/translations";

interface WeakTopicsCardProps {
  language: Language;
  weakTopics: { category: string; accuracy: number }[];
}

export function WeakTopicsCard({ language, weakTopics }: WeakTopicsCardProps) {
  const t = translations[language];

  if (weakTopics.length === 0) return null;

  return (
    <div className="mx-6 md:mx-10 mb-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-foreground">{t.weakTopics}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{t.weakTopicsDesc}</p>
          <div className="space-y-2">
            {weakTopics.map((topic) => (
              <div
                key={topic.category}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {topic.accuracy < 50 ? t.lowPerformance : t.difficulty} {topic.category}
                  </p>
                </div>
                <span className="text-sm font-bold text-warning">{topic.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
