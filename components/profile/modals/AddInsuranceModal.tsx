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

interface AddInsuranceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurance: { entity: string; status: string };
  setInsurance: (insurance: any) => void;
  onSave: (insurance: any) => Promise<void>;
}

export default function AddInsuranceModal({
  open,
  onOpenChange,
  insurance,
  setInsurance,
  onSave,
}: AddInsuranceModalProps) {
  const [loading, setLoading] = useState(false);
  const statusOptions = [
    { value: "تغطية كاملة", label: "Full Coverage" },
    { value: "عادية", label: "Standard" },
    { value: "جزئية", label: "Partial" },
    { value: "منتهية", label: "Expired" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(insurance);
      setInsurance({ entity: "", status: "عادية" });
      onOpenChange(false);
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add Insurance Provider</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-600 ml-1">Provider Name</Label>
            <Input
              value={insurance.entity}
              onChange={(e) => setInsurance({ ...insurance, entity: e.target.value })}
              className="rounded-xl border-slate-200 h-12 bg-slate-50/50 placeholder:text-slate-950"
              placeholder="e.g. AXA Healthcare"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-slate-600 ml-1">Plan Status</Label>
            <select
              value={insurance.status}
              onChange={(e) => setInsurance({ ...insurance, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00B0D0]/20 outline-none h-12"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-[#00B0D0] hover:bg-[#0096b0] rounded-xl h-14 font-bold text-white shadow-xl shadow-cyan-100 transition-all">
            {loading ? "Saving..." : "Connect Provider"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}