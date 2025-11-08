import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Github, Linkedin, Twitter, Mail, FileText } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AboutInfo, InsertAboutInfo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminAbout() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InsertAboutInfo>>({
    name: "",
    title: "",
    bio: "",
    avatarUrl: "",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    resumeUrl: "",
  });

  const { data: aboutInfo, isLoading } = useQuery<AboutInfo>({
    queryKey: ["/api/about"],
  });

  useEffect(() => {
    if (aboutInfo) {
      setFormData({
        name: aboutInfo.name,
        title: aboutInfo.title,
        bio: aboutInfo.bio,
        avatarUrl: aboutInfo.avatarUrl || "",
        email: aboutInfo.email || "",
        phone: aboutInfo.phone || "",
        location: aboutInfo.location || "",
        githubUrl: aboutInfo.githubUrl || "",
        linkedinUrl: aboutInfo.linkedinUrl || "",
        twitterUrl: aboutInfo.twitterUrl || "",
        resumeUrl: aboutInfo.resumeUrl || "",
      });
    }
  }, [aboutInfo]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAboutInfo) => {
      return await apiRequest("PUT", "/api/about", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({ title: "About info updated successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update about info",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData as InsertAboutInfo);
  };

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
                Edit About Info
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-xl font-bold mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Company/Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title/Tagline *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Full Stack Developer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio/Description *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={6}
                      placeholder="Tell us about your company..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="avatarUrl">Avatar/Logo URL</Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, avatarUrl: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                    />
                    {formData.avatarUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="h-20 w-20 rounded-full object-cover border-2 border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-xl font-bold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="pl-10"
                          placeholder="contact@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-xl font-bold mb-4">
                  Social Media Links
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, githubUrl: e.target.value })
                        }
                        className="pl-10"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            linkedinUrl: e.target.value,
                          })
                        }
                        className="pl-10"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitterUrl"
                        type="url"
                        value={formData.twitterUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            twitterUrl: e.target.value,
                          })
                        }
                        className="pl-10"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resumeUrl">Resume/Portfolio PDF URL</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resumeUrl"
                        type="url"
                        value={formData.resumeUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, resumeUrl: e.target.value })
                        }
                        className="pl-10"
                        placeholder="https://example.com/resume.pdf"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
