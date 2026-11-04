import { Badge } from "@/components/ui/badge";

// Active content is visible to readers; Draft is admin-only.
export function StatusBadge({ isActive }) {
  return isActive ? (
    <Badge variant="outline" className="border-success/40 text-success">Active</Badge>
  ) : (
    <Badge variant="secondary">Draft</Badge>
  );
}
