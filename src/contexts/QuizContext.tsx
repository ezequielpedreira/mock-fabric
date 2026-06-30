import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { type Language, type Question } from "@/data/questions";
import { type Domain, type UserStats, initialUserStats } from "@/types/quiz";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>("pt-br");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [previousStats, setPreviousStats] = useState<PreviousSnapshot | null>(null);
  const [dbQuestions, setDbQuestions] = useState<Question[]>([]);

  // Load questions from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const mapped: Question[] = data.map((q) => ({
          id: q.id,
          category: q.category,
          scenario: q.scenario as Record<Language, string>,
          question: q.question as Record<Language, string>,
          options: q.options as { key: string; text: Record<Language, string> }[],
          correctAnswer: q.correct_answer,
          explanation: q.explanation as Record<Language, string>,
        }));
        setDbQuestions(mapped);
      });
  }, [user]);

  const allQuestions = useMemo(() => dbQuestions, [dbQuestions]);

  // Load user's history from DB when logged in
  useEffect(() => {
    if (!user) {
      setAnswers([]);
      setQuizCount(0);
      setBestScore(0);
      setPreviousStats(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_answers")
        .select("question_id, selected_answer, is_correct, time_spent")
        .eq("user_id", user.id)
        .order("answered_at", { ascending: true });
      if (error || cancelled || !data) return;
      // Keep only the latest answer per question
      const latest = new Map<number, AnswerRecord>();
      for (const row of data) {
        latest.set(row.question_id, {
          questionId: row.question_id,
          selectedAnswer: row.selected_answer,
          isCorrect: row.is_correct,
          timeSpent: row.time_spent ?? 0,
        });
      }
      setAnswers(Array.from(latest.values()));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const recordAnswer = useCallback(
    (questionId: number, selectedAnswer: string, timeSpent: number) => {
      const question = allQuestions.find((q) => q.id === questionId);
      if (!question) return;
      const isCorrect = selectedAnswer === question.correctAnswer;
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== questionId);
        return [...filtered, { questionId, selectedAnswer, isCorrect, timeSpent }];
      });
      // Persist to DB (fire and forget; RLS ensures user_id matches)
      if (user) {
        supabase
          .from("user_answers")
          .insert({
            user_id: user.id,
            question_id: questionId,
            category: question.category,
            selected_answer: selectedAnswer,
            is_correct: isCorrect,
            time_spent: timeSpent,
            mode: "training",
          })
          .then(({ error }) => {
            if (error) console.error("Failed to save answer:", error.message);
          });
      }
    },
    [user]
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

  const resetStats = useCallback(async () => {
    setAnswers([]);
    setQuizCount(0);
    setBestScore(0);
    setPreviousStats(null);
    if (user) {
      await supabase.from("user_answers").delete().eq("user_id", user.id);
    }
  }, [user]);

  const userStats: UserStats = useMemo(() => {
    const correct = answers.filter((a) => a.isCorrect).length;
    const avgScore = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;

    const domainStats = { ...initialUserStats.domainStats };
    for (const q of allQuestions) {
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
  }, [answers, quizCount, bestScore, allQuestions]);

  return (
    <QuizContext.Provider
      value={{ language, setLanguage, allQuestions, userStats, previousStats, answers, recordAnswer, completeQuiz, resetStats }}
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
