import { useQuiz } from "@/contexts/QuizContext";
import { Header } from "@/components/quiz/Header";
import { HorizontalNav } from "@/components/landing/HorizontalNav";

import { translations } from "@/data/translations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Clock,
  BookOpen,
  FlaskConical,
  Database,
  Warehouse,
  Sparkles,
  Zap,
  Brain,
  GraduationCap,
  Award,
  Layers,
  Route,
  PlayCircle,
} from "lucide-react";

interface LabModule {
  title: string;
  description: string;
  duration: string;
  level: string;
  type: string;
  url: string;
  icon: React.ReactNode;
}

interface YouTubeItem {
  id: string;
  type: "playlist" | "video";
  title: string;
}

function levelBadgeClass(level: string): string {
  const normalized = level.toLowerCase();
  if (normalized.includes("inicia") || normalized.includes("begin")) {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  }
  if (normalized.includes("interm")) {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";
  }
  if (normalized.includes("avan") || normalized.includes("adv")) {
    return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30";
  }
  return "bg-primary/10 text-primary border-primary/20";
}

function LevelBadge({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold shadow-sm transition-colors",
        levelBadgeClass(level),
      )}
    >
      <BookOpen className="h-3.5 w-3.5" />
      {level}
    </span>
  );
}

const introModules: LabModule[] = [
  {
    title: "Introdução à análise de ponta a ponta usando o Microsoft Fabric",
    description:
      "Descubra como o Microsoft Fabric pode atender às necessidades de análise da sua empresa em uma só plataforma.",
    duration: "20 min",
    level: "Iniciante",
    type: "Módulo",
    url: "https://learn.microsoft.com/training/modules/introduction-end-analytics-use-microsoft-fabric/",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Introdução aos lakehouses no Microsoft Fabric",
    description:
      "Lakehouses combinam a flexibilidade do data lake com a análise do data warehouse. O Fabric oferece uma solução lakehouse para análise abrangente.",
    duration: "59 min",
    level: "Intermediário",
    type: "Módulo",
    url: "https://learn.microsoft.com/training/modules/get-started-lakehouses/",
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Introdução aos data warehouses no Microsoft Fabric",
    description:
      "Data warehouses são repositórios analíticos baseados em esquema relacional para consultas SQL. O Fabric permite criar um data warehouse relacional no seu workspace.",
    duration: "1 h 13 min",
    level: "Iniciante",
    type: "Módulo",
    url: "https://learn.microsoft.com/training/modules/get-started-data-warehouse/",
    icon: <Warehouse className="h-5 w-5" />,
  },
];

const implementModules: LabModule[] = [
  {
    title: "Implementar um Lakehouse com o Microsoft Fabric",
    description:
      "Aprenda a implementar e gerenciar um lakehouse completo, incluindo ingestão de dados, transformação com Spark e orquestração com pipelines.",
    duration: "7 h 16 min",
    level: "Intermediário",
    type: "Roteiro de aprendizagem",
    url: "https://learn.microsoft.com/training/paths/implement-lakehouse-microsoft-fabric/",
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Implementar um data warehouse com o Microsoft Fabric",
    description:
      "Aprenda a modelar, carregar e consultar dados em um data warehouse do Fabric usando T-SQL e pipelines de dados.",
    duration: "5 h 57 min",
    level: "Iniciante",
    type: "Roteiro de aprendizagem",
    url: "https://learn.microsoft.com/training/paths/work-with-data-warehouses-using-microsoft-fabric/",
    icon: <Warehouse className="h-5 w-5" />,
  },
  {
    title:
      "Implementar uma solução de ciência de dados e aprendizado de máquina para IA no Microsoft Fabric",
    description:
      "Explore como usar ciência de dados e machine learning no Fabric para criar modelos preditivos e soluções de IA.",
    duration: "5 h 27 min",
    level: "Iniciante",
    type: "Roteiro de aprendizagem",
    url: "https://learn.microsoft.com/training/paths/implement-data-science-machine-learning-fabric/",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Implemente inteligência em tempo real com Microsoft Fabric",
    description:
      "Aprenda a ingerir, processar e visualizar dados em tempo real usando Real-Time Intelligence no Microsoft Fabric.",
    duration: "5 h 31 min",
    level: "Iniciante",
    type: "Roteiro de aprendizagem",
    url: "https://learn.microsoft.com/training/paths/explore-real-time-analytics-microsoft-fabric/",
    icon: <Zap className="h-5 w-5" />,
  },
];

const instructorCourse: LabModule = {
  title: "Engenheiro de Análise do Microsoft Fabric",
  description:
    "Curso oficial DP-600T00 ministrado por instrutor. Aprenda no seu próprio ritmo com treinamento em sala de aula.",
  duration: "",
  level: "Avançado",
  type: "Curso",
  url: "https://learn.microsoft.com/training/courses/dp-600t00/",
  icon: <GraduationCap className="h-5 w-5" />,
};

const certification: LabModule = {
  title: "Engenheiro Associado de Análise em Fabric Certificado pela Microsoft",
  description:
    "Após concluir seu treinamento, faça uma avaliação prática para ver se você está pronto para o exame de credenciamento.",
  duration: "",
  level: "Intermediário",
  type: "Certificação",
  url: "https://learn.microsoft.com/credentials/certifications/fabric-analytics-engineer-associate/",
  icon: <Award className="h-5 w-5" />,
};

