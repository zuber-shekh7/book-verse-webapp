import { Badge } from "@/components/ui/badge";

// Active content is visible to readers; inactive is a Draft (catalog) or Deactivated (user).
export function StatusBadge({ isActive, inactiveLabel = "Draft" }) {
  return isActive ? (
    <Badge variant="outline" className="border-success/40 text-success">Active</Badge>
  ) : (
    <Badge variant="secondary">{inactiveLabel}</Badge>
  );
}
