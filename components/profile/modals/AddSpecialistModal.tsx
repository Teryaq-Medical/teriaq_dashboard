import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddSpecialistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
}

export default function AddSpecialistModal({
  open,
  onOpenChange,
  onSave,
}: AddSpecialistModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Specialty name is required");
      return;
    }

    setLoading(true);
    try {
      await onSave(name.trim());
      toast.success("Specialty added successfully");
      setName("");
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add specialty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 rounded-[2rem] border-none shadow-2xl p-8 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white">
            Add Medical Specialty
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">
              Specialty Name
            </Label>
            <Input
              placeholder="e.g. Pediatric Cardiology"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-slate-200 dark:border-slate-700 focus:ring-[#00B0D0] bg-slate-50/50 dark:bg-slate-800/50 h-11 placeholder:text-slate-950 dark:placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] text-white rounded-xl py-6 font-bold transition-all shadow-lg shadow-cyan-100 dark:shadow-cyan-950/50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Add Specialty"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}