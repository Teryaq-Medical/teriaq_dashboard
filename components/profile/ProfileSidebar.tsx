import React from "react";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconStarFilled,
  IconEdit,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ProfileSidebarProps {
  data: any;
  isDoctor: boolean;
  displayName: string;
  rating: number;
  profileImg: string;
  isOwner: boolean;
  onEditBasicInfo: () => void;
  onEditAbout: () => void;
}

export default function ProfileSidebar({
  data,
  isDoctor,
  displayName,
  rating,
  profileImg,
  isOwner,
  onEditBasicInfo,
  onEditAbout,
}: ProfileSidebarProps) {
  const t = useTranslations("profileSidebar");
  const safeData = data || {};

  return (
    <div className="space-y-6">
      {/* Image block */}
      <div className="relative">
        <div className="aspect-[4/3] rounded-[2.5rem] bg-white dark:bg-slate-800 p-3 shadow-xl border dark:border-slate-700 overflow-hidden">
          <div className="w-full h-full rounded-[2rem] bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <img
              src={profileImg}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = isDoctor
                  ? "/placeholders/default-doctor.png"
                  : "/placeholders/default-hospital.png";
              }}
            />
          </div>
        </div>
        <Badge
          className={`absolute -bottom-3 left-10 border-4 border-[#FAF9F6] dark:border-slate-900 py-1 px-4 rounded-full shadow-lg ${
            safeData.is_active || safeData.is_verified
              ? "bg-green-500"
              : "bg-orange-500"
          } text-white`}
        >
          {safeData.is_active || safeData.is_verified
            ? t("verified")
            : t("pending")}
        </Badge>
      </div>

      {/* Name and bio block */}
      <div className="px-4 space-y-3">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {displayName}
          </h1>
          {isOwner && (
            <button
              onClick={onEditBasicInfo}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500"
            >
              <IconEdit size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <IconStarFilled size={16} className="text-amber-400" />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {rating} {t("rating")}
          </span>
        </div>
        <div className="relative">
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            {safeData.about?.bio ||
              safeData.description ||
              t("noBio")}
          </p>
          {isOwner && (
            <button
              onClick={onEditAbout}
              className="absolute -top-2 -right-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500"
            >
              <IconEdit size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Contact card block */}
      <div className="p-1 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border dark:border-slate-700">
        <div className="p-5 space-y-4">
          <ContactItem
            icon={<IconMapPin size={18} />}
            label={t("location")}
            value={safeData.address}
            editable={isOwner}
            onEdit={onEditBasicInfo}
            t={t}
          />
          <ContactItem
            icon={<IconPhone size={18} />}
            label={t("phone")}
            value={safeData.phone || safeData.phone_number}
            editable={isOwner}
            onEdit={onEditBasicInfo}
            t={t}
          />
          <ContactItem
            icon={<IconMail size={18} />}
            label={t("email")}
            value={safeData.email}
            editable={isOwner}
            onEdit={onEditBasicInfo}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

// Updated ContactItem with i18n support
function ContactItem({
  icon,
  label,
  value,
  editable,
  onEdit,
  t,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  editable: boolean;
  onEdit: () => void;
  t: any;
}) {
  return (
    <div className="flex items-center gap-4 group relative">
      <div className="size-10 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-[#00B0D0] group-hover:bg-[#00B0D0] group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {value || t("notAvailable")}
        </p>
      </div>
      {editable && (
        <button
          onClick={onEdit}
          className="absolute right-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <IconEdit size={14} />
        </button>
      )}
    </div>
  );
}