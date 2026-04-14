"use client";

import Image from "next/image";
import { useUser } from "@/components/context/UserContext";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { IconDashboard, IconFolder, IconUsers, IconListDetails, IconUserPlus } from "@tabler/icons-react";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  if (!user) return null;

  let navItems = [];

  // Admin / superuser sees everything
  if (user.is_superuser || user.user_type === "admin") {
    navItems = [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "All Clinics", url: "/entities/clincs", icon: IconFolder },
      { title: "All Hospitals", url: "/entities/hospitals", icon: IconFolder },
      { title: "All Labs", url: "/entities/labs", icon: IconFolder },        // ✅ Added
      { title: "All Doctors", url: "/entities/doctors", icon: IconUsers },
      { title: "Unregistered Doctors", url: "/entities/un-doctors", icon: IconUserPlus },
      { title: "Lifecycle", url: "/lifecycle", icon: IconListDetails },
    ];
  } else if (user.user_type === "hospitals" || user.user_type === "clincs") {
    navItems = [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "My Bookings", url: "/bookings", icon: IconListDetails },
      { title: "Add Specialists", url: "/specialists/add", icon: IconUsers },
      { title: "Add Doctors", url: "/doctors/add", icon: IconUsers },
    ];
  } else if (user.user_type === "doctors") {
    navItems = [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "My Schedule", url: "/schedule", icon: IconListDetails },
    ];
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <a href="#" className="flex justify-center items-center">
          <Image src="/teriaq.svg" alt="teriaq" width={60} height={60} />
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.full_name,
            email: user.email,
            avatar: user.avatar || "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}