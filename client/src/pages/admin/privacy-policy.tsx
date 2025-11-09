import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/header";

import { AdminLayout } from "@/components/admin/admin-layout";

export default function PrivacyPolicy() {
  const { toast } = useToast();

  // Fetch privacy policy
  const { data: privacyPolicy, isLoading } = useQuery<{ content: string }>({
    queryKey: ["/api/legal/privacy_policy"],
  });

  const updateMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/legal/privacy_policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update privacy policy");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal/privacy_policy"] });
      toast({
        title: "Privacy Policy Updated",
        description: "The privacy policy has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (content: string) => {
    await updateMutation.mutateAsync(content);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <AdminHeader
        title="Privacy Policy"
        description="Update your website's privacy policy. This will be visible in the public footer."
      />

      <div className="grid gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <RichTextEditor
              value={privacyPolicy?.content || ""}
              onChange={(content) => handleSave(content)}
              placeholder="Enter your privacy policy content here..."
              className="w-full"
            />

            <Button
              onClick={() => handleSave(privacyPolicy?.content || "")}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⌛</span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}