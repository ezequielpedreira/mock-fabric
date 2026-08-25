import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FirstLoginTour } from "@/components/onboarding/FirstLoginTour";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, loading, accessLoading } = useAuth();
  if (loading || (user && accessLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <FirstLoginTour />
      <Outlet />
    </>
  );
}
