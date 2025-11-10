import { ComponentType, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient, getQueryFn } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminSkills from "@/pages/admin/skills";
import AdminMessages from "@/pages/admin/messages";
import AdminAbout from "@/pages/admin/about";

function withAuth(Component: ComponentType<any>): ComponentType<any> {
  const ProtectedComponent: ComponentType<any> = (props: any) => {
    const [, setLocation] = useLocation();
    const { data, isLoading, isFetching } = useQuery<unknown | null>({
      queryKey: ["/api/auth/user"],
      queryFn: getQueryFn({ on401: "returnNull" }),
      staleTime: 30 * 60 * 1000,
    });

    useEffect(() => {
      if (!isLoading && !isFetching && data === null) {
        setLocation("/admin/login", { replace: true });
      }
    }, [data, isFetching, isLoading, setLocation]);

    if (isLoading || isFetching) {
      return null;
    }

    if (data === null) {
      return null;
    }

    return <Component {...props} />;
  };

  return ProtectedComponent;
}

import AdminPrivacyPolicy from "@/pages/admin/privacy-policy";
import AdminTermsOfService from "@/pages/admin/terms-of-service";

const ProtectedAdminDashboard = withAuth(AdminDashboard);
const ProtectedAdminProjects = withAuth(AdminProjects);
const ProtectedAdminSkills = withAuth(AdminSkills);
const ProtectedAdminMessages = withAuth(AdminMessages);
const ProtectedAdminAbout = withAuth(AdminAbout);
const ProtectedAdminPrivacyPolicy = withAuth(AdminPrivacyPolicy);
const ProtectedAdminTermsOfService = withAuth(AdminTermsOfService);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={ProtectedAdminDashboard} />
      <Route path="/admin/projects" component={ProtectedAdminProjects} />
      <Route path="/admin/skills" component={ProtectedAdminSkills} />
      <Route path="/admin/messages" component={ProtectedAdminMessages} />
      <Route path="/admin/about" component={ProtectedAdminAbout} />
      <Route path="/admin/privacy-policy" component={ProtectedAdminPrivacyPolicy} />
      <Route path="/admin/terms-of-service" component={ProtectedAdminTermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
