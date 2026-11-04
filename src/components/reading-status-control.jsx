"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { removeFromReadingList, setReadingStatus } from "@/actions/reading-list";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { READING_STATUSES, statusMeta } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

// viewer: "reader" (can edit), "guest" (prompt to log in) or "admin" (nothing shown).
export function ReadingStatusControl({ bookId, status, viewer, size = "sm", className }) {
  const [current, setCurrent] = useOptimistic(status ?? null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState(null);

  if (viewer === "admin") return null;
  if (viewer === "guest") {
    return (
      <Link href="/login" className={cn(buttonVariants({ variant: "outline", size }), "w-full", className)}>
        <Plus />
        Add to list
      </Link>
    );
  }

  function change(next) {
    setError(null);
    startTransition(async () => {
      setCurrent(next);
      const result = next ? await setReadingStatus(bookId, next) : await removeFromReadingList(bookId);
      if (result?.error) setError(result.error);
    });
  }

  const meta = statusMeta(current);
  const Icon = meta?.icon ?? Plus;
  return (
    <div className={cn("grid gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant={meta ? "secondary" : "outline"}
              size={size}
              className="w-full justify-between"
              aria-label={meta ? `Reading status: ${meta.label}. Change` : "Add to reading list"}
            />
          }
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <Icon />
            <span className="truncate">{meta?.label ?? "Add to list"}</span>
          </span>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          {READING_STATUSES.map(({ value, label, icon: StatusIcon }) => (
            <DropdownMenuItem key={value} onClick={() => change(value)}>
              <StatusIcon />
              <span className="flex-1">{label}</span>
              {current === value && <Check />}
            </DropdownMenuItem>
          ))}
          {current && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => change(null)}>
                <Trash2 />
                Remove from list
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
