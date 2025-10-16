import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  MessageSquare,
  User,
  LogOut,
  Home,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, Skill, ContactMessage } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact/messages"],
  });

  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    {
      title: "Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-chart-1",
      href: "/admin/projects",
    },
    {
      title: "Skills",
      value: skills.length,
      icon: Wrench,
      color: "text-chart-2",
      href: "/admin/skills",
    },
    {
      title: "Messages",
      value: messages.length,
      icon: MessageSquare,
      color: "text-chart-3",
      href: "/admin/messages",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
  ];

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="h-8 w-8 text-chart-1" />
              <h1 className="font-display text-2xl font-bold gradient-text-cyan-magenta">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="icon" data-testid="button-view-site">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-border/50 glass relative">
                  {stat.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-chart-2 text-xs font-bold">
                        {stat.badge}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg glass ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-display font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-border/50 glass">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-chart-1" />
                Manage Projects
              </h2>
              <p className="text-muted-foreground mb-4">
                Add, edit, or remove portfolio projects to showcase your work.
              </p>
              <Link href="/admin/projects">
                <Button data-testid="button-manage-projects">
                  Manage Projects
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-border/50 glass">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-chart-2" />
                Manage Skills
              </h2>
              <p className="text-muted-foreground mb-4">
                Update your skills and proficiency levels for the 3D visualization.
              </p>
              <Link href="/admin/skills">
                <Button data-testid="button-manage-skills">Manage Skills</Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 border-border/50 glass">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-chart-3" />
                View Messages
                {unreadMessages > 0 && (
                  <span className="text-sm bg-chart-2 px-2 py-1 rounded-full">
                    {unreadMessages} new
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground mb-4">
                Read and respond to contact form submissions.
              </p>
              <Link href="/admin/messages">
                <Button data-testid="button-view-messages">View Messages</Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 border-border/50 glass">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-chart-4" />
                Edit About Info
              </h2>
              <p className="text-muted-foreground mb-4">
                Update your bio, avatar, and social media links.
              </p>
              <Link href="/admin/about">
                <Button data-testid="button-edit-about">Edit About</Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
