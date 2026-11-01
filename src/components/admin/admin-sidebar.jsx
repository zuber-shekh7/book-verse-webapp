"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, Tag, Users } from "lucide-react";
import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const items = [
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/genres", label: "Genres", icon: Tag },
];

export function AdminSidebar({ email }) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin/books"
          className="px-2 py-1 font-heading text-lg font-semibold group-data-[collapsible=icon]:hidden"
        >
          BookVerse
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(href)}
                    tooltip={label}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {email}
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <ThemeToggle />
          <form action={logout} className="flex-1 group-data-[collapsible=icon]:flex-none">
            <SidebarMenuButton type="submit" tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </form>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
