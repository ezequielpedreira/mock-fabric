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
    <header className="h-14 flex items-center justify-between gap-2 px-3 sm:px-6 bg-header text-header-foreground border-b border-sidebar-border shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-header-foreground hover:bg-sidebar-accent px-2 sm:px-3">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        )}
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm text-primary-foreground shrink-0">
          DP
        </div>
        <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">{title}</h1>
        <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium whitespace-nowrap">
          Microsoft Fabric
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-header-foreground hover:bg-sidebar-accent shrink-0 px-2 sm:px-3">
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
