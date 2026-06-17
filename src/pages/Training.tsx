import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useQuiz } from "@/contexts/QuizContext";
import { Header } from "@/components/quiz/Header";
import { QuizSidebar } from "@/components/quiz/QuizSidebar";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { WeakTopicsCard } from "@/components/quiz/WeakTopicsCard";
import { CategorySelector } from "@/components/quiz/CategorySelector";
import { DiagnosticReport } from "@/components/quiz/DiagnosticReport";
import { questions } from "@/data/questions";
import { HorizontalNav } from "@/components/landing/HorizontalNav";

import { translations } from "@/data/translations";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import type { AnswerRecord } from "@/contexts/QuizContext";

type Phase = "select" | "quiz" | "diagnostic";

const Training = () => {
  const { language, setLanguage, recordAnswer } = useQuiz();
  const navigate = useNavigate();
  const t = translations[language];

  const [phase, setPhase] = useState<Phase>("select");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [localAnswers, setLocalAnswers] = useState<AnswerRecord[]>([]);

  const filteredQuestions = useMemo(
    () => categoryFilter ? questions.filter((q) => q.category === categoryFilter) : questions,
    [categoryFilter]
  );

  const currentQuestion = filteredQuestions[currentIndex];
  const totalQuestions = filteredQuestions.length;

  const handleSelectCategory = useCallback((category: string | null) => {
    setCategoryFilter(category);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setLocalAnswers([]);
    setQuestionStartTime(Date.now());
    setPhase("quiz");
  }, []);

  const checkAnswer = useCallback(() => {
    if (!selectedOption || isChecked) return;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const record: AnswerRecord = { questionId: currentQuestion.id, selectedAnswer: selectedOption, isCorrect, timeSpent };

    setLocalAnswers((prev) => [...prev.filter((a) => a.questionId !== currentQuestion.id), record]);
    recordAnswer(currentQuestion.id, selectedOption, timeSpent);
    setIsChecked(true);
  }, [selectedOption, isChecked, questionStartTime, currentQuestion, recordAnswer]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    const existing = localAnswers.find((a) => a.questionId === filteredQuestions[index].id);
    setSelectedOption(existing?.selectedAnswer ?? null);
    setIsChecked(!!existing);
    setQuestionStartTime(Date.now());
  }, [localAnswers, filteredQuestions]);

  const next = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      goToQuestion(currentIndex + 1);
    } else if (localAnswers.length === totalQuestions) {
      setPhase("diagnostic");
    }
  }, [currentIndex, totalQuestions, goToQuestion, localAnswers.length]);

  const previous = useCallback(() => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setLocalAnswers([]);
    setQuestionStartTime(Date.now());
  }, []);

  const backToCategories = useCallback(() => {
    setPhase("select");
    setCategoryFilter(null);
    resetQuiz();
  }, [resetQuiz]);

  const stats = useMemo(() => {
    const answered = localAnswers.length;
    const correct = localAnswers.filter((a) => a.isCorrect).length;
    const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const avgTime = answered > 0 ? Math.round(localAnswers.reduce((s, a) => s + a.timeSpent, 0) / answered) : 0;

    const categoryStats: Record<string, { total: number; correct: number }> = {};
    for (const q of filteredQuestions) {
      if (!categoryStats[q.category]) categoryStats[q.category] = { total: 0, correct: 0 };
      categoryStats[q.category].total++;
      const ans = localAnswers.find((a) => a.questionId === q.id);
      if (ans?.isCorrect) categoryStats[q.category].correct++;
    }

    const weakTopics = Object.entries(categoryStats)
      .map(([cat]) => {
        const catAnswers = localAnswers.filter((a) => filteredQuestions.find((q) => q.id === a.questionId)?.category === cat);
        const catCorrect = catAnswers.filter((a) => a.isCorrect).length;
        const accuracy = catAnswers.length > 0 ? Math.round((catCorrect / catAnswers.length) * 100) : -1;
        return { category: cat, accuracy };
      })
      .filter((t) => t.accuracy >= 0 && t.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);

    return { answered, correct, score, avgTime, categoryStats, weakTopics };
  }, [localAnswers, filteredQuestions]);

  const allAnswered = localAnswers.length === totalQuestions;

  if (phase === "select") {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header language={language} onLanguageChange={setLanguage} title={t.appTitle} onBack={() => navigate("/")} />
        <HorizontalNav language={language} />
        <CategorySelector language={language} onSelectCategory={handleSelectCategory} />
      </div>
    );
  }

  if (phase === "diagnostic") {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header language={language} onLanguageChange={setLanguage} title={t.appTitle} onBack={() => navigate("/")} />
        <HorizontalNav language={language} />
        <DiagnosticReport
          language={language}
          answers={localAnswers}
          questions={filteredQuestions}
          categoryFilter={categoryFilter}
          onRestart={resetQuiz}
          onBackToCategories={backToCategories}
        />
      </div>
    );
  }

  const sidebar = (
    <QuizSidebar
      language={language}
      currentIndex={currentIndex}
      answers={localAnswers}
      stats={stats}
      filteredQuestions={filteredQuestions}
      onGoToQuestion={(i) => { goToQuestion(i); }}
      onReset={resetQuiz}
      onFinish={allAnswered ? () => setPhase("diagnostic") : undefined}
    />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header language={language} onLanguageChange={setLanguage} title={categoryFilter ? `Treino — ${categoryFilter}` : "Modo Treino — DP-600"} onBack={backToCategories} />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex">{sidebar}</div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="lg:hidden flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-card">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  {t.progress}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[85vw] max-w-sm">
                {sidebar}
              </SheetContent>
            </Sheet>
            <span className="text-xs text-muted-foreground">
              {stats.answered}/{totalQuestions} · {stats.score}%
            </span>
          </div>
          {stats.weakTopics.length > 0 && (
            <WeakTopicsCard language={language} weakTopics={stats.weakTopics} />
          )}
          <QuestionCard
            question={currentQuestion}
            language={language}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isChecked={isChecked}
            onSelectOption={setSelectedOption}
            onCheck={checkAnswer}
            onNext={next}
            onPrevious={previous}
            onFinish={allAnswered ? () => setPhase("diagnostic") : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Training;
