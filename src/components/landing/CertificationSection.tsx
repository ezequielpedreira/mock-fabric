import { translations } from "@/data/translations";
import type { Language } from "@/data/questions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Users,
  ShieldCheck,
  Database,
  Layers,
  FileText,
  Trophy,
  Globe2,
} from "lucide-react";
import { forwardRef } from "react";

interface CertificationSectionProps {
  language: Language;
}

const OFFICIAL_LINKS = [
  {
    key: "examPage" as const,
    url: "https://learn.microsoft.com/pt-br/credentials/certifications/exams/dp-600/",
  },
  {
    key: "scheduleVia" as const,
    url: "https://learn.microsoft.com/pt-br/credentials/certifications/register-schedule-exam",
  },
  {
    key: "onlineExamGuide" as const,
    url: "https://learn.microsoft.com/pt-br/credentials/certifications/online-exams",
  },
];

export const CertificationSection = forwardRef<HTMLElement, CertificationSectionProps>(
  ({ language }, ref) => {
    const t = translations[language];

    const skills = [
      {
        icon: ShieldCheck,
        title: t.skillMaintain,
        pct: t.skillMaintainPct,
        desc: t.skillMaintainDesc,
      },
      {
        icon: Database,
        title: t.skillPrepare,
        pct: t.skillPreparePct,
        desc: t.skillPrepareDesc,
        featured: true,
      },
      {
        icon: Layers,
        title: t.skillSemantic,
        pct: t.skillSemanticPct,
        desc: t.skillSemanticDesc,
      },
    ];

    return (
      <section ref={ref} id="about" className="py-16 sm:py-20">
        <div className="container space-y-12">
          {/* Title + Summary */}
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-4xl">
              {t.certTitle}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {t.certSummary}
            </p>
          </div>

          {/* Candidate Profile */}
          <Card className="premium-panel rounded-3xl">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{t.audienceProfile}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.audienceProfileText}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Measured */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t.skillsTitle}</h3>
              <p className="text-muted-foreground">{t.skillsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {skills.map(({ icon: Icon, title, pct, desc, featured }) => (
                <Card
                  key={title}
                  className={`interactive-card border bg-card/88 backdrop-blur-sm ${
                    featured ? "border-primary/40 shadow-sm" : "border-border/60"
                  }`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary ring-1 ring-primary/8">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {pct}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg text-foreground leading-snug">{title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Official Links — emphasized */}
          <Card className="premium-panel relative overflow-hidden rounded-3xl border-primary/20">
            <div className="fabric-gradient-soft absolute inset-0" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <CardContent className="relative p-8 md:p-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Microsoft Learn
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {t.officialLinks}
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t.officialLinksDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {OFFICIAL_LINKS.map(({ key, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full gap-2 h-auto py-4 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold">{t[key]}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  },
);

CertificationSection.displayName = "CertificationSection";

// Export sub-section "Informações Importantes" to be rendered at the end of the page
export function ImportantInfoSection({ language }: { language: Language }) {
  const t = translations[language];

  const items = [
    { icon: FileText, title: t.examFormat, desc: t.examFormatDesc },
    { icon: Trophy, title: t.passingScore, desc: t.passingScoreDesc },
    { icon: Globe2, title: t.examLanguages, desc: t.examLanguagesDesc },
    { icon: Users, title: t.guideIdentity, desc: t.guideIdentityDesc },
  ];

  return (
    <section className="border-t border-border/60 bg-white/45 py-16 backdrop-blur-sm">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.importantInfo}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="interactive-card group relative overflow-hidden border-border/70 bg-card/80 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
              <CardContent className="relative p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground leading-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
