import { useRef, useCallback } from 'react';
import { Link } from "@/lib/router-compat";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { DomainProgress } from '@/components/DomainProgress';
import { useQuiz } from '@/contexts/QuizContext';
import { type Domain, DOMAIN_LABELS } from '@/types/quiz';

import { HorizontalNav } from '@/components/landing/HorizontalNav';
import { SupportProject } from '@/components/SupportProject';
import { CertificationSection, ImportantInfoSection } from '@/components/landing/CertificationSection';
import { translations } from '@/data/translations';
import {
  BookOpen, Trophy, Target, Clock,
  PlayCircle, GraduationCap, TrendingUp, Zap, Rocket
} from 'lucide-react';

const Index = () => {
  const { userStats, previousStats, allQuestions, language, setLanguage } = useQuiz();
  const t = translations[language];
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToSection = useCallback((section: string) => {
    if (section === 'about' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <HorizontalNav language={language} onScrollToSection={scrollToSection} onLanguageChange={setLanguage} />
      <div className="flex justify-end px-4 py-2">
        <SupportProject language={language} />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-primary/20 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              {t.heroSubtitle}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {t.appTitle.split('DP-600')[0]}
              <span className="text-primary">DP-600</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/training">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  {t.trainingMode}
                </Button>
              </Link>
              <Link to="/exam">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {t.examMode}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="py-12">
        <div className="container">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t.domainProgress}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 pt-2">
              {(Object.keys(DOMAIN_LABELS) as Domain[]).map(domain => (
                <DomainProgress key={domain} domain={domain} correct={userStats.domainStats[domain].correct} total={userStats.domainStats[domain].total} />
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
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
              <Link to="/training">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <PlayCircle className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t.trainingMode}</h3>
                    <p className="text-sm text-muted-foreground">{t.trainingDesc}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20">
              <Link to="/exam">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
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
      <section className="py-12">
        <div className="container">
          <Card className="shadow-sm overflow-hidden">
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
                    <span>{allQuestions.length} {t.availableQuestions}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary to-accent p-8 flex items-center justify-center">
                <div className="text-center text-primary-foreground space-y-4">
                  <div className="text-6xl font-bold">DP-600</div>
                  <div className="text-lg opacity-90">Fabric Analytics Engineer</div>
                  <Link to="/training">
                    <Button size="xl" className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold gap-2">
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
