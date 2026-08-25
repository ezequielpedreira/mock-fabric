import type { Language, Question } from "@/data/questions";
import type { Json, Tables } from "@/integrations/supabase/types";

const languages: Language[] = ["pt-br", "en-us", "es", "fr"];

function localizedRecord(value: Json): Record<Language, string> {
  const source =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, Json | undefined>)
      : {};
  const fallback =
    (typeof source["pt-br"] === "string" && source["pt-br"]) ||
    Object.values(source).find((item): item is string => typeof item === "string") ||
    "";

  return Object.fromEntries(
    languages.map((language) => [
      language,
      typeof source[language] === "string" && source[language] ? source[language] : fallback,
    ]),
  ) as Record<Language, string>;
}

export function toQuizQuestion(row: Tables<"questions">): Question | null {
  if (!Array.isArray(row.options)) return null;

  const options = row.options.flatMap((item) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) return [];
    const option = item as Record<string, Json | undefined>;
    if (typeof option.key !== "string" || option.text === undefined) return [];
    return [{ key: option.key, text: localizedRecord(option.text) }];
  });

  if (options.length !== 4 || !options.some((option) => option.key === row.correct_answer)) {
    return null;
  }

  return {
    id: row.id,
    category: row.category,
    scenario: localizedRecord(row.scenario),
    question: localizedRecord(row.question),
    options,
    correctAnswer: row.correct_answer,
    explanation: localizedRecord(row.explanation),
  };
}
