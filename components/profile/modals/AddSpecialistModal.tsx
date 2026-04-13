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

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-8 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add Medical Specialty</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-600 ml-1">Specialty Name</Label>
            <Input
              placeholder="e.g. Pediatric Cardiology"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-slate-200 focus:ring-[#00B0D0] bg-slate-50/50 h-11 placeholder:text-slate-950"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] text-white rounded-xl py-6 font-bold transition-all shadow-lg shadow-cyan-100"
          >
            Add Specialty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}