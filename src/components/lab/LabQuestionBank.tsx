import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Database, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type QuestionRow = Tables<"questions">;
type Option = { key: string; text: Json };

function localizedText(value: Json, language: string): string {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "";
  const localized = value[language];
  if (typeof localized === "string" && localized) return localized;
  const portuguese = value["pt-br"];
  if (typeof portuguese === "string") return portuguese;
  return Object.values(value).find((item): item is string => typeof item === "string") ?? "";
}

function parseOptions(value: Json): Option[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) return [];
    const key = item.key;
    const text = item.text;
    if (typeof key !== "string" || text === undefined) return [];
    return [{ key, text }];
  });
}

function LabQuestionCard({ row }: { row: QuestionRow }) {
  const { user } = useAuth();
  const { language } = useQuiz();
  const [selected, setSelected] = useState<string | null>(null);
  const options = useMemo(() => parseOptions(row.options), [row.options]);
  const answered = selected !== null;
  const isCorrect = selected === row.correct_answer;

  const answer = async (optionKey: string) => {
    if (answered || !user) return;
    setSelected(optionKey);
    const { error } = await supabase.from("user_answers").insert({
      user_id: user.id,
      question_id: row.id,
      category: row.category,
      selected_answer: optionKey,
      is_correct: optionKey === row.correct_answer,
      time_spent: 0,
      mode: "lab",
    });
    if (error) toast.error("A resposta foi exibida, mas não pôde ser registrada no histórico.");
  };

  return (
    <Card className="border-2 border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline">{row.category}</Badge>
          <span className="text-xs text-muted-foreground">Questão #{row.id}</span>
        </div>
        {localizedText(row.scenario, language) ? (
          <p className="rounded-lg bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">
            {localizedText(row.scenario, language)}
          </p>
        ) : null}
        <CardTitle className="text-lg leading-relaxed">
          {localizedText(row.question, language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const correctOption = answered && option.key === row.correct_answer;
          const wrongSelection = answered && option.key === selected && !correctOption;
          return (
            <Button
              key={option.key}
              type="button"
              variant="outline"
              className={cn(
                "h-auto w-full justify-start whitespace-normal px-4 py-3 text-left",
                correctOption &&
                  "border-emerald-500 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/10 dark:text-emerald-200",
                wrongSelection &&
                  "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10",
              )}
              onClick={() => answer(option.key)}
              disabled={answered}
            >
              <span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted font-bold">
                {option.key}
              </span>
              {localizedText(option.text, language)}
            </Button>
          );
        })}

        {answered ? (
          <div
            className={cn(
              "mt-5 rounded-xl border p-4",
              isCorrect
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-destructive/30 bg-destructive/5",
            )}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Resposta correta
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" /> Resposta incorreta — correta:{" "}
                  {row.correct_answer}
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {localizedText(row.explanation, language)}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function LabQuestionBank() {
  const questionsQuery = useQuery({
    queryKey: ["lab-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="mb-12 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Perguntas do Laboratório</h2>
          <p className="text-sm text-muted-foreground">
            Questões publicadas pelo administrador e carregadas diretamente do Supabase.
          </p>
        </div>
      </div>

      {questionsQuery.isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando perguntas...
        </div>
      ) : questionsQuery.isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          Não foi possível carregar as perguntas do Laboratório.
        </div>
      ) : questionsQuery.data?.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {questionsQuery.data.map((row) => (
            <LabQuestionCard key={row.id} row={row} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          O administrador ainda não publicou perguntas para o Laboratório.
        </div>
      )}
    </section>
  );
}
