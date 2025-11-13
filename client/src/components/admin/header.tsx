import { useLocation } from "wouter";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-border/50 glass sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative flex items-center">
          {/* Left: Icon, Title and Description */}
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <LayoutDashboard className="h-6 w-6 text-chart-1" />
              </div>
            </motion.div>
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="relative overflow-hidden group"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="relative z-10">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}