import {
  CheckCircle2,
  XCircle,
  Circle,
  Trophy,
  Clock,
  BarChart3,
  RotateCcw,
  Flag,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { questions as allQuestions, type Language, type Question } from "@/data/questions";
import { translations } from "@/data/translations";
import type { AnswerRecord } from "@/hooks/useQuiz";

interface QuizSidebarProps {
  language: Language;
  currentIndex: number;
  answers: AnswerRecord[];
  stats: {
    answered: number;
    correct: number;
    score: number;
    avgTime: number;
    categoryStats: Record<string, { total: number; correct: number }>;
  };
  filteredQuestions?: Question[];
  onGoToQuestion: (index: number) => void;
  onReset: () => void;
  onFinish?: () => void;
}

export function QuizSidebar({
  language,
  currentIndex,
  answers,
  stats,
  filteredQuestions,
  onGoToQuestion,
  onReset,
  onFinish,
}: QuizSidebarProps) {
  const t = translations[language];
  const displayQuestions = filteredQuestions || allQuestions;
  const progressPercent = (stats.answered / displayQuestions.length) * 100;

  return (
    <aside className="h-full w-full shrink-0 overflow-y-auto border-sidebar-border bg-[linear-gradient(165deg,var(--sidebar),color-mix(in_oklch,var(--sidebar)_82%,var(--fabric-violet)))] text-sidebar-foreground lg:w-72 lg:border-r">
      {/* Progress */}
      <div className="p-5 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sidebar-muted mb-3">
          {t.progress}
        </h2>
        <Progress value={progressPercent} className="h-2 mb-2" />
        <p className="text-xs text-sidebar-muted">
          {stats.answered} {t.of} {displayQuestions.length} {t.completed.toLowerCase()}
        </p>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {displayQuestions.map((q, i) => {
            const ans = answers.find((a) => a.questionId === q.id);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => onGoToQuestion(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium transition-all sm:h-7 sm:w-7 sm:rounded-md ${
                  isCurrent
                    ? "ring-2 ring-sidebar-primary bg-sidebar-accent"
                    : ans?.isCorrect
                      ? "bg-success/20 text-success"
                      : ans
                        ? "bg-destructive/20 text-destructive"
                        : "bg-sidebar-accent text-sidebar-muted hover:bg-sidebar-accent/80"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance */}
      <div className="p-5 flex-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sidebar-muted mb-4">
          {t.performance}
        </h2>

        <div className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-sidebar-primary" />
            </div>
            <div>
              <p className="text-xs text-sidebar-muted">{t.overallScore}</p>
              <p className="text-lg font-bold">{stats.score}%</p>
            </div>
          </div>

          {/* Avg Time */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-sidebar-muted">{t.avgTime}</p>
              <p className="text-lg font-bold">
                {stats.avgTime}
                {t.seconds}
              </p>
            </div>
          </div>

          {/* Category Accuracy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-sidebar-muted" />
              <p className="text-xs text-sidebar-muted">{t.accuracyByCategory}</p>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.categoryStats).map(([cat, { total, correct }]) => {
                const catAnswers = answers.filter(
                  (a) => displayQuestions.find((q) => q.id === a.questionId)?.category === cat,
                );
                const accuracy =
                  catAnswers.length > 0 ? Math.round((correct / catAnswers.length) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-sidebar-foreground">{cat}</span>
                      <span className="text-sidebar-muted">
                        {catAnswers.length > 0 ? `${accuracy}%` : "—"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-sidebar-accent overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sidebar-primary transition-all duration-500"
                        style={{ width: `${catAnswers.length > 0 ? accuracy : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-sidebar-border space-y-2">
        {onFinish && (
          <Button variant="default" size="sm" onClick={onFinish} className="w-full gap-2">
            <Flag className="h-3.5 w-3.5" />
            {language === "pt-br"
              ? "Ver Diagnóstico"
              : language === "es"
                ? "Ver Diagnóstico"
                : language === "fr"
                  ? "Voir Diagnostic"
                  : "View Diagnostic"}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t.resetQuiz}
        </Button>
      </div>
    </aside>
  );
}
