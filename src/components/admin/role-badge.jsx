import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role }) {
  return (
    <Badge variant={role === "admin" ? "default" : "secondary"} className="capitalize">
      {role}
    </Badge>
  );
}
