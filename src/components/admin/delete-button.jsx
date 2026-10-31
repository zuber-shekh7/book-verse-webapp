"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({ action, label = "Delete" }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item?")) e.preventDefault();
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        {label}
      </Button>
    </form>
  );
}