const englishPlaylists: YouTubeItem[] = [
  {
    id: "PLcwrIWK7WBcRiRqPAvdAKlhrXd0oV19nl",
    type: "playlist",
    title: "DP-600 Microsoft Fabric - Study Playlist",
  },
  {
    id: "PL-EF1-xTPq0Q-9HSr0yy1-JT7wtIrwpdX",
    type: "playlist",
    title: "Microsoft Fabric DP-600 Preparation",
  },
  {
    id: "PLug2zSFKZmV05ZJcmHemXxyJjPVXeQ2qS",
    type: "playlist",
    title: "Microsoft Fabric Tutorial Series",
  },
  { id: "t_bykXb5FwE", type: "video", title: "DP-600 Exam Tips" },
];

const portuguesePlaylists: YouTubeItem[] = [
  { id: "f69ZDw0A5Sk", type: "video", title: "Microsoft Fabric em Português" },
  { id: "4t7d41RyCt4", type: "video", title: "DP-600 Dicas de Prova" },
];

function YouTubeEmbed({ item }: { item: YouTubeItem }) {
  const embedUrl =
    item.type === "playlist"
      ? `https://www.youtube.com/embed/videoseries?list=${item.id}`
      : `https://www.youtube.com/embed/${item.id}`;
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
      <div className="aspect-video w-full bg-muted">
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-tight">{item.title}</h3>
          <a
            href={
              item.type === "playlist"
                ? `https://youtube.com/playlist?list=${item.id}`
                : `https://youtu.be/${item.id}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
            title="Abrir no YouTube"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

const LabCard = ({ mod, className }: { mod: LabModule; className?: string }) => (
  <a
    href={mod.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn("group block", className)}
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              {mod.icon}
            </div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
              {mod.title}
            </h3>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 pl-[52px]">{mod.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 pl-[52px] flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-primary/10 font-medium">
            {mod.type}
          </span>
          {mod.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {mod.duration}
            </span>
          )}
          <LevelBadge level={mod.level} />
        </div>
      </CardContent>
    </Card>
  </a>
);

const Lab = () => {
  const { language, setLanguage } = useQuiz();
  const t = translations[language];

  return (
    <div className="min-h-screen">
      <Header language={language} onLanguageChange={setLanguage} title={t.appTitle} />
      <HorizontalNav language={language} />

      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-primary/20 text-sm font-medium text-primary">
              <FlaskConical className="h-4 w-4" />
              Microsoft Learn
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.navLab}</h1>
            <p className="text-muted-foreground">{t.labDescription}</p>
          </div>

          {/* Introdução ao Microsoft Fabric */}
          <div className="mb-12 border-2 border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Introdução ao Microsoft Fabric
                </h2>
                <p className="text-sm text-muted-foreground">
                  Saiba mais sobre o Microsoft Fabric, como ele funciona e identifique como usá-lo
                  para suas necessidades de análise.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {introModules.map((mod, i) => (
                <LabCard key={i} mod={mod} />
              ))}
            </div>
            <div className="mt-4">
              <a
                href="https://learn.microsoft.com/training/paths/get-started-fabric/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Explore o percurso de aprendizagem completo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Implemente soluções com o Microsoft Fabric */}
          <div className="mb-12 border-2 border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Implemente soluções com o Microsoft Fabric
                </h2>
                <p className="text-sm text-muted-foreground">
                  Roteiros de aprendizagem completos para implementar soluções de dados no Microsoft
                  Fabric.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {implementModules.map((mod, i) => (
                <LabCard key={i} mod={mod} />
              ))}
            </div>
          </div>

          {/* Treinamento e Certificação lado a lado */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-2 border-border/50 rounded-2xl p-6">
            {/* Coluna Treinamento */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-foreground">
                    Treinamento ministrado por instrutor
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Escolha uma configuração tradicional de treinamento em sala de aula.
                  </p>
                </div>
              </div>
              <a
                href={instructorCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block flex-1"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardContent className="p-6 space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                            {instructorCourse.icon}
                          </div>
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {instructorCourse.title}
                          </h3>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground sm:pl-[52px]">
                        {instructorCourse.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 sm:pl-[52px] flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-primary/10 font-medium">
                        {instructorCourse.type}
                      </span>
                      <LevelBadge level={instructorCourse.level} />
                    </div>
                  </CardContent>
                </Card>
              </a>
              <div className="mt-4">
                <a
                  href="https://learn.microsoft.com/training/courses/dp-600t00#browseAllSessionsContainer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Agendar treinamento conduzido por instrutor
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Coluna Certificação */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-foreground">Tornar-se certificado</h2>
                  <p className="text-sm text-muted-foreground">
                    Após concluir seu treinamento, faça uma avaliação prática para ver se você está
                    pronto para o exame.
                  </p>
                </div>
              </div>
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block flex-1"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardContent className="p-6 space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                            {certification.icon}
                          </div>
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {certification.title}
                          </h3>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground sm:pl-[52px]">
                        {certification.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 sm:pl-[52px] flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-primary/10 font-medium">
                        {certification.type}
                      </span>
                      <LevelBadge level={certification.level} />
                    </div>
                  </CardContent>
                </Card>
              </a>
              <div className="mt-4">
                <a
                  href="https://learn.microsoft.com/credentials/certifications/fabric-analytics-engineer-associate/practice/assessment?assessment-type=practice&assessmentId=90&practice-assessment-type=certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Faça a avaliação prática
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Playlists Indicadas */}
          <div className="mb-12 border-2 border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.recommendedPlaylists}</h2>
                <p className="text-sm text-muted-foreground">
                  Vídeos e playlists do YouTube para complementar seus estudos.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {t.englishContent}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {englishPlaylists.map((item, i) => (
                  <YouTubeEmbed key={i} item={item} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {t.portugueseContent}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portuguesePlaylists.map((item, i) => (
                  <YouTubeEmbed key={i} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lab;
