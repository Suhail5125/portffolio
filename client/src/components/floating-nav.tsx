import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Code, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", href: "#hero" },
  { icon: Briefcase, label: "Projects", href: "#projects" },
  { icon: Code, label: "Skills", href: "#skills" },
  { icon: User, label: "About", href: "#about" },
  { icon: MessageSquare, label: "Contact", href: "#contact" }
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        {/* Toggle button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full glass border border-chart-1/30 hover:border-chart-1/60 transition-all group mb-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="h-5 w-5 text-chart-1" />
            ) : (
              <Menu className="h-5 w-5 text-chart-1" />
            )}
          </motion.div>
        </motion.button>

        {/* Navigation items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="p-3 rounded-full glass border border-border/50 hover:border-chart-1/60 transition-all group relative"
                  whileHover={{ scale: 1.1, x: 10 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-chart-1 transition-colors" />
                  
                  {/* Tooltip */}
                  <motion.div
                    className="absolute left-full ml-3 px-2 py-1 bg-popover border rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    {item.label}
                  </motion.div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}