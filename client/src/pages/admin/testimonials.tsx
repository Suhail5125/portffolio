import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Testimonial, InsertTestimonial } from "@shared/schema";

interface FormState extends InsertTestimonial {
  order: number;
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatarUrl: "",
    order: 0,
  });

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      return await apiRequest("POST", "/api/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial created successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertTestimonial }) => {
      return await apiRequest("PUT", `/api/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial updated successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/testimonials/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role ?? "",
        company: testimonial.company ?? "",
        content: testimonial.content,
        rating: testimonial.rating ?? 5,
        avatarUrl: testimonial.avatarUrl ?? "",
        order: testimonial.order ?? 0,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
        avatarUrl: "",
        order: testimonials.length,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: InsertTestimonial = {
      name: formData.name.trim(),
      role: formData.role?.trim() || "",
      company: formData.company?.trim() || "",
      content: formData.content.trim(),
      rating: Number(formData.rating) || 1,
      avatarUrl: formData.avatarUrl?.trim() || "",
      order: Number.isFinite(formData.order) ? formData.order : 0,
    } as InsertTestimonial;

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  const getInitials = (value: string) => {
    return value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? "")
      .join("") || "?";
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="Testimonials" description="Manage client feedback and social proof" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenDialog()} className="bg-chart-1 hover:bg-chart-1/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 rounded-xl glass border border-border/40 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <Card className="p-8 glass border-border/50 text-center">
            <p className="text-muted-foreground">No testimonials yet. Start by adding one.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-6 glass border-border/50">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center bg-chart-1/10 text-chart-1 font-semibold text-lg overflow-hidden">
                          {testimonial.avatarUrl ? (
                            <img
                              src={testimonial.avatarUrl}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span>{getInitials(testimonial.name)}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-semibold">{testimonial.name}</h3>
                            {testimonial.role && <span className="text-sm text-muted-foreground">{testimonial.role}</span>}
                            {testimonial.company && (
                              <span className="text-sm text-chart-1 font-medium">{testimonial.company}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{testimonial.content}</p>
                          <div className="flex items-center gap-1 mt-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${index < (testimonial.rating ?? 0) ? "fill-chart-1 text-chart-1" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Display order: {testimonial.order ?? 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(testimonial)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role ?? ""}
                  onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company ?? ""}
                  onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl ?? ""}
                  onChange={(event) => setFormData({ ...formData, avatarUrl: event.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Testimonial *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(event) => setFormData({ ...formData, content: event.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={(event) =>
                    setFormData({ ...formData, rating: Math.min(5, Math.max(1, Number(event.target.value) || 1)) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(event) => setFormData({ ...formData, order: Number(event.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingTestimonial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
