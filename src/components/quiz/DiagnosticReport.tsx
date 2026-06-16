import { type Language, type Question } from "@/data/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Target, Clock, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, RotateCcw, ArrowLeft, BookOpen
} from "lucide-react";
import type { AnswerRecord } from "@/contexts/QuizContext";

interface DiagnosticReportProps {
  language: Language;
  answers: AnswerRecord[];
  questions: Question[];
  categoryFilter: string | null;
  onRestart: () => void;
  onBackToCategories: () => void;
}

export function DiagnosticReport({
  language,
  answers,
  questions: quizQuestions,
  categoryFilter,
  onRestart,
  onBackToCategories,
}: DiagnosticReportProps) {
  const total = quizQuestions.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const incorrect = total - correct;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgTime = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.timeSpent, 0) / answers.length) : 0;

  // Category breakdown
  const categories = [...new Set(quizQuestions.map((q) => q.category))];
  const categoryResults = categories.map((cat) => {
    const catQuestions = quizQuestions.filter((q) => q.category === cat);
    const catAnswers = answers.filter((a) => catQuestions.some((q) => q.id === a.questionId));
    const catCorrect = catAnswers.filter((a) => a.isCorrect).length;
    const catScore = catAnswers.length > 0 ? Math.round((catCorrect / catAnswers.length) * 100) : 0;
    return { category: cat, total: catQuestions.length, correct: catCorrect, score: catScore };
  }).sort((a, b) => a.score - b.score);

  const weakCategories = categoryResults.filter((c) => c.score < 70);
  const strongCategories = categoryResults.filter((c) => c.score >= 70);

  const passed = score >= 70;

  const labels: Record<string, Record<Language, string>> = {
    title: {
      "pt-br": "Diagnóstico de Desempenho",
      "en-us": "Performance Diagnostic",
      "es": "Diagnóstico de Rendimiento",
      "fr": "Diagnostic de Performance",
    },
    passed: {
      "pt-br": "Aprovado! 🎉",
      "en-us": "Passed! 🎉",
      "es": "¡Aprobado! 🎉",
      "fr": "Réussi ! 🎉",
    },
    failed: {
      "pt-br": "Continue Estudando 💪",
      "en-us": "Keep Studying 💪",
      "es": "Sigue Estudiando 💪",
      "fr": "Continuez à Étudier 💪",
    },
    score: {
      "pt-br": "Pontuação",
      "en-us": "Score",
      "es": "Puntuación",
      "fr": "Score",
    },
    correctLabel: {
      "pt-br": "Corretas",
      "en-us": "Correct",
      "es": "Correctas",
      "fr": "Correctes",
    },
    incorrectLabel: {
      "pt-br": "Incorretas",
      "en-us": "Incorrect",
      "es": "Incorrectas",
      "fr": "Incorrectes",
    },
    avgTimeLabel: {
      "pt-br": "Tempo Médio",
      "en-us": "Avg Time",
      "es": "Tiempo Promedio",
      "fr": "Temps Moyen",
    },
    seconds: {
      "pt-br": "seg",
      "en-us": "sec",
      "es": "seg",
      "fr": "sec",
    },
    focusAreas: {
      "pt-br": "📚 Áreas para Focar",
      "en-us": "📚 Areas to Focus",
      "es": "📚 Áreas para Enfocar",
      "fr": "📚 Domaines à Travailler",
    },
    focusDesc: {
      "pt-br": "Essas categorias precisam de mais atenção. Recomendamos praticar novamente:",
      "en-us": "These categories need more attention. We recommend practicing again:",
      "es": "Estas categorías necesitan más atención. Recomendamos practicar de nuevo:",
      "fr": "Ces catégories nécessitent plus d'attention. Nous recommandons de pratiquer à nouveau :",
    },
    strengths: {
      "pt-br": "💪 Pontos Fortes",
      "en-us": "💪 Strengths",
      "es": "💪 Puntos Fuertes",
      "fr": "💪 Points Forts",
    },
    categoryBreakdown: {
      "pt-br": "Desempenho por Categoria",
      "en-us": "Performance by Category",
      "es": "Rendimiento por Categoría",
      "fr": "Performance par Catégorie",
    },
    restart: {
      "pt-br": "Refazer",
      "en-us": "Restart",
      "es": "Reiniciar",
      "fr": "Recommencer",
    },
    backToCategories: {
      "pt-br": "Voltar às Categorias",
      "en-us": "Back to Categories",
      "es": "Volver a Categorías",
      "fr": "Retour aux Catégories",
    },
    noWeakAreas: {
      "pt-br": "Parabéns! Você não tem áreas fracas. Continue praticando para manter o nível!",
      "en-us": "Congratulations! You have no weak areas. Keep practicing to maintain your level!",
      "es": "¡Felicitaciones! No tienes áreas débiles. ¡Sigue practicando para mantener el nivel!",
      "fr": "Félicitations ! Vous n'avez aucun point faible. Continuez à pratiquer !",
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">{labels.title[language]}</h1>
          {categoryFilter && (
            <Badge variant="outline" className="text-sm">{categoryFilter}</Badge>
          )}
          <div className={`text-2xl font-bold ${passed ? "text-success" : "text-warning"}`}>
            {passed ? labels.passed[language] : labels.failed[language]}
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className={`h-6 w-6 mx-auto mb-2 ${passed ? "text-success" : "text-warning"}`} />
              <p className="text-2xl font-bold">{score}%</p>
              <p className="text-xs text-muted-foreground">{labels.score[language]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{correct}</p>
              <p className="text-xs text-muted-foreground">{labels.correctLabel[language]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold">{incorrect}</p>
              <p className="text-xs text-muted-foreground">{labels.incorrectLabel[language]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{avgTime}{labels.seconds[language]}</p>
              <p className="text-xs text-muted-foreground">{labels.avgTimeLabel[language]}</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              {labels.categoryBreakdown[language]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryResults.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className={`text-sm font-bold ${cat.score >= 70 ? "text-success" : "text-destructive"}`}>
                    {cat.score}% ({cat.correct}/{cat.total})
                  </span>
                </div>
                <Progress value={cat.score} className={`h-2.5 ${cat.score >= 70 ? "[&>div]:bg-success" : "[&>div]:bg-destructive"}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Focus Areas */}
        {weakCategories.length > 0 ? (
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {labels.focusAreas[language]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{labels.focusDesc[language]}</p>
              {weakCategories.map((cat) => (
                <div key={cat.category} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.correct}/{cat.total} ({cat.score}%)</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-success/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm text-muted-foreground">{labels.noWeakAreas[language]}</p>
            </CardContent>
          </Card>
        )}

        {/* Strengths */}
        {strongCategories.length > 0 && (
          <Card className="border-success/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-success">
                <TrendingUp className="h-5 w-5" />
                {labels.strengths[language]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {strongCategories.map((cat) => (
                  <Badge key={cat.category} variant="outline" className="border-success/30 text-success">
                    {cat.category} — {cat.score}%
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={onBackToCategories} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {labels.backToCategories[language]}
          </Button>
          <Button variant="hero" onClick={onRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {labels.restart[language]}
          </Button>
        </div>
      </div>
    </div>
  );
}
