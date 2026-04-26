"use client";

import Image from "next/image";
import { useUser } from "@/components/context/UserContext";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconFolder,
  IconUsers,
  IconListDetails,
  IconUserPlus,
} from "@tabler/icons-react";
import type React from "react";
import { useTranslations, useLocale } from "next-intl";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const t = useTranslations("sidebar");
  const locale = useLocale();                // "en" or "ar"

  if (!user) return null;

  let navItems: NavItem[] = [];

  // Admin / superuser sees everything
  if (user.is_superuser || user.user_type === "admin") {
    navItems = [
      { title: t("dashboard"),      url: "/dashboard",          icon: IconDashboard },
      { title: t("allClinics"),     url: "/entities/clincs",    icon: IconFolder },
      { title: t("allHospitals"),   url: "/entities/hospitals", icon: IconFolder },
      { title: t("allLabs"),       url: "/entities/labs",      icon: IconFolder },
      { title: t("allDoctors"),    url: "/entities/doctors",   icon: IconUsers },
      { title: t("unregisteredDoctors"), url: "/entities/un-doctors", icon: IconUserPlus },
      { title: t("lifecycle"),     url: "/lifecycle",          icon: IconListDetails },
    ];
  } else if (user.user_type === "hospitals" || user.user_type === "clincs") {
    navItems = [
      { title: t("dashboard"),     url: "/dashboard",       icon: IconDashboard },
      { title: t("myBookings"),    url: "/bookings",        icon: IconListDetails },
      { title: t("addSpecialists"), url: "/specialists/add", icon: IconUsers },
      { title: t("addDoctors"),    url: "/doctors/add",     icon: IconUsers },
    ];
  } else if (user.user_type === "doctors") {
    navItems = [
      { title: t("dashboard"),   url: "/dashboard", icon: IconDashboard },
      { title: t("mySchedule"),  url: "/schedule",  icon: IconListDetails },
    ];
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      side={locale === "ar" ? "right" : "left"}   // ⬅️ dynamic RTL
      {...props}
    >
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
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}