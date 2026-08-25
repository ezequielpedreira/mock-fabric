import { useRef, useCallback } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { DomainProgress } from "@/components/DomainProgress";
import { useQuiz } from "@/contexts/QuizContext";
import { type Domain, DOMAIN_LABELS } from "@/types/quiz";

import { HorizontalNav } from "@/components/landing/HorizontalNav";

import {
  CertificationSection,
  ImportantInfoSection,
} from "@/components/landing/CertificationSection";
import { translations } from "@/data/translations";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  PlayCircle,
  GraduationCap,
  TrendingUp,
  Zap,
  Rocket,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Index = () => {
  const { userStats, previousStats, allQuestions, language, setLanguage } = useQuiz();
  const t = translations[language];
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToSection = useCallback((section: string) => {
    if (section === "about" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen fabric-ambient">
      <HorizontalNav
        language={language}
        onScrollToSection={scrollToSection}
        onLanguageChange={setLanguage}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24">
        <div className="pointer-events-none absolute left-[8%] top-8 h-52 w-52 rounded-full bg-fabric-cyan/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[4%] top-16 h-64 w-64 rounded-full bg-fabric-pink/10 blur-3xl" />
        <div className="container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-16">
            <div className="max-w-3xl space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
                <Zap className="h-4 w-4" />
                {t.heroSubtitle}
              </div>
              <h1 className="text-[clamp(2.6rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-[-0.045em] text-foreground">
                {t.appTitle.split("DP-600")[0]}
                <span className="fabric-text-gradient">DP-600</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {t.heroDescription}
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link to="/training" className="w-full sm:w-auto">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    <PlayCircle className="h-5 w-5" />
                    {t.trainingMode}
                  </Button>
                </Link>
                <Link to="/exam" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    <GraduationCap className="h-5 w-5" />
                    {t.examMode}
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {allQuestions.length} {t.availableQuestions}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {t.trainingMode}
                </span>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-[560px] animate-fade-in lg:block [animation-delay:120ms]">
              <div className="fabric-gradient absolute -inset-6 -z-10 rounded-[2.5rem] opacity-12 blur-3xl" />
              <div className="premium-panel rounded-[1.75rem] p-3 shadow-[0_38px_90px_-42px_oklch(0.28_0.16_255/0.5)]">
                <div className="rounded-[1.35rem] border border-border/70 bg-card/95 p-5">
                  <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="fabric-icon flex h-10 w-10 items-center justify-center rounded-xl">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{t.domainProgress}</p>
                        <p className="text-xs text-muted-foreground">{t.heroSubtitle}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                      DP-600
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-secondary/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t.availableQuestions}
                      </p>
                      <p className="mt-2 text-2xl font-bold">{allQuestions.length}</p>
                    </div>
                    <div className="rounded-2xl bg-[color-mix(in_oklch,var(--fabric-cyan)_10%,white)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t.bestGrade}
                      </p>
                      <p className="mt-2 text-2xl font-bold">{userStats.bestScore}%</p>
                    </div>
                    <div className="rounded-2xl bg-[color-mix(in_oklch,var(--fabric-pink)_8%,white)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t.quizzesTaken}
                      </p>
                      <p className="mt-2 text-2xl font-bold">{userStats.totalQuizzes}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4 rounded-2xl border border-border/70 bg-background/65 p-5">
                    {(Object.keys(DOMAIN_LABELS) as Domain[]).slice(0, 4).map((domain, index) => (
                      <div key={domain} className="space-y-2">
                        <div className="flex items-center justify-between gap-4 text-xs">
                          <span className="truncate font-medium text-foreground">
                            {DOMAIN_LABELS[domain]}
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {[72, 56, 84, 64][index]}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="fabric-gradient h-full rounded-full"
                            style={{ width: `${[72, 56, 84, 64][index]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="premium-surface absolute -bottom-7 -left-8 flex items-center gap-3 rounded-2xl p-3.5 animate-[float-soft_5s_ease-in-out_infinite]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/12">
                  <Trophy className="h-5 w-5 text-success" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t.certTitle}</p>
                  <p className="text-sm font-bold">DP-600</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/60 bg-white/45 py-10 backdrop-blur-sm sm:py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t.quizzesTaken}
              value={userStats.totalQuizzes}
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              delta={previousStats ? userStats.totalQuizzes - previousStats.totalQuizzes : null}
            />
            <StatsCard
              title={t.avgCorrect}
              value={`${userStats.averageScore}%`}
              icon={<Target className="h-5 w-5 text-primary" />}
              delta={previousStats ? userStats.averageScore - previousStats.averageScore : null}
              deltaSuffix="pts"
            />
            <StatsCard
              title={t.bestGrade}
              value={`${userStats.bestScore}%`}
              icon={<Trophy className="h-5 w-5 text-primary" />}
              delta={previousStats ? userStats.bestScore - previousStats.bestScore : null}
              deltaSuffix="pts"
            />
            <StatsCard
              title={t.questionsAnswered}
              value={userStats.totalQuestions}
              subtitle={`${userStats.correctAnswers} ${t.correctOnes}`}
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              delta={previousStats ? userStats.totalQuestions - previousStats.totalQuestions : null}
            />
          </div>
        </div>
      </section>

      {/* Progress by Domain */}
      <section className="py-14 sm:py-18">
        <div className="container">
          <Card className="premium-panel rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t.domainProgress}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 pt-2">
              {(Object.keys(DOMAIN_LABELS) as Domain[]).map((domain) => (
                <DomainProgress
                  key={domain}
                  domain={domain}
                  correct={userStats.domainStats[domain].correct}
                  total={userStats.domainStats[domain].total}
                />
              ))}
              {userStats.totalQuestions === 0 && (
                <p className="text-center text-muted-foreground py-8">{t.noQuizYet}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Certification Section */}
      <CertificationSection ref={aboutRef} language={language} />

      {/* Quick Actions */}
      <section className="border-y border-border/60 bg-white/45 py-14 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="interactive-card group cursor-pointer overflow-hidden border-border/70 bg-card/90">
              <Link to="/training">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="fabric-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105">
                    <PlayCircle className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t.trainingMode}</h3>
                    <p className="text-sm text-muted-foreground">{t.trainingDesc}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="interactive-card group cursor-pointer overflow-hidden border-border/70 bg-card/90">
              <Link to="/exam">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <GraduationCap className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t.examDesc}</h3>
                    <p className="text-sm text-muted-foreground">{t.examTimeDesc}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* About Exam + CTA */}
      <section className="py-14 sm:py-18">
        <div className="container">
          <Card className="premium-panel overflow-hidden rounded-3xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{t.aboutExam}</h2>
                <p className="text-muted-foreground">{t.certSummary}</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{t.examDuration}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>{t.minScore}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>
                      {allQuestions.length} {t.availableQuestions}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="fabric-gradient relative flex min-h-72 items-center justify-center overflow-hidden p-8">
                <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-white/15 blur-3xl" />
                <div className="text-center text-primary-foreground space-y-4">
                  <div className="text-6xl font-bold">DP-600</div>
                  <div className="text-lg opacity-90">Fabric Analytics Engineer</div>
                  <Link to="/training">
                    <Button
                      size="xl"
                      className="mt-4 gap-2 bg-white text-primary shadow-xl hover:bg-white/90"
                    >
                      <Rocket className="h-5 w-5" />
                      {t.startSimulator}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Informações Importantes */}
      <ImportantInfoSection language={language} />
    </div>
  );
};

export default Index;
