import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Skill, InsertSkill } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["Frontend", "Backend", "3D/Graphics", "Tools", "Other"];

export default function AdminSkills() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Partial<InsertSkill>>({
    name: "",
    category: "Frontend",
    proficiency: 50,
    icon: "",
  });

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      return await apiRequest("POST", "/api/skills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill created successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertSkill }) => {
      return await apiRequest("PUT", `/api/skills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill updated successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/skills/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon || "",
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "Frontend",
        proficiency: 50,
        icon: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      updateMutation.mutate({
        id: editingSkill.id,
        data: formData as InsertSkill,
      });
    } else {
      createMutation.mutate(formData as InsertSkill);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteMutation.mutate(id);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
              <h1 className="font-display text-2xl font-bold gradient-text-cyan-magenta">
                Manage Skills
              </h1>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">Loading skills...</div>
        ) : skills.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categorySkills = groupedSkills[category] || [];
              if (categorySkills.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    {category}
                    <Badge variant="secondary">{categorySkills.length}</Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 glass border-border/50 hover-elevate transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">{skill.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {skill.proficiency}% proficiency
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleOpenDialog(skill)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(skill.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-chart-1 h-2 rounded-full transition-all"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., React, Node.js, Three.js"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="proficiency">
                Proficiency: {formData.proficiency}%
              </Label>
              <input
                type="range"
                id="proficiency"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proficiency: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="Icon name or emoji"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingSkill ? "Update" : "Create"} Skill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
