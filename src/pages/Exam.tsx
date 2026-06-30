import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useQuiz } from "@/contexts/QuizContext";
import { Header } from "@/components/quiz/Header";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { DiagnosticReport } from "@/components/quiz/DiagnosticReport";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";
import type { AnswerRecord } from "@/contexts/QuizContext";

const EXAM_DURATION = 60 * 60; // 60 min in seconds
const EXAM_QUESTION_COUNT = 60;

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function shuffleAnswers<T extends { id: number; options: { key: string; text: any }[]; correctAnswer: string }>(qs: T[]): T[] {
  return qs.map((q) => {
    const texts = q.options.map((o) => o.text);
    // Fisher-Yates on texts
    for (let i = texts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [texts[i], texts[j]] = [texts[j], texts[i]];
    }
    const orderedKeys = q.options.map((o) => o.key);
    const correctText = q.options.find((o) => o.key === q.correctAnswer)?.text;
    const newOptions = orderedKeys.map((key, idx) => ({ key, text: texts[idx] }));
    const newCorrect = newOptions.find((o) => o.text === correctText)?.key ?? q.correctAnswer;
    return { ...q, options: newOptions, correctAnswer: newCorrect };
  });
}

const Exam = () => {
  const { language, setLanguage, recordAnswer, completeQuiz, allQuestions } = useQuiz();
  const navigate = useNavigate();

  const [examQuestions, setExamQuestions] = useState(() => shuffleAnswers(shuffleAndPick(allQuestions, EXAM_QUESTION_COUNT)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [localAnswers, setLocalAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [finished, setFinished] = useState(false);

  const currentQuestion = examQuestions[currentIndex];
  const totalQuestions = examQuestions.length;

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          completeQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished, completeQuiz]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

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
    const existing = localAnswers.find((a) => a.questionId === examQuestions[index].id);
    setSelectedOption(existing?.selectedAnswer ?? null);
    setIsChecked(!!existing);
    setQuestionStartTime(Date.now());
  }, [localAnswers]);

  const next = useCallback(() => {
    if (currentIndex < examQuestions.length - 1) goToQuestion(currentIndex + 1);
  }, [currentIndex, goToQuestion]);

  const previous = useCallback(() => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  const finishExam = () => {
    completeQuiz();
    setFinished(true);
  };

  const restartExam = useCallback(() => {
    setExamQuestions(shuffleAnswers(shuffleAndPick(allQuestions, EXAM_QUESTION_COUNT)));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setLocalAnswers([]);
    setTimeLeft(EXAM_DURATION);
    setQuestionStartTime(Date.now());
    setFinished(false);
  }, []);

  if (finished) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header language={language} onLanguageChange={setLanguage} title="Resultado — DP-600" onBack={() => navigate("/")} />
        <DiagnosticReport
          language={language}
          answers={localAnswers}
          questions={examQuestions}
          categoryFilter={null}
          onRestart={restartExam}
          onBackToCategories={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header language={language} onLanguageChange={setLanguage} title="Modo Prova — DP-600" onBack={() => navigate("/")} />

      {/* Timer bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap px-3 sm:px-6 py-2 sm:py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className={`font-mono font-bold text-base sm:text-lg ${timeLeft < 300 ? "text-destructive" : "text-foreground"}`}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {localAnswers.length}/{examQuestions.length}<span className="hidden sm:inline"> respondidas</span>
          </span>
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={finishExam}>
            <span className="hidden sm:inline">Finalizar Prova</span>
            <span className="sm:hidden">Finalizar</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <QuestionCard
          question={currentQuestion}
          language={language}
          currentIndex={currentIndex}
          totalQuestions={examQuestions.length}
          selectedOption={selectedOption}
          isChecked={isChecked}
          onSelectOption={setSelectedOption}
          onCheck={checkAnswer}
          onNext={next}
          onPrevious={previous}
        />
      </div>
    </div>
  );
};

export default Exam;
