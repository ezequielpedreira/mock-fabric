import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { CheckCircle2, Database, Loader2, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/quiz/Header";
import { HorizontalNav } from "@/components/landing/HorizontalNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

const categories = [
  "Segurança e Governança",
  "Ciclo de Vida",
  "Obter Dados",
  "Transformar Dados",
  "Consultar e Analisar",
  "Projetar Modelos Semânticos",
  "Otimizar Modelos Semânticos",
];

const optionKeys = ["A", "B", "C", "D"] as const;

type QuestionRow = Tables<"questions">;

function portugueseText(value: Json): string {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "";
  const text = value["pt-br"];
  return typeof text === "string" ? text : "";
}

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { language, setLanguage } = useQuiz();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState(categories[0]);
  const [scenario, setScenario] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Record<(typeof optionKeys)[number], string>>({
    A: "",
    B: "",
    C: "",
    D: "",
  });
  const [correctAnswer, setCorrectAnswer] = useState<(typeof optionKeys)[number]>("A");
  const [explanation, setExplanation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const questionsQuery = useQuery({
    queryKey: ["admin-questions"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!isAdmin) return <Navigate to="/" replace />;

  const resetForm = () => {
    setCategory(categories[0]);
    setScenario("");
    setQuestion("");
    setOptions({ A: "", B: "", C: "", D: "" });
    setCorrectAnswer("A");
    setExplanation("");
    setIsActive(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !user ||
      !question.trim() ||
      !explanation.trim() ||
      optionKeys.some((key) => !options[key].trim())
    ) {
      toast.error("Preencha a pergunta, as quatro alternativas e a explicação.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("questions").insert({
      category,
      scenario: { "pt-br": scenario.trim() },
      question: { "pt-br": question.trim() },
      options: optionKeys.map((key) => ({ key, text: { "pt-br": options[key].trim() } })),
      correct_answer: correctAnswer,
      explanation: { "pt-br": explanation.trim() },
      is_active: isActive,
      created_by: user.id,
    });
    setSubmitting(false);

    if (error) {
      toast.error(`Não foi possível salvar: ${error.message}`);
      return;
    }

    resetForm();
    await queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    await queryClient.invalidateQueries({ queryKey: ["published-questions"] });
    toast.success("Pergunta salva e publicada nos modos Treino e Prova.");
  };

  const toggleQuestion = async (row: QuestionRow) => {
    const { error } = await supabase
      .from("questions")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) {
      toast.error(`Não foi possível atualizar: ${error.message}`);
      return;
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] }),
      queryClient.invalidateQueries({ queryKey: ["published-questions"] }),
    ]);
  };

  const savedQuestions = questionsQuery.data ?? [];
  const activeCount = savedQuestions.filter((item) => item.is_active).length;

  return (
    <div className="min-h-screen bg-muted/20">
      <Header language={language} onLanguageChange={setLanguage} title="Portal Administrativo" />
      <HorizontalNav language={language} />

      <main className="container space-y-8 py-10">
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="grid gap-6 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="space-y-3">
              <Badge className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Acesso exclusivo do administrador
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Banco de perguntas do Treino e da Prova
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Cadastre perguntas em português. As alternativas, a resposta correta e a explicação
                são gravadas no Supabase e publicadas nos modos Treino e Prova.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border bg-background/80 p-4">
                <div className="text-2xl font-bold">{savedQuestions.length}</div>
                <div className="text-xs text-muted-foreground">Cadastradas</div>
              </div>
              <div className="rounded-xl border bg-background/80 p-4">
                <div className="text-2xl font-bold text-emerald-600">{activeCount}</div>
                <div className="text-xs text-muted-foreground">Publicadas</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Nova pergunta
              </CardTitle>
              <CardDescription>
                Todos os campos marcados como obrigatórios são enviados diretamente ao Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario">Cenário ou contexto</Label>
                  <Textarea
                    id="scenario"
                    value={scenario}
                    onChange={(event) => setScenario(event.target.value)}
                    placeholder="Descreva a situação apresentada ao aluno."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Pergunta *</Label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Qual recurso deve ser utilizado?"
                    rows={3}
                    required
                  />
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">Alternativas *</legend>
                  {optionKeys.map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-bold">
                        {key}
                      </span>
                      <Input
                        aria-label={`Alternativa ${key}`}
                        value={options[key]}
                        onChange={(event) =>
                          setOptions((current) => ({ ...current, [key]: event.target.value }))
                        }
                        placeholder={`Texto da alternativa ${key}`}
                        required
                      />
                    </div>
                  ))}
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Resposta correta</Label>
                    <Select
                      value={correctAnswer}
                      onValueChange={(value) => setCorrectAnswer(value as typeof correctAnswer)}
                    >
                      <SelectTrigger id="correct-answer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {optionKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            Alternativa {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <Label htmlFor="publish-now">Publicar agora</Label>
                      <p className="text-xs text-muted-foreground">
                        Disponível no Treino e na Prova
                      </p>
                    </div>
                    <Switch id="publish-now" checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explicação da resposta *</Label>
                  <Textarea
                    id="explanation"
                    value={explanation}
                    onChange={(event) => setExplanation(event.target.value)}
                    placeholder="Explique por que a alternativa correta resolve o cenário."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  {submitting ? "Salvando no Supabase..." : "Salvar pergunta"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Perguntas cadastradas</CardTitle>
              <CardDescription>Ative ou pause a publicação sem excluir o conteúdo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {questionsQuery.isLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando...
                </div>
              ) : savedQuestions.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Nenhuma pergunta cadastrada ainda.
                </div>
              ) : (
                savedQuestions.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <p className="font-medium leading-snug">{portugueseText(item.question)}</p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Resposta correta: {item.correct_answer}
                        </p>
                      </div>
                      <Switch
                        aria-label={item.is_active ? "Pausar publicação" : "Publicar pergunta"}
                        checked={item.is_active}
                        onCheckedChange={() => toggleQuestion(item)}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
