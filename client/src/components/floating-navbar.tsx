import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { Code2, Home, User, Briefcase, MessageSquare, Menu, X, Palette } from "lucide-react";

const navItems = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Services", href: "#services", icon: Palette },
  { name: "About", href: "#about", icon: User },
  { name: "Contact", href: "#contact", icon: MessageSquare },
];

export function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > window.innerHeight * 0.8);
    });
    return unsubscribe;
  }, [scrollY]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      {/* Menu Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-lg border border-chart-1/30 p-3 mb-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          x: isVisible ? 0 : -100 
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-chart-1" />
        ) : (
          <Menu className="h-5 w-5 text-chart-1" />
        )}
      </motion.button>

      {/* Floating Navbar */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="glass rounded-lg border border-chart-1/30 p-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
              <Code2 className="h-6 w-6 text-chart-1" />
              <span className="font-display text-sm font-bold gradient-text-cyan-magenta">
                CodebySRS
              </span>
            </div>

            {/* Vertical Nav Items */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-chart-1/10 transition-colors group w-full text-left"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-chart-1 transition-colors" />
                  <span className="text-sm font-medium">{item.name}</span>
                </motion.button>
              ))}
            </div>


          </div>
        </motion.div>
      )}
    </div>
  );
}