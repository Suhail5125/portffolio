import { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Skill, InsertSkill } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SkillCategory = "Frontend" | "Backend" | "3D/Graphics" | "Tools" | "Other";
const categories: SkillCategory[] = ["Frontend", "Backend", "3D/Graphics", "Tools", "Other"];

export default function AdminSkills() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  type FormData = Omit<InsertSkill, 'category'> & { category: SkillCategory };
  const [formData, setFormData] = useState<Partial<FormData>>({
    name: "",
    category: "Frontend",
    proficiency: 50,
  });
  const [customCategory, setCustomCategory] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [draggingSkillId, setDraggingSkillId] = useState<string | null>(null);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

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
      setIsDeleteDialogOpen(false);
      setSkillToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (payload: { skills: { id: string; category: string; order: number }[] }) => {
      return await apiRequest("POST", "/api/skills/reorder", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update skill order",
        description: error.message,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
  });

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      const isCustomCategory = !categories.includes(skill.category as SkillCategory);
      setFormData({
        name: skill.name,
        category: isCustomCategory 
          ? "Other" 
          : (categories.includes(skill.category as SkillCategory) 
              ? skill.category as SkillCategory 
              : "Other"),
        proficiency: skill.proficiency,
      });
      setCustomCategory(isCustomCategory ? skill.category : "");
      setCategoryIcon("");
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "Frontend",
        proficiency: 50,
      });
      setCustomCategory("");
      setCategoryIcon("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null);
    setCustomCategory("");
    setCategoryIcon("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      category: formData.category === "Other" ? customCategory : formData.category,
    } as InsertSkill;
    if (editingSkill) {
      updateMutation.mutate({
        id: editingSkill.id,
        data: finalData as InsertSkill,
      });
    } else {
      createMutation.mutate(finalData as InsertSkill);
    }
  };

  const handleOpenDeleteDialog = (skill: Skill) => {
    setSkillToDelete(skill);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSkillToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!skillToDelete) {
      return;
    }
    deleteMutation.mutate(skillToDelete.id);
  };

  const persistReorder = useCallback((updated: Skill[]) => {
    reorderMutation.mutate({
      skills: updated.map((skill, index) => ({
        id: skill.id,
        category: skill.category,
        order: index,
      })),
    });
  }, [reorderMutation]);

  const reorderSkillsInState = (skillId: string, targetCategory: string, targetSkillId?: string) => {
    let nextState: Skill[] | null = null;
    setLocalSkills((prev) => {
      const draggedSkill = prev.find((skill) => skill.id === skillId);
      if (!draggedSkill) {
        return prev;
      }
      const updatedSkill = { ...draggedSkill, category: targetCategory };
      const withoutDragged = prev.filter((skill) => skill.id !== skillId);
      const categoryOrder = Array.from(new Set([...categories, ...withoutDragged.map((skill) => skill.category), targetCategory]));
      const map = new Map<string, Skill[]>();
      withoutDragged.forEach((skill) => {
        const list = map.get(skill.category) ?? [];
        list.push(skill);
        map.set(skill.category, list);
      });
      const targetList = map.get(targetCategory) ?? [];
      let inserted = false;
      if (targetSkillId) {
        const index = targetList.findIndex((skill) => skill.id === targetSkillId);
        if (index !== -1) {
          targetList.splice(index, 0, updatedSkill);
          inserted = true;
        }
      }
      if (!inserted) {
        targetList.push(updatedSkill);
      }
      map.set(targetCategory, targetList);
      const merged: Skill[] = [];
      categoryOrder.forEach((category) => {
        const list = map.get(category);
        if (list && list.length) {
          merged.push(...list);
        }
      });
      map.forEach((list, category) => {
        if (!categoryOrder.includes(category) && list.length) {
          merged.push(...list);
        }
      });
      const changed =
        merged.length !== prev.length ||
        merged.some((skill, index) => {
          const prevSkill = prev[index];
          if (!prevSkill) {
            return true;
          }
          if (skill.id !== prevSkill.id) {
            return true;
          }
          if (skill.category !== prevSkill.category) {
            return true;
          }
          return false;
        });
      if (!changed) {
        return prev;
      }
      const mergedWithOrder = merged.map((skill, index) => ({
        ...skill,
        order: index,
      }));
      nextState = mergedWithOrder;
      return mergedWithOrder;
    });
    if (nextState) {
      persistReorder(nextState);
    }
  };

  const displayCategories = useMemo(() => {
    const unique = new Set<string>(categories);
    localSkills.forEach((skill) => unique.add(skill.category));
    return Array.from(unique);
  }, [localSkills]);

  const groupedSkills = useMemo(() => {
    return localSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [localSkills]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative flex items-center justify-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Manage Skills
            </h1>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
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
            {displayCategories.map((category) => {
              const categorySkills = groupedSkills[category] || [];

              return (
                <div key={category}>
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    {category}
                    <Badge variant="secondary">{categorySkills.length}</Badge>
                  </h2>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[140px]"
                    onDragOver={(e) => {
                      if (!draggingSkillId) {
                        return;
                      }
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!draggingSkillId) {
                        return;
                      }
                      reorderSkillsInState(draggingSkillId, category);
                    }}
                  >
                    <AnimatePresence>
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          draggable
                          onDragStart={() => {
                            setDraggingSkillId(skill.id);
                          }}
                          onDragEnd={() => {
                            setDraggingSkillId(null);
                          }}
                          onDragOver={(e) => {
                            if (!draggingSkillId) {
                              return;
                            }
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!draggingSkillId || draggingSkillId === skill.id) {
                              return;
                            }
                            reorderSkillsInState(draggingSkillId, skill.category, skill.id);
                          }}
                        >
                          <Card
                            className={`p-4 glass border-border/50 hover-elevate transition-all cursor-grab active:cursor-grabbing ${draggingSkillId === skill.id ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (draggingSkillId) {
                                return;
                              }
                              handleOpenDialog(skill);
                            }}
                          >
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDialog(skill);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDeleteDialog(skill);
                                  }}
                                  className="text-destructive hover:text-destructive"
                                  disabled={deleteMutation.isPending}
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
                    {categorySkills.length === 0 && (
                      <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-sm text-muted-foreground py-8 hover:border-border">
                        Drag skills here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDeleteDialog();
          }
        }}
      >
        <AlertDialogContent className="glass border border-destructive/20 max-w-xl shadow-xl">
          <AlertDialogHeader className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-display text-2xl">
              Delete this skill?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove
              {" "}
              <span className="font-semibold text-foreground">
                {skillToDelete?.name ?? "this skill"}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto border-border/60"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Skill"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
              <Card className="p-3 glass border-border/50">
                <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  Basic Details
                </h2>
                <div className="space-y-3">
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
                </div>
              </Card>

              <Card className="p-3 glass border-border/50">
                <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2" />
                  Category
                </h2>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category || "Frontend"}
                      onValueChange={(value: SkillCategory) => {
                        setFormData({ ...formData, category: value });
                        if (value !== "Other") {
                          setCustomCategory("");
                        }
                      }}
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

                  {formData.category === "Other" && (
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label htmlFor="customCategory">Custom Category *</Label>
                        <Input
                          id="customCategory"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryIcon">Category Icon *</Label>
                        <Input
                          id="categoryIcon"
                          value={categoryIcon}
                          onChange={(e) => setCategoryIcon(e.target.value)}
                          placeholder="Icon URL or emoji (e.g., https://... or 🎨)"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-3 glass border-border/50">
                <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-3" />
                  Proficiency
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="proficiency" className="font-medium">
                      Proficiency Level
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {formData.proficiency}%
                    </span>
                  </div>
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
              </Card>
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
