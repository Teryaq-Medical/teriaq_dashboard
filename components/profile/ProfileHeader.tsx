// components/profile/ProfileHeader.tsx

import React from "react";
import { Link } from "@/src/i18n/navigation";
import { IconArrowLeft, IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
interface ProfileHeaderProps {
  entityType?: string;
  isOwner: boolean;
  onEditBasicInfo: () => void;
  onLogout: () => void;
}

export default function ProfileHeader({
  isOwner,
  onEditBasicInfo,
  onLogout,
}: ProfileHeaderProps) {
  const t = useTranslations("profileHeader");

  return (
    <header className="flex items-center justify-between flex-wrap gap-4">
      {/* Left section: Logo + brand name */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Image
            src="/teriaq.svg"
            height={50}
            width={50}
            alt="teriaq management"
            className="cursor-pointer"
          />
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {t("brand")}
        </p>
      </div>

      {/* Right section: Buttons + Theme Toggle */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher/>
        <ModeToggle />
        {isOwner && (
          <Button
            onClick={onEditBasicInfo}
            className="rounded-full px-5 bg-[#00B0D0] hover:bg-[#21b3d5] border-none shadow-lg shadow-cyan-500/20 text-white font-bold"
          >
            {t("editDetails")}
          </Button>
        )}
        <Button
          onClick={onLogout}
          variant="outline"
          className="rounded-full px-5 bg-amber-600 border-slate-200 hover:border-red-300 hover:bg-red-50 text-white hover:text-red-600"
        >
          <IconLogout size={18} className="mr-2" />
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}