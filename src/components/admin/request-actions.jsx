"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Check, Copy, Plus, RotateCcw, X } from "lucide-react";
import { deleteRequest, setRequestStatus } from "@/actions/book-requests";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button, buttonVariants } from "@/components/ui/button";

function Action({ icon: Icon, label, variant = "outline", onClick, disabled }) {
  return (
    <Button type="button" variant={variant} size="sm" onClick={onClick} disabled={disabled} aria-label={label} title={label}>
      <Icon />
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );
}

export function RequestActions({ request }) {
  const [pending, startTransition] = useTransition();
  const set = (status, reason) => startTransition(async () => { await setRequestStatus(request._id, status, reason); });
  const addHref = `/admin/books/new?${new URLSearchParams({ title: request.title, author: request.author, genre: request.genre })}`;

  return (
    <div className="flex justify-end gap-2">
      {request.status === "pending" ? (
        <>
          <Link href={addHref} className={buttonVariants({ size: "sm" })} aria-label="Add this book" title="Add this book">
            <Plus />
            <span className="hidden lg:inline">Add book</span>
          </Link>
          <Action icon={Check} label="Mark added" onClick={() => set("added")} disabled={pending} />
          <Action icon={Copy} label="Duplicate" onClick={() => set("declined", "duplicate")} disabled={pending} />
          <Action icon={X} label="Decline" onClick={() => set("declined", "other")} disabled={pending} />
        </>
      ) : (
        <Action icon={RotateCcw} label="Reopen" onClick={() => set("pending")} disabled={pending} />
      )}
      <DeleteButton action={deleteRequest.bind(null, request._id)} name={request.title} />
    </div>
  );
}
