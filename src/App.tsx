import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Landing = lazy(() => import("@/pages/Landing").then((m) => ({ default: m.Landing })));
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Onboarding = lazy(() => import("@/pages/Onboarding").then((m) => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Subscribe = lazy(() => import("@/pages/Subscribe").then((m) => ({ default: m.Subscribe })));
const AppShell = lazy(() => import("@/components/AppShell").then((m) => ({ default: m.AppShell })));
const Privacy = lazy(() => import("@/pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/pages/Terms").then((m) => ({ default: m.Terms })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login isSignUp />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
