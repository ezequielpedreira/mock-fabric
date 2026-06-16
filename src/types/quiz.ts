export type Domain =
  | "manter-solucao"
  | "preparar-dados"
  | "modelos-semanticos";

export const DOMAIN_LABELS: Record<Domain, string> = {
  "manter-solucao": "Manter Solução de Análise (25-30%)",
  "preparar-dados": "Preparar Dados (45-50%)",
  "modelos-semanticos": "Modelos Semânticos (25-30%)",
};

export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  domainStats: Record<Domain, { correct: number; total: number }>;
}

export const initialUserStats: UserStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  averageScore: 0,
  bestScore: 0,
  domainStats: {
    "manter-solucao": { correct: 0, total: 0 },
    "preparar-dados": { correct: 0, total: 0 },
    "modelos-semanticos": { correct: 0, total: 0 },
  },
};
