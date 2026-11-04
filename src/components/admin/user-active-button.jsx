"use client";

import { useState, useTransition } from "react";
import { Ban, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { setUserActive } from "@/actions/users";

export function UserActiveButton({ id, isActive, name }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      await setUserActive(id, !isActive);
      setOpen(false);
    });
  }

  if (!isActive) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={run} disabled={pending}>
        <RotateCcw />
        {pending ? "Reactivating..." : "Reactivate"}
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="destructive" size="sm">
            <Ban />
            Deactivate
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans font-semibold">Deactivate &quot;{name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            They will be signed out and won&apos;t be able to log in until you reactivate them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={run} disabled={pending}>
            {pending ? "Deactivating..." : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
