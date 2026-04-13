import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">About / Biography</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <Textarea
            placeholder="Introduce yourself to patients..."
            defaultValue={initialAbout}
            rows={8}
            id="about"
            className="rounded-3xl border-slate-200 focus:ring-[#00B0D0] bg-slate-50/50 p-6 text-slate-700 leading-relaxed resize-none shadow-inner placeholder:text-slate-950 "
          />
          <Button
            onClick={async () => {
              const about = (document.getElementById("about") as HTMLTextAreaElement).value;
              await onSave(about);
              onOpenChange(false);
            }}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] h-14 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-100"
          >
            Update Biography
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}