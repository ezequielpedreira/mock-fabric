import { Globe, ArrowLeft } from "lucide-react";
import { type Language } from "@/data/questions";
import { languageLabels } from "@/data/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  title: string;
  onBack?: () => void;
}

export function Header({ language, onLanguageChange, title, onBack }: HeaderProps) {
  return (
    <header className="relative flex min-h-16 shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-sidebar-border px-3 text-header-foreground sm:px-6 bg-[linear-gradient(115deg,var(--header-bg),color-mix(in_oklch,var(--header-bg)_82%,var(--fabric-violet)))]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-fabric-cyan/12 blur-3xl" />
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 px-2 text-header-foreground hover:bg-white/10 hover:text-white sm:px-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        )}
        <div className="fabric-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg ring-1 ring-white/15">
          DP
        </div>
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
        <span className="hidden whitespace-nowrap rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-sidebar-foreground md:inline">
          Microsoft Fabric
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-2 px-2 text-header-foreground hover:bg-white/10 hover:text-white sm:px-3"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{languageLabels[language]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(languageLabels) as Language[]).map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={language === lang ? "bg-accent text-accent-foreground" : ""}
            >
              {languageLabels[lang]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
