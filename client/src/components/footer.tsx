import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Phone, MapPin, Clock, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative py-16 border-t border-border/50 overflow-hidden snap-start">
      {/* Animated Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-chart-1/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.6, 0.4, 0.6],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-chart-3/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/4 right-1/3 w-[350px] h-[350px] bg-chart-4/8 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="font-display text-2xl font-bold gradient-text-cyan-magenta mb-4 text-center md:text-left">
              Portfolio
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-center md:text-left">
              We craft immersive web experiences with cutting-edge 3D technologies and modern web development solutions.
            </p>
          </motion.div>

          {/* Get In Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="font-semibold mb-4 text-center md:text-left">Get In Touch</h4>
            <div className="space-y-3 w-full">
              <motion.a
                href="mailto:contact@example.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all text-sm group"
                data-testid="link-footer-email"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ x: 5 }}
              >
                <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                  <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
                <span>contact@example.com</span>
              </motion.a>
              <motion.a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all text-sm group"
                data-testid="link-footer-phone"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.25 }}
                whileHover={{ x: 5 }}
              >
                <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                  <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
                <span>+91 1234567890</span>
              </motion.a>
              <motion.div 
                className="flex items-center gap-3 text-muted-foreground text-sm group"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                  <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
                <span>Pune, MH, India</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Follow Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="font-semibold mb-4 text-center md:text-left">Follow Me</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {[
                { icon: Github, href: "https://github.com", name: "github" },
                { icon: Linkedin, href: "https://linkedin.com", name: "linkedin" },
                { icon: Twitter, href: "https://twitter.com", name: "twitter" },
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${social.name}`}
                  className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <social.icon className="h-5 w-5 transition-colors group-hover:text-chart-1 relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="glass rounded-xl border border-border/50 p-6 w-[120%] -ml-[20%] hover-elevate transition-all relative overflow-hidden">
              {/* Animated gradient orbs */}
              <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 bg-chart-1/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-2/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="font-semibold text-sm">Available for Work</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                We're currently accepting new client projects and would love to hear about your business needs.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-chart-1" />
                  <span>Response Time: Within 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-chart-2" />
                  <span>Timezone: IST (UTC +5:30)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mb-2">
              <span>© {currentYear} Portfolio. Made with</span>
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                <Heart className="h-4 w-4 text-chart-2 fill-current" />
              </motion.span>
              <span>using React Three Fiber</span>
            </p>
            <motion.p 
              className="text-xs text-muted-foreground/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Designed & Developed with passion
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
