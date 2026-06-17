import { useState } from "react";
import { MessageSquarePlus, Star, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { notifyFeedback } from "@/lib/feedback.functions";

const feedbackSchema = z.object({
  rating: z.number().int().min(1, "Selecione uma nota").max(5),
  comment: z
    .string()
    .trim()
    .max(2000, "Comentário muito longo (máx. 2000 caracteres)")
    .optional(),
});

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setHover(0);
    setComment("");
  };

  const handleSubmit = async () => {
    const parsed = feedbackSchema.safeParse({
      rating,
      comment: comment || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Verifique o feedback",
        description: parsed.error.issues[0]?.message ?? "Dados inválidos",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const page =
        typeof window !== "undefined"
          ? window.location.pathname
          : null;

      const { error } = await supabase.from("feedback").insert({
        user_id: userData.user?.id ?? null,
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? null,
        page,
      });
      if (error) throw error;

      // Fire-and-forget email notification (errors don't block the user)
      notifyFeedback({
        data: {
          rating: parsed.data.rating,
          comment: parsed.data.comment ?? null,
          page,
        },
      }).catch((e) => console.error("notifyFeedback failed", e));

      toast({
        title: "Obrigado pelo feedback!",
        description: "Sua opinião nos ajuda a melhorar.",
      });
      reset();
      setOpen(false);
    } catch (err) {
      console.error("feedback submit error", err);
      toast({
        title: "Não foi possível enviar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          aria-label="Enviar feedback"
          className="fixed bottom-6 right-6 z-50 h-12 gap-2 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40"
        >
          <MessageSquarePlus className="h-5 w-5" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Como está sua experiência?</DialogTitle>
          <DialogDescription>
            Avalie e, se quiser, deixe um comentário. Seu feedback nos ajuda a evoluir.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = (hover || rating) >= n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      active
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte o que você gostou ou o que podemos melhorar (opcional)"
              rows={4}
              maxLength={2000}
            />
            <p className="text-right text-xs text-muted-foreground">
              {comment.length}/2000
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}