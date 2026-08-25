import { Link, useLocation } from "@/lib/router-compat";
import { translations, languageLabels } from "@/data/translations";
import type { Language } from "@/data/questions";
import {
  Home,
  Award,
  PlayCircle,
  GraduationCap,
  FlaskConical,
  Globe,
  LogOut,
  ShieldCheck,
} from "lucide-react";
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
import { SupportProject } from "@/components/SupportProject";
import { FabricMark } from "@/components/FabricMark";

interface HorizontalNavProps {
  language: Language;
  onScrollToSection?: (section: string) => void;
  onLanguageChange?: (lang: Language) => void;
}

export function HorizontalNav({
  language,
  onScrollToSection,
  onLanguageChange,
}: HorizontalNavProps) {
  const t = translations[language];
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
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
    ...(isAdmin ? [{ label: "Admin", icon: ShieldCheck, href: "/admin", isLink: true }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-card/78 shadow-[0_10px_35px_-28px_oklch(0.25_0.12_255/0.45)] backdrop-blur-2xl supports-[backdrop-filter]:bg-card/72">
      <div className="container flex min-h-16 items-center gap-1 py-2 sm:gap-2">
        {/* Brand */}
        <Link
          to="/"
          className="group mr-1 flex shrink-0 items-center gap-2 border-r border-border/70 pr-2 sm:pr-4"
          aria-label="Mock Fabric DP-600 — início"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_8px_22px_-13px_oklch(0.35_0.16_255/0.45)] ring-1 ring-border/60 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105">
            <FabricMark className="h-7 w-7" />
          </span>
          <span className="hidden leading-none md:block">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Mock Fabric
            </span>
            <span className="mt-1 block text-sm font-bold tracking-tight text-foreground">
              DP-600
            </span>
          </span>
        </Link>

        {/* Nav items */}
        <ul className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isLink ? location.pathname === item.href : false;

            if (item.isLink) {
              return (
                <li key={item.label} className="shrink-0">
                  <Link
                    to={item.href}
                    className={cn(
                      "flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-200 whitespace-nowrap",
                      isActive
                        ? "fabric-gradient text-white shadow-[0_10px_25px_-15px_color-mix(in_oklch,var(--primary)_85%,transparent)]"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                    )}
                    title={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label} className="shrink-0">
                <button
                  onClick={() => onScrollToSection?.(item.href)}
                  className="flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right cluster: support + language + logout */}
        <div className="flex shrink-0 items-center gap-0.5 border-l border-border/70 pl-1 sm:gap-1 sm:pl-2">
          <SupportProject language={language} />

          {onLanguageChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 px-2 text-muted-foreground hover:text-foreground sm:gap-2 sm:px-3"
                  aria-label={`Idioma: ${languageLabels[language]}`}
                >
                  <Globe className="h-4 w-4 shrink-0" />
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
            <div className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:gap-2 sm:px-3"
                title={t.signOut}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{t.signOut}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
