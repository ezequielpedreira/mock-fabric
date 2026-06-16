import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { questions, type Language, type Question } from "@/data/questions";
import { type Domain, type UserStats, initialUserStats } from "@/types/quiz";

export interface AnswerRecord {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Map question categories to domains
const categoryToDomain: Record<string, Domain> = {
  "Segurança e Governança": "manter-solucao",
  "Ciclo de Vida": "manter-solucao",
  "Obter Dados": "preparar-dados",
  "Transformar Dados": "preparar-dados",
  "Consultar e Analisar": "preparar-dados",
  "Projetar Modelos Semânticos": "modelos-semanticos",
  "Otimizar Modelos Semânticos": "modelos-semanticos",
};

interface PreviousSnapshot {
  averageScore: number;
  bestScore: number;
  totalQuestions: number;
  correctAnswers: number;
  totalQuizzes: number;
}

interface QuizContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  allQuestions: Question[];
  userStats: UserStats;
  previousStats: PreviousSnapshot | null;
  answers: AnswerRecord[];
  recordAnswer: (questionId: number, selectedAnswer: string, timeSpent: number) => void;
  completeQuiz: () => void;
  resetStats: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-br");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [previousStats, setPreviousStats] = useState<PreviousSnapshot | null>(null);

  const recordAnswer = useCallback(
    (questionId: number, selectedAnswer: string, timeSpent: number) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;
      const isCorrect = selectedAnswer === question.correctAnswer;
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== questionId);
        return [...filtered, { questionId, selectedAnswer, isCorrect, timeSpent }];
      });
    },
    []
  );

  const completeQuiz = useCallback(() => {
    const correct = answers.filter((a) => a.isCorrect).length;
    const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
    // snapshot current as previous before updating
    setPreviousStats({
      averageScore: answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0,
      bestScore,
      totalQuestions: answers.length,
      correctAnswers: correct,
      totalQuizzes: quizCount,
    });
    setQuizCount((c) => c + 1);
    if (score > bestScore) setBestScore(score);
  }, [answers, bestScore, quizCount]);

  const resetStats = useCallback(() => {
    setAnswers([]);
    setQuizCount(0);
    setBestScore(0);
    setPreviousStats(null);
  }, []);

  const userStats: UserStats = useMemo(() => {
    const correct = answers.filter((a) => a.isCorrect).length;
    const avgScore = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;

    const domainStats = { ...initialUserStats.domainStats };
    for (const q of questions) {
      const domain = categoryToDomain[q.category] || "preparar-dados";
      const ans = answers.find((a) => a.questionId === q.id);
      if (ans) {
        domainStats[domain] = {
          total: domainStats[domain].total + 1,
          correct: domainStats[domain].correct + (ans.isCorrect ? 1 : 0),
        };
      }
    }

    return {
      totalQuizzes: quizCount,
      totalQuestions: answers.length,
      correctAnswers: correct,
      averageScore: avgScore,
      bestScore,
      domainStats,
    };
  }, [answers, quizCount, bestScore]);

  return (
    <QuizContext.Provider
      value={{ language, setLanguage, allQuestions: questions, userStats, previousStats, answers, recordAnswer, completeQuiz, resetStats }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
