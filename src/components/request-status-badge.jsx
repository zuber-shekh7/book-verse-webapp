import { Badge } from "@/components/ui/badge";

// Pending is neutral, Added is the success color, Declined is destructive. A duplicate decline says so.
export function RequestStatusBadge({ status, declineReason }) {
  if (status === "added") return <Badge variant="outline" className="border-success/40 text-success">Added</Badge>;
  if (status === "declined") {
    return <Badge variant="destructive">{declineReason === "duplicate" ? "Declined: duplicate" : "Declined"}</Badge>;
  }
  return <Badge variant="secondary">Pending</Badge>;
}
