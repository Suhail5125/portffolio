import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full"
          >
            <Card className="p-8 glass border-border/50">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  className="mb-6 p-4 rounded-full bg-destructive/10"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </motion.div>

                {/* Title */}
                <h1 className="font-display text-3xl font-bold mb-4">
                  Oops! Something went wrong
                </h1>

                {/* Description */}
                <p className="text-muted-foreground mb-6 max-w-md">
                  We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                </p>

                {/* Error Details (in development) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mb-6 w-full">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
                      Error Details (Development Only)
                    </summary>
                    <Card className="p-4 bg-muted/50 text-left">
                      <pre className="text-xs overflow-auto">
                        <code>{this.state.error.toString()}</code>
                      </pre>
                    </Card>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={this.handleReload}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button
                    onClick={this.handleReset}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto glass"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
