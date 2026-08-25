import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const baseSteps = [
  {
    title: "Bem-vindo ao Mock Fabric DP-600",
    description:
      "Este tour rápido apresenta os recursos disponíveis para organizar seus estudos e acompanhar sua evolução.",
    detail: "Você verá este passo a passo somente no primeiro acesso.",
    icon: Sparkles,
  },
  {
    title: "Painel de desempenho",
    description:
      "Na página inicial você acompanha simulados realizados, média de acertos, melhor nota e progresso por domínio da prova.",
    detail: "Os indicadores são atualizados conforme você responde às questões.",
    icon: BarChart3,
  },
  {
    title: "Modo Treinamento",
    description:
      "Estude no seu ritmo, escolha categorias e confira a explicação de cada resposta para consolidar o conteúdo.",
    detail: "Use este modo para praticar temas específicos antes do simulado completo.",
    icon: BookOpenCheck,
  },
  {
    title: "Modo Exame",
    description:
      "Simule a experiência da certificação DP-600 com questões, tempo e resultado final.",
    detail: "O histórico alimenta os indicadores do seu painel.",
    icon: GraduationCap,
  },
  {
    title: "Laboratório",
    description:
      "Acesse materiais oficiais, treinamentos, avaliações práticas e vídeos para complementar seus estudos.",
    detail: "Use os recursos do laboratório para aprofundar os temas da certificação.",
    icon: FlaskConical,
  },
];

const adminStep = {
  title: "Portal Administrativo",
  description:
    "Cadastre perguntas, alternativas, resposta correta e explicação. A publicação entra automaticamente nos modos Treino e Prova.",
  detail: "O acesso e as gravações são protegidos pelas políticas do Supabase.",
  icon: ShieldCheck,
};

export function FirstLoginTour() {
  const { accessLoading, isAdmin, onboardingCompleted, completeOnboarding } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const steps = useMemo(() => (isAdmin ? [...baseSteps, adminStep] : baseSteps), [isAdmin]);
  const open = !accessLoading && !onboardingCompleted;
  const step = steps[stepIndex] ?? steps[0];
  const Icon = step.icon;
  const isLastStep = stepIndex === steps.length - 1;

  const finish = async () => {
    setSaving(true);
    try {
      await completeOnboarding();
    } catch {
      toast.error("Não foi possível concluir o tour. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl overflow-y-auto rounded-3xl border-white/70 p-0 shadow-2xl">
        <div className="fabric-gradient-soft px-4 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
            <div className="fabric-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground sm:px-3 sm:text-xs">
              Passo {stepIndex + 1} de {steps.length}
            </span>
          </div>

          <DialogHeader className="text-left">
            <DialogTitle className="pr-6 text-xl leading-tight sm:text-2xl">
              {step.title}
            </DialogTitle>
            <DialogDescription className="pt-1.5 text-sm leading-relaxed sm:pt-2 sm:text-base">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          <div className="premium-surface mt-4 rounded-2xl p-3 text-sm leading-relaxed text-foreground sm:mt-5 sm:p-4">
            {step.detail}
          </div>
        </div>

        <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-8 sm:py-5">
          <div className="flex gap-2" aria-label="Progresso do tour">
            {steps.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  index <= stepIndex ? "fabric-gradient" : "bg-muted",
                )}
              />
            ))}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <Button
              variant="ghost"
              className="h-11 w-full sm:h-10 sm:w-auto"
              onClick={finish}
              disabled={saving}
            >
              Pular tour
            </Button>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                variant="outline"
                className="h-11 flex-1 sm:h-10 sm:flex-none"
                onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                disabled={stepIndex === 0 || saving}
              >
                Voltar
              </Button>
              {isLastStep ? (
                <Button
                  className="h-11 flex-1 whitespace-normal sm:h-10 sm:flex-none"
                  onClick={finish}
                  disabled={saving}
                >
                  {saving ? "Concluindo..." : "Começar a explorar"}
                </Button>
              ) : (
                <Button
                  className="h-11 flex-1 sm:h-10 sm:flex-none"
                  onClick={() => setStepIndex((index) => Math.min(steps.length - 1, index + 1))}
                >
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
