import { questions, type Language } from "@/data/questions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, GitBranch, Database, Shuffle, Search,
  Layers, Gauge, PlayCircle, BookOpen
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Segurança e Governança": <ShieldCheck className="h-6 w-6" />,
  "Ciclo de Vida": <GitBranch className="h-6 w-6" />,
  "Obter Dados": <Database className="h-6 w-6" />,
  "Transformar Dados": <Shuffle className="h-6 w-6" />,
  "Consultar e Analisar": <Search className="h-6 w-6" />,
  "Projetar Modelos Semânticos": <Layers className="h-6 w-6" />,
  "Otimizar Modelos Semânticos": <Gauge className="h-6 w-6" />,
};

const categoryDescriptions: Record<string, Record<Language, string>> = {
  "Segurança e Governança": {
    "pt-br": "RLS, OLS, Sensitivity Labels, Workspace Roles e auditoria",
    "en-us": "RLS, OLS, Sensitivity Labels, Workspace Roles and auditing",
    "es": "RLS, OLS, Sensitivity Labels, Workspace Roles y auditoría",
    "fr": "RLS, OLS, Sensitivity Labels, Workspace Roles et audit",
  },
  "Ciclo de Vida": {
    "pt-br": "Git, Deployment Pipelines, XMLA, versionamento e CI/CD",
    "en-us": "Git, Deployment Pipelines, XMLA, versioning and CI/CD",
    "es": "Git, Deployment Pipelines, XMLA, versionamiento y CI/CD",
    "fr": "Git, Deployment Pipelines, XMLA, versionnement et CI/CD",
  },
  "Obter Dados": {
    "pt-br": "Lakehouse, Warehouse, Dataflows, Pipelines e conectores",
    "en-us": "Lakehouse, Warehouse, Dataflows, Pipelines and connectors",
    "es": "Lakehouse, Warehouse, Dataflows, Pipelines y conectores",
    "fr": "Lakehouse, Warehouse, Dataflows, Pipelines et connecteurs",
  },
  "Transformar Dados": {
    "pt-br": "PySpark, SQL, Power Query, Delta Lake e transformações",
    "en-us": "PySpark, SQL, Power Query, Delta Lake and transformations",
    "es": "PySpark, SQL, Power Query, Delta Lake y transformaciones",
    "fr": "PySpark, SQL, Power Query, Delta Lake et transformations",
  },
  "Consultar e Analisar": {
    "pt-br": "DAX, KQL, SQL analítico, funções de janela e agregações",
    "en-us": "DAX, KQL, analytical SQL, window functions and aggregations",
    "es": "DAX, KQL, SQL analítico, funciones de ventana y agregaciones",
    "fr": "DAX, KQL, SQL analytique, fonctions de fenêtre et agrégations",
  },
  "Projetar Modelos Semânticos": {
    "pt-br": "Star schema, relacionamentos, DAX, calculation groups e Direct Lake",
    "en-us": "Star schema, relationships, DAX, calculation groups and Direct Lake",
    "es": "Star schema, relaciones, DAX, calculation groups y Direct Lake",
    "fr": "Star schema, relations, DAX, calculation groups et Direct Lake",
  },
  "Otimizar Modelos Semânticos": {
    "pt-br": "Performance, VertiPaq, incremental refresh e otimização DAX",
    "en-us": "Performance, VertiPaq, incremental refresh and DAX optimization",
    "es": "Rendimiento, VertiPaq, incremental refresh y optimización DAX",
    "fr": "Performance, VertiPaq, incremental refresh et optimisation DAX",
  },
};

interface CategorySelectorProps {
  language: Language;
  onSelectCategory: (category: string | null) => void;
}

export function CategorySelector({ language, onSelectCategory }: CategorySelectorProps) {
  const categories = [...new Set(questions.map((q) => q.category))];
  const totalQuestions = questions.length;

  const labels: Record<string, Record<Language, string>> = {
    title: {
      "pt-br": "Escolha uma Categoria",
      "en-us": "Choose a Category",
      "es": "Elige una Categoría",
      "fr": "Choisissez une Catégorie",
    },
    subtitle: {
      "pt-br": "Selecione um tópico para praticar ou treine com todas as questões",
      "en-us": "Select a topic to practice or train with all questions",
      "es": "Selecciona un tema para practicar o entrena con todas las preguntas",
      "fr": "Sélectionnez un sujet pour pratiquer ou entraînez-vous avec toutes les questions",
    },
    allQuestions: {
      "pt-br": "Todas as Questões",
      "en-us": "All Questions",
      "es": "Todas las Preguntas",
      "fr": "Toutes les Questions",
    },
    allDesc: {
      "pt-br": "Pratique com todas as 120 questões de todos os domínios",
      "en-us": "Practice with all 120 questions from all domains",
      "es": "Practica con las 120 preguntas de todos los dominios",
      "fr": "Pratiquez avec les 120 questions de tous les domaines",
    },
    questionsLabel: {
      "pt-br": "questões",
      "en-us": "questions",
      "es": "preguntas",
      "fr": "questions",
    },
    start: {
      "pt-br": "Iniciar",
      "en-us": "Start",
      "es": "Iniciar",
      "fr": "Démarrer",
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{labels.title[language]}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{labels.subtitle[language]}</p>
        </div>

        {/* All questions card */}
        <Card
          className="group cursor-pointer border-2 border-primary/30 hover:border-primary hover:shadow-lg transition-all duration-300"
          onClick={() => onSelectCategory(null)}
        >
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-md">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="shrink-0">{totalQuestions} {labels.questionsLabel[language]}</Badge>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors break-words">{labels.allQuestions[language]}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{labels.allDesc[language]}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-primary p-0 h-auto hover:bg-transparent">
              <PlayCircle className="h-4 w-4" />
              {labels.start[language]}
            </Button>
          </CardContent>
        </Card>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = questions.filter((q) => q.category === cat).length;
            const icon = categoryIcons[cat] || <BookOpen className="h-6 w-6" />;
            const desc = categoryDescriptions[cat]?.[language] || "";

            return (
              <Card
                key={cat}
                className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                onClick={() => onSelectCategory(cat)}
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {icon}
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">{count} {labels.questionsLabel[language]}</Badge>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors break-words">{cat}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-primary p-0 h-auto hover:bg-transparent">
                    <PlayCircle className="h-4 w-4" />
                    {labels.start[language]}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
