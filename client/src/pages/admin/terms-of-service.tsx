import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/header";

import { AdminLayout } from "@/components/admin/admin-layout";

export default function TermsOfService() {
  const { toast } = useToast();

  // Fetch terms of service
  const { data: termsOfService, isLoading } = useQuery<{ content: string }>({
    queryKey: ["/api/legal/terms_of_service"],
  });

  const updateMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/legal/terms_of_service", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update terms of service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal/terms_of_service"] });
      toast({
        title: "Terms of Service Updated",
        description: "The terms of service has been successfully updated.",
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
        title="Terms of Service"
        description="Update your website's terms of service. This will be visible in the public footer."
      />

      <div className="grid gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <RichTextEditor
              value={termsOfService?.content || ""}
              onChange={(content) => handleSave(content)}
              placeholder="Enter your terms of service content here..."
              className="w-full"
            />

            <Button
              onClick={() => handleSave(termsOfService?.content || "")}
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