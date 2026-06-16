import { Link, useLocation } from "@/lib/router-compat";
import { translations, languageLabels } from "@/data/translations";
import type { Language } from "@/data/questions";
import { Home, Award, PlayCircle, GraduationCap, FlaskConical, Globe, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HorizontalNavProps {
  language: Language;
  onScrollToSection?: (section: string) => void;
  onLanguageChange?: (lang: Language) => void;
}

// Microsoft Fabric official logo
function FabricIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 0L24 8L16 16L8 8z" fill="#F24F23" />
      <path d="M8 8L16 16L8 24L0 16z" fill="#00A4EF" />
      <path d="M24 8L32 16L24 24L16 16z" fill="#7FBA00" />
      <path d="M16 16L24 24L16 32L8 24z" fill="#FFB900" />
    </svg>
  );
}

export function HorizontalNav({ language, onScrollToSection, onLanguageChange }: HorizontalNavProps) {
  const t = translations[language];
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const navItems = [
    { label: t.navHome, icon: Home, href: "/", isLink: true },
    { label: t.navTraining, icon: PlayCircle, href: "/training", isLink: true },
    { label: t.navExam, icon: GraduationCap, href: "/exam", isLink: true },
    { label: t.navLab, icon: FlaskConical, href: "/lab", isLink: true },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container flex items-center gap-2 py-1.5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 pr-3 mr-1 border-r border-border/60 shrink-0">
          <FabricIcon className="h-7 w-7" />
          <span className="hidden sm:inline text-sm font-bold tracking-tight text-foreground">
            DP-600
          </span>
        </Link>

        {/* Nav items */}
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isLink ? location.pathname === item.href : false;

            if (item.isLink) {
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  onClick={() => onScrollToSection?.(item.href)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right cluster: language + logout */}
        <div className="flex items-center gap-1 shrink-0">
          {onLanguageChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
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
          )}

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title={t.signOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{t.signOut}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
