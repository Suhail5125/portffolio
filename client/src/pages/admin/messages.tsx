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
      return await apiRequest("PATCH", `/api/contact/messages/${id}/read`, {});
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
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold gradient-text-cyan-magenta">
                  Messages
                </h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
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
              placeholder="Search messages..."
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
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg glass">
                        {message.read ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-chart-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{message.name}</h3>
                            {!message.read && (
                              <Badge className="bg-chart-1">New</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {message.email}
                        </p>
                        <p className="text-sm line-clamp-2">{message.message}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <p className="font-semibold">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-semibold">{selectedMessage.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-semibold">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className={selectedMessage.read ? "" : "bg-chart-1"}>
                    {selectedMessage.read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Message
                </Label>
                <Card className="p-4 glass border-border/50">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </Card>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `mailto:${selectedMessage.email}`)
                  }
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
