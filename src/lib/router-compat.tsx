// Thin compatibility shim that maps the small subset of react-router-dom
// the legacy pages use onto TanStack Router primitives.
import {
  Link as TSLink,
  useNavigate as useTSNavigate,
  useLocation as useTSLocation,
  Navigate as TSNavigate,
} from "@tanstack/react-router";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Link(
  props: Omit<ComponentProps<typeof TSLink>, "to"> & { to: string; replace?: boolean; children?: ReactNode }
) {
  const { to, replace, ...rest } = props;
  return <TSLink to={to as any} replace={replace} {...(rest as any)} />;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  return <TSNavigate to={to as any} replace={replace} />;
}

export function useNavigate() {
  const navigate = useTSNavigate();
  return (to: string, opts?: { replace?: boolean }) =>
    navigate({ to: to as any, replace: opts?.replace });
}

export function useLocation() {
  return useTSLocation();
}

interface NavLinkRenderProps {
  isActive: boolean;
  isPending: boolean;
}

interface NavLinkProps extends Omit<ComponentProps<typeof TSLink>, "to" | "className" | "children"> {
  to: string;
  className?: string | ((p: NavLinkRenderProps) => string);
  children?: ReactNode | ((p: NavLinkRenderProps) => ReactNode);
  end?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, className, children, ...rest },
  ref,
) {
  return (
    <TSLink
      ref={ref as any}
      to={to as any}
      {...(rest as any)}
      className={(state: any) => {
        const isActive = !!state?.isActive;
        const p = { isActive, isPending: false };
        if (typeof className === "function") return className(p);
        return cn(className, isActive && "active");
      }}
    >
      {typeof children === "function"
        ? (state: any) => (children as any)({ isActive: !!state?.isActive, isPending: false })
        : children}
    </TSLink>
  );
});

export type { NavLinkProps };
