import { useLocation } from "@/lib/router-compat";
import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { FabricMark } from "@/components/FabricMark";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="fabric-ambient flex min-h-screen items-center justify-center px-4 py-8">
      <div className="premium-panel w-full max-w-lg rounded-3xl p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-border/60">
          <FabricMark className="h-10 w-10" />
        </div>
        <p className="fabric-text-gradient text-sm font-bold uppercase tracking-[0.2em]">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mb-7 mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
          O endereço acessado não existe ou foi movido.
        </p>
        <Link to="/">
          <Button variant="hero" size="lg">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
