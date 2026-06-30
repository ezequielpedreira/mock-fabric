export type Language = "pt-br" | "en-us" | "es" | "fr";

export interface Question {
  id: number;
  category: string;
  scenario: Record<Language, string>;
  question: Record<Language, string>;
  options: { key: string; text: Record<Language, string> }[];
  correctAnswer: string;
  explanation: Record<Language, string>;
}
