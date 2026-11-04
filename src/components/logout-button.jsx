"use client";

import { LogOut } from "lucide-react";
import { readerLogout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

// Full page load after logout so no client state (form messages, cached pages) survives the session.
export function LogoutButton() {
  async function logout() {
    await readerLogout();
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional hard reload
    window.location.href = "/";
  }
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="sm" aria-label="Log out" title="Log out">
        <LogOut />
        <span className="hidden sm:inline">Log out</span>
      </Button>
    </form>
  );
}
