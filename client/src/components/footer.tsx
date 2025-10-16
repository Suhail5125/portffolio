import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-border/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold gradient-text-cyan-magenta mb-4">
              Portfolio
            </h3>
            <p className="text-muted-foreground text-sm">
              Crafting immersive web experiences with cutting-edge 3D technologies and modern web development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {["Home", "Projects", "Skills", "About", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const section = document.querySelector(
                        item === "Home" ? "body" : `#${item.toLowerCase()}`
                      );
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-muted-foreground hover:text-chart-1 transition-colors text-sm text-left"
                    data-testid={`link-footer-${item.toLowerCase()}`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-github"
                className="p-2 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
              >
                <Github className="h-5 w-5 transition-colors group-hover:text-chart-1" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-linkedin"
                className="p-2 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
              >
                <Linkedin className="h-5 w-5 transition-colors group-hover:text-chart-1" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-twitter"
                className="p-2 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
              >
                <Twitter className="h-5 w-5 transition-colors group-hover:text-chart-1" />
              </a>
              <a
                href="mailto:contact@example.com"
                data-testid="link-footer-email"
                className="p-2 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
              >
                <Mail className="h-5 w-5 transition-colors group-hover:text-chart-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50">
          <motion.p
            className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span>© {currentYear} Portfolio. Made with</span>
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="h-4 w-4 text-chart-2 fill-current" />
            </motion.span>
            <span>using React Three Fiber</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
