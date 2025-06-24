'use client';
import { usePathname } from 'next/navigation';
import Image from "next/image"
import Link from 'next/link';
import React from 'react';

import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LayoutDashboard, Navigation } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
} from "@/components/ui/collapsible";

// Menu Items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    collapsible: false,
    icon: LayoutDashboard,
  },
  {
    title: "Builder",
    url: "/builder",
    collapsible: false,
    icon: Navigation,
  }
]


export function AppSidebar() {

  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">


      <SidebarHeader>

        {/* Brand Logo Start*/}
        <SidebarMenu>
          <SidebarMenuItem>

            <SidebarMenuButton size="lg"  className="hover:bg-transparent h-auto" asChild>
              <a href="#">

                {/* Logo Icon */}
                {
                  state === "collapsed" ? (
                    <div className="relative flex size-8 shrink-0 overflow-hidden h-8 w-8 rounded-lg">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={"/logo.png"} alt="Website Builder" />
                        <AvatarFallback className="rounded-lg">WB</AvatarFallback>
                      </Avatar>
                    </div>
                  ) : ""
                }

                {/* App Name as Brand Image */}
                <div className="w-full py-2 px-4 overflow-hidden">
                  <Image
                    src={"/brand.png"}
                    alt="Website Builder"
                    width={100}
                    height={36}
                    quality={100}
                    unoptimized
                    className="w-full"
                  />
                </div>

              </a>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
        {/* Brand Logo End*/}

      </SidebarHeader>


      <SidebarContent>

        {/* Services Menu Start*/}
        <SidebarGroup>

          <SidebarGroupLabel>
            <span className="uppercase font-bold text-[var(--sidebar-foreground)]/50 text-xs tracking-wide">
              Services
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {items.map((item) => {

                const Btn = (
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="text-[var(--sidebar-primary)]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )

                const Content = (
                  <SidebarMenuItem key={item.title}>
                    {Btn}
                  </SidebarMenuItem>
                );

                return item.collapsible ? (
                  <Collapsible className="group/collapsible" key={item.title}>
                    {Content}
                  </Collapsible>
                ) : (
                  <React.Fragment key={item.title}>
                    {Content}
                  </React.Fragment>
                );

              })}

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
        {/* Services Menu End*/}


      </SidebarContent>

    </Sidebar>
  )
}