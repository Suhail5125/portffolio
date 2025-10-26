import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <motion.h1
            className="font-display text-9xl md:text-[12rem] font-black gradient-text-cyan-magenta mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto glass"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            className="mt-12 pt-8 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/#projects">
                <Button variant="ghost" size="sm">
                  Projects
                </Button>
              </Link>
              <Link href="/#services">
                <Button variant="ghost" size="sm">
                  Services
                </Button>
              </Link>
              <Link href="/#about">
                <Button variant="ghost" size="sm">
                  About
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
