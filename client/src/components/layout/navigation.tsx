import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Code2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsOpen(false);
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative z-50 transition-all duration-300 pt-6 pb-0"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-lg border border-border/50 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" data-testid="link-home">
              <motion.div
                className="flex items-center gap-2 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Code2 className="h-8 w-8 text-chart-1 transition-all group-hover:glow-cyan" />
                  <motion.div
                    className="absolute inset-0 bg-chart-1/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="font-display text-xl font-bold gradient-text-cyan-magenta">
                  CodebySRS
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => scrollToSection(item.href)}
                      data-testid={`link-${item.name.toLowerCase()}`}
                      className={cn(
                        "px-4 py-2 rounded-md font-medium transition-all relative group",
                        "hover-elevate active-elevate-2"
                      )}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-chart-1 to-chart-2"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  ) : (
                    <Link href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                      <button
                        className={cn(
                          "px-4 py-2 rounded-md font-medium transition-all relative group",
                          "hover-elevate active-elevate-2"
                        )}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-chart-1 to-chart-2"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </button>
                    </Link>
                  )}
                </motion.div>
              ))}
              <ThemeToggle />
              <Button
                onClick={() => scrollToSection("#contact")}
                className="relative overflow-hidden group"
                size="sm"
                data-testid="button-lets-work-together"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Let's Work Together
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                data-testid="button-menu-toggle"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2 mx-4 overflow-hidden"
          >
            <div className="glass rounded-lg border border-border/50 p-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.href.startsWith("#") ? (
                      <button
                        onClick={() => scrollToSection(item.href)}
                        data-testid={`link-mobile-${item.name.toLowerCase()}`}
                        className="w-full text-left px-4 py-3 rounded-md font-medium hover-elevate active-elevate-2 transition-all"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link href={item.href} data-testid={`link-mobile-${item.name.toLowerCase()}`}>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-full text-left px-4 py-3 rounded-md font-medium hover-elevate active-elevate-2 transition-all"
                        >
                          {item.name}
                        </button>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
