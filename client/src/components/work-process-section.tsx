import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Discovery & Planning",
    description: "We start by understanding your business goals, target audience, and project requirements to create a comprehensive strategy.",
    color: "text-chart-1",
    gradient: "from-chart-1 to-chart-2",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Research & Analysis",
    description: "Deep dive into market research, competitor analysis, and user behavior to inform our design and development decisions.",
    color: "text-chart-2",
    gradient: "from-chart-2 to-chart-3",
  },
  {
    number: "03",
    icon: Palette,
    title: "Design & Prototype",
    description: "Create stunning visual designs and interactive prototypes that bring your vision to life before development begins.",
    color: "text-chart-3",
    gradient: "from-chart-3 to-chart-4",
  },
  {
    number: "04",
    icon: Code,
    title: "Development",
    description: "Build your solution using cutting-edge technologies and best practices, ensuring scalability and performance.",
    color: "text-chart-4",
    gradient: "from-chart-4 to-chart-1",
  },
  {
    number: "05",
    icon: TestTube,
    title: "Testing & QA",
    description: "Rigorous testing across devices and browsers to ensure everything works flawlessly before launch.",
    color: "text-chart-1",
    gradient: "from-chart-1 to-chart-2",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Launch & Support",
    description: "Deploy your project to production and provide ongoing support and maintenance to ensure continued success.",
    color: "text-chart-2",
    gradient: "from-chart-2 to-chart-3",
  },
];

export function WorkProcessSection() {
  return (
    <section id="process" className="min-h-screen pt-16 pb-16 relative bg-gradient-to-b from-card/50 to-background flex items-center snap-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-spectrum">Our Work Process</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers exceptional results every time
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="p-6 glass border-border/50 hover-elevate transition-all h-full group relative overflow-hidden">
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  whileHover={{ scale: 1.05 }}
                />

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.span
                      className={`font-display text-5xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
                    >
                      {step.number}
                    </motion.span>
                    
                    {/* Icon */}
                    <motion.div
                      className={`p-3 rounded-lg glass border border-border/50 ${step.color}`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="h-6 w-6" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting line (hidden on mobile, shown on larger screens) */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
