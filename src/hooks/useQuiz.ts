import { useState, useCallback, useMemo } from "react";
import { questions, type Language } from "@/data/questions";

export interface AnswerRecord {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export function useQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [language, setLanguage] = useState<Language>("pt-br");

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  const checkAnswer = useCallback(() => {
    if (!selectedOption || isChecked) return;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, { questionId: currentQuestion.id, selectedAnswer: selectedOption, isCorrect, timeSpent }];
    });
    setIsChecked(true);
  }, [selectedOption, isChecked, questionStartTime, currentQuestion]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    const existing = answers.find((a) => a.questionId === questions[index].id);
    setSelectedOption(existing?.selectedAnswer ?? null);
    setIsChecked(!!existing);
    setQuestionStartTime(Date.now());
  }, [answers]);

  const next = useCallback(() => {
    if (currentIndex < totalQuestions - 1) goToQuestion(currentIndex + 1);
  }, [currentIndex, totalQuestions, goToQuestion]);

  const previous = useCallback(() => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setAnswers([]);
    setQuestionStartTime(Date.now());
  }, []);

  const stats = useMemo(() => {
    const answered = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const avgTime = answered > 0 ? Math.round(answers.reduce((s, a) => s + a.timeSpent, 0) / answered) : 0;

    const categoryStats: Record<string, { total: number; correct: number }> = {};
    for (const q of questions) {
      if (!categoryStats[q.category]) categoryStats[q.category] = { total: 0, correct: 0 };
      categoryStats[q.category].total++;
      const ans = answers.find((a) => a.questionId === q.id);
      if (ans?.isCorrect) categoryStats[q.category].correct++;
    }

    const weakTopics = Object.entries(categoryStats)
      .map(([cat]) => {
        const catAnswers = answers.filter((a) => questions.find((q) => q.id === a.questionId)?.category === cat);
        const catCorrect = catAnswers.filter((a) => a.isCorrect).length;
        const accuracy = catAnswers.length > 0 ? Math.round((catCorrect / catAnswers.length) * 100) : -1;
        return { category: cat, accuracy };
      })
      .filter((t) => t.accuracy >= 0 && t.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);

    return { answered, correct, score, avgTime, categoryStats, weakTopics };
  }, [answers]);

  return {
    currentIndex, currentQuestion, totalQuestions,
    selectedOption, setSelectedOption,
    isChecked, checkAnswer,
    existingAnswer,
    next, previous, goToQuestion, resetQuiz,
    answers, stats, language, setLanguage,
  };
}
