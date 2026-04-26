import React, { useState } from "react";
import { IconStethoscope, IconEdit } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DoctorSpecialistEditorProps {
  currentSpecialist: string;
  onUpdate: (specialistName: string) => Promise<void>;
  isOwner: boolean;
}

export default function DoctorSpecialistEditor({
  currentSpecialist,
  onUpdate,
  isOwner,
}: DoctorSpecialistEditorProps) {
  const t = useTranslations("components.doctorSpecialist");
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialist, setNewSpecialist] = useState(currentSpecialist);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!newSpecialist.trim()) {
      toast.error(t("errors.nameRequired"));
      return;
    }
    setLoading(true);
    try {
      await onUpdate(newSpecialist.trim());
      toast.success(t("success.updated"));
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const cardClasses = "p-6 rounded-[2.5rem] border-none bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300";

  if (!isOwner) {
    return (
      <Card className={cardClasses}>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-2xl text-[#00B0D0]">
            <IconStethoscope size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-0.5">
              {t("specializationLabel")}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {currentSpecialist || t("defaultText")}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card className={`${cardClasses} ring-2 ring-cyan-100 dark:ring-cyan-900`}>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">
            {t("editLabel")}
          </label>
          <Input
            value={newSpecialist}
            onChange={(e) => setNewSpecialist(e.target.value)}
            className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 text-lg focus:ring-[#00B0D0] bg-white dark:bg-slate-800 shadow-inner dark:text-white"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="rounded-full px-6 text-slate-500 dark:text-slate-400"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="rounded-full bg-[#00B0D0] hover:bg-[#0096b0] px-8 font-bold text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : t("save")}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${cardClasses} group cursor-default`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-2xl text-[#00B0D0] group-hover:scale-110 transition-transform">
            <IconStethoscope size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-0.5">
              {t("specializationLabel")}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {currentSpecialist || t("clickToAdd")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-3 rounded-full text-slate-400 dark:text-slate-500 hover:bg-[#00B0D0] hover:text-white transition-all opacity-0 group-hover:opacity-100 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-sm"
        >
          <IconEdit size={20} />
        </button>
      </div>
    </Card>
  );
}