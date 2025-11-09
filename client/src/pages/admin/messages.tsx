import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  MailOpen,
  Trash2,
  Search,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ContactMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">(
    "all"
  );

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact/messages"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PUT", `/api/contact/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message marked as read" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/contact/messages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message deleted successfully!" });
      setSelectedMessage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filterStatus === "read") return msg.read;
      if (filterStatus === "unread") return !msg.read;
      return true;
    })
    .filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Messages
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filterStatus === "unread" ? "default" : "outline"}
              onClick={() => setFilterStatus("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filterStatus === "read" ? "default" : "outline"}
              onClick={() => setFilterStatus("read")}
            >
              Read ({messages.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-12">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== "all"
                ? "No messages found"
                : "No messages yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 glass border-border/50 hover-elevate transition-all cursor-pointer ${
                      !message.read ? "border-chart-1/50" : ""
                    }`}
                    onClick={() => handleOpenMessage(message)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left: Mail Icon + Name & Email */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg glass">
                          {message.read ? (
                            <MailOpen className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Mail className="h-5 w-5 text-chart-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{message.name}</h3>
                            {!message.read && (
                              <Badge className="bg-chart-1 text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {message.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Right: Date & Delete */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Row 1: Name & Email */}
              <Card className="p-4 glass border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Name
                    </Label>
                    <p className="font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </Label>
                    <p className="font-medium text-chart-1">{selectedMessage.email}</p>
                  </div>
                </div>
              </Card>
              
              {/* Row 2: Project Type & Date */}
              <Card className="p-4 glass border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      Project Type
                    </Label>
                    <Badge variant="secondary" className="font-medium">
                      {(selectedMessage.projectType || selectedMessage['project_type']) ? 
                        (selectedMessage.projectType || selectedMessage['project_type']).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                        : "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date & Time
                    </Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Row 3: Subject */}
              <Card className="p-4 glass border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Subject
                  </Label>
                  <p className="font-medium">{selectedMessage.subject || "No subject"}</p>
                </div>
              </Card>
              
              {/* Row 4: Message */}
              <Card className="p-4 glass border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                    <MailOpen className="h-3 w-3" />
                    Message
                  </Label>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{selectedMessage.message}</p>
                </div>
              </Card>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`)
                  }
                  className="bg-chart-1 hover:bg-chart-1/90"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
