import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = {
  success: { Icon: CircleCheck, role: "status", className: "border-success/30 bg-success/10 text-success" },
  error: { Icon: CircleAlert, role: "alert", className: "border-destructive/30 bg-destructive/10 text-destructive" },
};

// Status banner for form feedback. Colour is never the only cue: each type has its own icon.
export function FormMessage({ type = "error", children }) {
  const { Icon, role, className } = styles[type];
  return (
    <p role={role} className={cn("flex items-start gap-2 rounded-lg border px-3 py-2 text-sm", className)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
