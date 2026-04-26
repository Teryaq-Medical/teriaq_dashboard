import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditAboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAbout: string;
  onSave: (about: string) => Promise<void>;
}

export default function EditAboutModal({
  open,
  onOpenChange,
  initialAbout,
  onSave,
}: EditAboutModalProps) {
  const t = useTranslations("modals.about");
  const [about, setAbout] = useState(initialAbout);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(about);
      toast.success(t("success.updated"));
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <Textarea
            placeholder={t("placeholder")}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={8}
            className="rounded-3xl border-slate-200 dark:border-slate-700 focus:ring-[#00B0D0] bg-slate-50/50 dark:bg-slate-800/50 p-6 text-slate-700 dark:text-slate-300 leading-relaxed resize-none shadow-inner placeholder:text-slate-950 dark:placeholder:text-slate-500"
          />
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] h-14 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-100 dark:shadow-cyan-950/50 text-white"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : t("saveButton")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}