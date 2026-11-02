"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Field({ label, name, children }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
    </div>
  );
}

export function FormShell({ action, submitLabel, pendingLabel = "Saving...", children }) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {children}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
