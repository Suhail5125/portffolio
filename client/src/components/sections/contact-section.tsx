import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Send, CheckCircle2, Zap, Shield, Clock, Users, Star, Rocket, Award, Target, Lightbulb, MessageSquare, DollarSign, Calendar, Sparkles, Mail, User, Briefcase } from "lucide-react";
import { useState } from "react";

interface ContactSectionProps {
  onSubmit: (data: InsertContactMessage) => Promise<void>;
  isSubmitting: boolean;
}

export function ContactSection({ onSubmit, isSubmitting }: ContactSectionProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const maxMessageLength = 500;

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      projectType: "",
      message: "",
    },
  });

  const handleSubmit = async (data: InsertContactMessage) => {
    try {

      await onSubmit(data);
      setIsSuccess(true);
      form.reset({
        name: "",
        email: "",
        subject: "",
        projectType: "",
        message: "",
      });
      setMessageLength(0);
      // Animation stays visible until user clicks "Send Another Message"
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  return (
    <section id="contact" className="min-h-screen pt-0 pb-8 md:py-8 relative overflow-hidden flex items-center">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/20 to-background" />

        {/* Matrix-style Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Floating Code Symbols */}
        {Array.from({ length: 30 }).map((_, i) => {
          const symbols = ['<>', '{}', '[]', '/>', '()', '&&', '||', '=>', 'fn', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'try', 'catch', 'class', 'import', 'export', 'async', 'await', 'return', 'null', 'true', 'false', '===', '!==', '++', '--', '+=', '-=', '*=', '/=', '??', '?.', '...', 'new', 'this', 'super', 'extends', 'implements'];
          return (
            <motion.div
              key={i}
              className="absolute font-mono font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 16}px`,
                color: `hsl(var(--chart-${(i % 4) + 1}))`,
                opacity: 0.1,
              }}
              animate={{
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            >
              {symbols[i % symbols.length]}
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold mb-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text-cyan-purple">Let's Work Together</span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Ready to bring your vision to life? Let's create something amazing together
            </motion.p>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-chart-1"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              <div className="h-1.5 w-1.5 rounded-full bg-chart-1 mx-3" />
              <motion.div
                className="h-px w-16 bg-gradient-to-l from-transparent to-chart-1"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 items-start">
            {/* Left Side - Why Contact Us */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3 space-y-3"
            >
              <div className="space-y-3">

                {[
                  {
                    icon: Briefcase,
                    title: "💼 Business Inquiries",
                    description: "Professional consultation for all your business needs. We understand your challenges and provide strategic solutions.",
                    color: "chart-1"
                  },
                  {
                    icon: Rocket,
                    title: "🚀 Quick Response (48hr)",
                    description: "Fast turnaround guaranteed. Get detailed replies within 48 hours for all project inquiries and questions.",
                    color: "chart-2"
                  },
                  {
                    icon: Target,
                    title: "🎯 Custom Solutions",
                    description: "Tailored approaches designed specifically for your unique requirements. No one-size-fits-all solutions.",
                    color: "chart-3"
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <Card className="p-4 glass border-border/50 relative overflow-hidden group hover:border-chart-1/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-chart-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                          <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                          <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <Card className="p-6 glass border-border/50 relative overflow-hidden">
                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }} />
                </div>

                <div className="relative z-10" style={{ minHeight: '400px' }}>
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 relative overflow-hidden"
                    >
                      {/* Confetti particles */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: `hsl(var(--chart-${(i % 4) + 1}))`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          initial={{ scale: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            y: [0, -100, -200],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}

                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                        className="relative"
                      >
                        <motion.div
                          className="absolute inset-0 bg-chart-4/20 rounded-full blur-xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <CheckCircle2 className="h-24 w-24 text-chart-4 mx-auto mb-6 relative z-10" />
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="font-display text-3xl font-bold mb-4 gradient-text-cyan-magenta">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            Message Sent Successfully!
                          </motion.span>
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Thank you for reaching out! We've received your message and will get back to you within 48 hours.
                        </p>

                        <Button
                          onClick={() => {
                            setIsSuccess(false);
                            setMessageLength(0);
                          }}
                          variant="outline"
                          data-testid="button-send-another"
                          className="glass"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold flex items-center gap-2">
                                  <User className="h-4 w-4 text-chart-1" />
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Your name"
                                    data-testid="input-name"
                                    className="glass border-border/50 focus:border-chart-1 transition-colors"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-chart-2" />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="your.email@example.com"
                                    data-testid="input-email"
                                    className="glass border-border/50 focus:border-chart-1 transition-colors"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-chart-3" />
                                Project Type
                              </FormLabel>
                              <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass border-border/50 focus:border-chart-1">
                                    <SelectValue placeholder="Select project type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="web-development">Web Development</SelectItem>
                                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                                  <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                                  <SelectItem value="consulting">Consulting</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <Star className="h-4 w-4 text-chart-4" />
                                Subject
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="What's this about?"
                                  data-testid="input-subject"
                                  className="glass border-border/50 focus:border-chart-1 transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-chart-4" />
                                  Message
                                </span>
                                <span className={`text-xs ${messageLength > maxMessageLength ? 'text-red-500' :
                                    messageLength > maxMessageLength * 0.8 ? 'text-yellow-500' :
                                      'text-muted-foreground'
                                  }`}>
                                  {messageLength}/{maxMessageLength}
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Tell us about your project, goals, and any specific requirements..."
                                  rows={4}
                                  maxLength={maxMessageLength}
                                  data-testid="input-message"
                                  className="glass border-border/50 focus:border-chart-1 transition-colors resize-none"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setMessageLength(e.target.value.length);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          data-testid="button-submit-contact"
                          className="w-full relative overflow-hidden group"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}