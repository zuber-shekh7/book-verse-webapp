"use client";

import { useActionState, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/form-message";
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
  const [result, formAction, pending] = useActionState(action, null);

  // Cache Components keeps hidden pages mounted, so a stale message would reappear when the
  // user comes back (e.g. after logging out and in). Dismiss the last result when the page is hidden.
  const latest = useRef(null);
  const [dismissed, setDismissed] = useState(null);
  useLayoutEffect(() => {
    latest.current = result;
  });
  useLayoutEffect(() => () => setDismissed(latest.current), []);
  const state = result && result !== dismissed ? result : null;

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {children}
      {state?.success && <FormMessage type="success">{state.success}</FormMessage>}
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
