import { useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FabricMark } from "@/components/FabricMark";
import { Zap, Mail, Lock, Loader2, BarChart3, BookOpenCheck, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function getAppUrl(path = "/") {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  const baseUrl = configuredUrl || window.location.origin;
  return new URL(path, baseUrl).toString();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a solicitação.";
}

const Login = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getAppUrl(),
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Você já pode entrar." });
        setMode("signin");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getAppUrl("/reset-password"),
        });
        if (error) throw error;
        toast({
          title: "E-mail enviado",
          description: "Verifique sua caixa de entrada para redefinir a senha.",
        });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: unknown) {
      toast({ title: "Erro", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAppUrl(),
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast({ title: "Erro", description: getErrorMessage(error), variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <div className="fabric-ambient relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:grid lg:place-items-center lg:py-10">
      <div className="pointer-events-none absolute left-[6%] top-[8%] h-72 w-72 rounded-full bg-fabric-cyan/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[4%] right-[5%] h-80 w-80 rounded-full bg-fabric-pink/10 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-card/82 shadow-[0_38px_100px_-48px_oklch(0.26_0.14_255/0.5)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden bg-header p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklch,var(--fabric-cyan)_34%,transparent),transparent_32%),radial-gradient(circle_at_92%_82%,color-mix(in_oklch,var(--fabric-pink)_22%,transparent),transparent_36%)]" />
          <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-12 top-40 h-52 w-52 rounded-full border border-white/8" />
          <div className="relative">
            <div className="mb-16 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                <FabricMark className="h-8 w-8" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                  Mock Fabric
                </p>
                <p className="mt-1 font-bold">DP-600</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/82 backdrop-blur-xl">
              <Zap className="h-4 w-4 text-fabric-cyan" />
              Microsoft Fabric Analytics Engineer
            </span>
            <h1 className="mt-6 max-w-lg text-5xl font-bold leading-[1.03] tracking-[-0.04em]">
              Prepare-se para conquistar sua certificação.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/62">
              Treine com questões direcionadas, acompanhe sua evolução e simule o ambiente da prova
              DP-600.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {[
              { icon: BookOpenCheck, label: "Treino", detail: "Por domínio" },
              { icon: BarChart3, label: "Progresso", detail: "Em tempo real" },
              { icon: ShieldCheck, label: "Conteúdo", detail: "Especializado" },
            ].map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-xl"
              >
                <Icon className="mb-4 h-5 w-5 text-fabric-cyan" />
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-white/50">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10 lg:p-14">
          <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-4 px-0 pb-7 pt-1 text-center lg:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-border/60 lg:hidden">
                <FabricMark className="h-9 w-9" />
              </div>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary/70 px-4 py-2 text-sm font-semibold text-primary lg:mx-0 lg:hidden">
                <Zap className="h-4 w-4" /> Microsoft Fabric
              </div>
              <CardTitle className="text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl">
                Simulado <span className="fabric-text-gradient">DP-600</span>
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {mode === "signup"
                  ? "Crie sua conta para começar"
                  : mode === "forgot"
                    ? "Informe seu e-mail para redefinir a senha"
                    : "Entre para acessar o simulado"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-1">
              {mode !== "forgot" && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 border-border/90 bg-white font-semibold"
                    onClick={handleGoogleLogin}
                    disabled={submitting}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Entrar com Google
                  </Button>

                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground uppercase">ou</span>
                    <Separator className="flex-1" />
                  </div>
                </>
              )}

              {/* Email/Password */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2.5">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2.5">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                {mode !== "forgot" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="rounded-md text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                          Esqueci minha senha
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "signup"
                    ? "Criar conta"
                    : mode === "forgot"
                      ? "Enviar e-mail"
                      : "Entrar"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "forgot" ? (
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    Voltar para o login
                  </button>
                ) : (
                  <>
                    {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                      className="rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      {mode === "signup" ? "Entrar" : "Criar conta"}
                    </button>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Login;
