import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check, Coffee, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/data/translations";
import type { Language } from "@/data/questions";
import pixQrCodeAsset from "@/assets/pix-qr-code.jpeg.asset.json";

// Chave PIX copia-e-cola
const PIX_KEY =
  "00020126580014BR.GOV.BCB.PIX0136a5839d47-2545-4b76-9e4c-ce06c55c06705204000053039865802BR5923Ezequiel Bispo Pedreira6009SAO PAULO62140510VsPreRRJwC630462D0";

interface SupportProjectProps {
  language?: Language;
}

export function SupportProject({ language = "pt-br" }: SupportProjectProps) {
  const t = translations[language];
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      toast({
        title:
          language === "pt-br"
            ? "Copiado!"
            : language === "es"
              ? "¡Copiado!"
              : "Copied!",
        description:
          language === "pt-br"
            ? "Chave PIX copiada para a área de transferência."
            : language === "es"
              ? "Clave PIX copiada al portapapeles."
              : "PIX key copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }, [language, toast]);

  const titleText =
    language === "pt-br"
      ? "Apoie o Projeto"
      : language === "es"
        ? "Apoya el Proyecto"
        : language === "fr"
          ? "Soutenir le Projet"
          : "Support the Project";

  const descText =
    language === "pt-br"
      ? "Este simulado é gratuito e sempre será. Se quiser, pode ajudar com qualquer valor — toda contribuição incentiva melhorias contínuas."
      : language === "es"
        ? "Este simulador es gratuito y siempre lo será. Si deseas, puedes ayudar con cualquier monto — toda contribución incentiva mejoras continuas."
        : language === "fr"
          ? "Ce simulateur est gratuit et le restera. Si vous le souhaitez, vous pouvez aider avec n'importe quel montant — chaque contribution encourage les améliorations continues."
          : "This simulator is free and always will be. If you'd like, you can help with any amount — every contribution encourages continuous improvements.";

  const thanksText =
    language === "pt-br"
      ? "Obrigado por fazer parte!"
      : language === "es"
        ? "¡Gracias por ser parte!"
        : language === "fr"
          ? "Merci de faire partie!"
          : "Thanks for being part of it!";

  const copyLabel =
    language === "pt-br"
      ? "Copiar chave PIX"
      : language === "es"
        ? "Copiar clave PIX"
        : language === "fr"
          ? "Copier la clé PIX"
          : "Copy PIX key";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="fixed top-14 right-4 z-50 rounded-full shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all hover:-translate-y-0.5 gap-2 px-4 py-2 h-auto bg-primary animate-pulse ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
        >
          <Heart className="h-4 w-4 fill-current" />
          <span className="hidden sm:inline text-sm font-medium">{titleText}</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="sm:max-w-md sm:mx-auto sm:rounded-t-2xl">
        <SheetHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-xl font-bold">{titleText}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {descText}
          </p>

          <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              {language === "pt-br"
                ? "Para usar o QR Code, abra o aplicativo do seu banco e escaneie o código dentro do app."
                : language === "es"
                  ? "Para usar el QR Code, abra la aplicación de su banco y escanee el código dentro de la app."
                  : language === "fr"
                    ? "Pour utiliser le QR Code, ouvrez l'application de votre banque et scannez le code dans l'app."
                    : "To use the QR Code, open your bank app and scan the code inside the app."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-2xl bg-white border-2 border-border shadow-sm">
              <img
                src={pixQrCodeAsset.url}
                alt="QR Code PIX"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 w-full max-w-xs"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  {language === "pt-br"
                    ? "Copiado!"
                    : language === "es"
                      ? "¡Copiado!"
                      : "Copied!"}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {copyLabel}
                </>
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/70">{thanksText}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
