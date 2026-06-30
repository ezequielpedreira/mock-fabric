import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, BookOpen, ArrowLeft, Search, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const CATEGORIES = [
  "Segurança e Governança",
  "Ciclo de Vida",
  "Obter Dados",
  "Transformar Dados",
  "Consultar e Analisar",
  "Projetar Modelos Semânticos",
  "Otimizar Modelos Semânticos",
];

const OPTION_KEYS = ["A", "B", "C", "D"];
const PAGE_SIZE = 21;

interface DbQuestion {
  id: number;
  category: string;
  scenario: Record<string, string>;
  question: Record<string, string>;
  options: { key: string; text: Record<string, string> }[];
  correct_answer: string;
  explanation: Record<string, string>;
  created_at: string;
}

interface FormState {
  category: string;
  scenario_pt: string;
  question_pt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation_pt: string;
}

const emptyForm: FormState = {
  category: "",
  scenario_pt: "",
  question_pt: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  explanation_pt: "",
};

function formToDb(f: FormState) {
  const langs = ["pt-br", "en-us", "es", "fr"];
  const fill = (val: string) => Object.fromEntries(langs.map((l) => [l, val]));
  return {
    category: f.category,
    scenario: fill(f.scenario_pt),
    question: fill(f.question_pt),
    options: OPTION_KEYS.map((k) => ({
      key: k,
      text: fill(f[`option_${k.toLowerCase()}` as keyof FormState] as string),
    })),
    correct_answer: f.correct_answer,
    explanation: fill(f.explanation_pt),
  };
}

function dbToForm(q: DbQuestion): FormState {
  return {
    category: q.category,
    scenario_pt: q.scenario["pt-br"] ?? "",
    question_pt: q.question["pt-br"] ?? "",
    option_a: q.options.find((o) => o.key === "A")?.text["pt-br"] ?? "",
    option_b: q.options.find((o) => o.key === "B")?.text["pt-br"] ?? "",
    option_c: q.options.find((o) => o.key === "C")?.text["pt-br"] ?? "",
    option_d: q.options.find((o) => o.key === "D")?.text["pt-br"] ?? "",
    correct_answer: q.correct_answer,
    explanation_pt: q.explanation["pt-br"] ?? "",
  };
}

export default function AdminQuestions() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("questions").select("*").order("id");
    setQuestions((data as DbQuestion[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchCat = categoryFilter === "all" || q.category === categoryFilter;
      const matchSearch = search === "" ||
        q.question["pt-br"]?.toLowerCase().includes(search.toLowerCase()) ||
        q.scenario["pt-br"]?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [questions, search, categoryFilter]);

  const visible = filtered.slice(0, visibleCount);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setVisibleCount(PAGE_SIZE);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (q: DbQuestion) => {
    setEditId(q.id);
    setForm(dbToForm(q));
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.category || !form.question_pt || !form.option_a || !form.option_b || !form.option_c || !form.option_d) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = formToDb(form);
    const { error } = editId
      ? await supabase.from("questions").update(payload).eq("id", editId)
      : await supabase.from("questions").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editId ? "Pergunta atualizada!" : "Pergunta criada!" });
    setOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("questions").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Pergunta excluída" });
      load();
    }
    setDeleteId(null);
  };

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const hasFilters = search !== "" || categoryFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })} className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="h-5 w-px bg-border" />
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-xl font-bold leading-none">Gerenciar Perguntas</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filtered.length} de {questions.length} perguntas
              </p>
            </div>
          </div>
          <Button onClick={openCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Nova Pergunta
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por texto da pergunta..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setVisibleCount(PAGE_SIZE); }}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-muted-foreground shrink-0">
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">Nenhuma pergunta encontrada.</p>
              {hasFilters && <Button variant="outline" onClick={resetFilters}>Limpar filtros</Button>}
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visible.map((q, i) => (
                <Card key={q.id} className="hover:border-primary/40 transition-colors flex flex-col">
                  <CardContent className="py-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                        {q.category}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">#{filtered.indexOf(q) + 1}</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-3 flex-1">{q.question["pt-br"]}</p>
                    <p className="text-xs text-muted-foreground">
                      Resp: <span className="font-semibold text-foreground">{q.correct_answer}</span>
                      {" · "}
                      <span className="line-clamp-1">{q.options.find((o) => o.key === q.correct_answer)?.text["pt-br"]}</span>
                    </p>
                    <div className="flex gap-1 pt-1 border-t border-border/50">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(q)} className="flex-1 gap-1.5 h-7 text-xs">
                        <Pencil className="h-3 w-3" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(q.id)} className="flex-1 gap-1.5 h-7 text-xs hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3" /> Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)} className="gap-2">
                  Carregar mais
                  <span className="text-muted-foreground text-xs">({filtered.length - visibleCount} restantes)</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base sm:text-lg">{editId ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Categoria *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs sm:text-sm">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Cenário (contexto da questão)</Label>
              <Textarea
                placeholder="Descreva o cenário..."
                value={form.scenario_pt}
                onChange={(e) => set("scenario_pt", e.target.value)}
                rows={2}
                className="text-xs sm:text-sm resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Pergunta *</Label>
              <Textarea
                placeholder="Qual é a pergunta?"
                value={form.question_pt}
                onChange={(e) => set("question_pt", e.target.value)}
                rows={2}
                className="text-xs sm:text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {OPTION_KEYS.map((k) => (
                <div key={k} className="space-y-1">
                  <Label className="text-xs sm:text-sm">Opção {k} *</Label>
                  <Input
                    placeholder={`Alternativa ${k}`}
                    value={form[`option_${k.toLowerCase()}` as keyof FormState] as string}
                    onChange={(e) => set(`option_${k.toLowerCase()}` as keyof FormState, e.target.value)}
                    className="h-8 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Resposta Correta *</Label>
              <Select value={form.correct_answer} onValueChange={(v) => set("correct_answer", v)}>
                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPTION_KEYS.map((k) => (
                    <SelectItem key={k} value={k} className="text-xs sm:text-sm">
                      {k} {form[`option_${k.toLowerCase()}` as keyof FormState] ? `— ${form[`option_${k.toLowerCase()}` as keyof FormState]}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs sm:text-sm">Explicação da resposta</Label>
              <Textarea
                placeholder="Explique por que essa é a resposta correta..."
                value={form.explanation_pt}
                onChange={(e) => set("explanation_pt", e.target.value)}
                rows={2}
                className="text-xs sm:text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editId ? "Salvar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir pergunta?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Essa ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
