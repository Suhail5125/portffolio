import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and scalability.",
    color: "text-chart-1",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces designed with user experience in mind. We create designs that engage and convert.",
    color: "text-chart-2",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Responsive mobile applications that work seamlessly across all devices and platforms.",
    color: "text-chart-3",
    gradient: "from-chart-3/20 to-chart-3/5",
  },
  {
    icon: Globe,
    title: "3D Web Experiences",
    description: "Immersive 3D visualizations and interactive experiences using WebGL, Three.js, and modern graphics technologies.",
    color: "text-chart-4",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up your existing applications with expert optimization techniques for better user experience and SEO.",
    color: "text-chart-1",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Rocket,
    title: "Consulting & Strategy",
    description: "Technical consulting and strategic planning to help you make the right technology decisions for your business.",
    color: "text-chart-2",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="min-h-screen pt-16 pb-16 relative flex items-center snap-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan-magenta">Our Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions to bring your digital vision to life
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 glass border-border/50 hover-elevate transition-all h-full group relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-3 rounded-lg glass border border-border/50 mb-4 ${service.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon className="h-6 w-6" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
