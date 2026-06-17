import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check, QrCode, Coffee } from "lucide-react";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/data/translations";
import type { Language } from "@/data/questions";

// ============================================================
// CONFIGURAÇÃO: Altere aqui sua chave PIX ou link de doação
// ============================================================
// Exemplos:
// - Chave PIX copia-e-cola: "00020126580014BR.GOV.BCB.PIX0136..."
// - Link PayPal: "https://paypal.me/seulink"
// - Link Ko-fi: "https://ko-fi.com/seulink"
// - Link Buy Me a Coffee: "https://buymeacoffee.com/seulink"
const DONATION_PAYLOAD =
  "https://mock-fabric.lovable.app";
// ============================================================

interface SupportProjectProps {
  language?: Language;
}

export function SupportProject({ language = "pt-br" }: SupportProjectProps) {
  const t = translations[language];
  const { toast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    QRCodeLib.toDataURL(DONATION_PAYLOAD, {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(""));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(DONATION_PAYLOAD).then(() => {
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
            ? "Chave copiada para a área de transferência."
            : language === "es"
              ? "Clave copiada al portapapeles."
              : "Key copied to clipboard.",
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
      ? "Copiar chave"
      : language === "es"
        ? "Copiar clave"
        : language === "fr"
          ? "Copier la clé"
          : "Copy key";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="fixed bottom-6 left-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 gap-2 px-4 py-2 h-auto"
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

          {qrDataUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-2xl bg-white border-2 border-border shadow-sm">
                <img
                  src={qrDataUrl}
                  alt="QR Code para doação"
                  className="w-48 h-48 sm:w-56 sm:h-56"
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
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <QrCode className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground text-center">
                {language === "pt-br"
                  ? "QR Code não configurado ainda."
                  : language === "es"
                    ? "QR Code aún no configurado."
                    : "QR Code not configured yet."}
              </p>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/70">{thanksText}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
