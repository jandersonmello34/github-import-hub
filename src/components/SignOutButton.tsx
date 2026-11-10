import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SignOutButton({ className, label = "Sair" }: { className?: string; label?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="ghost"
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await queryClient.cancelQueries();
          queryClient.clear();
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          await navigate({ to: "/auth", replace: true });
        } catch {
          toast.error("Não foi possível sair. Tente novamente.");
        } finally { setBusy(false); }
      }}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <LogOut className="size-4" aria-hidden="true" />
        {label}
      </span>
    </Button>
  );
}
