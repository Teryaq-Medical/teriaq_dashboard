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
    if (!insurance.entity.trim()) {
      toast.error("Provider name is required");
      return;
    }

    setLoading(true);
    try {
      await onSave(insurance);
      toast.success("Insurance provider added successfully");
      setInsurance({ entity: "", status: "عادية" });
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add insurance provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white">
            Add Insurance Provider
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-600 dark:text-slate-300 ml-1">
              Provider Name
            </Label>
            <Input
              value={insurance.entity}
              onChange={(e) => setInsurance({ ...insurance, entity: e.target.value })}
              className="rounded-xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-slate-950 dark:placeholder:text-slate-400 dark:text-white"
              placeholder="e.g. AXA Healthcare"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-slate-600 dark:text-slate-300 ml-1">
              Plan Status
            </Label>
            <select
              value={insurance.status}
              onChange={(e) => setInsurance({ ...insurance, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#00B0D0]/20 outline-none h-12 text-black dark:text-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="dark:bg-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-[#00B0D0] hover:bg-[#0096b0] rounded-xl h-14 font-bold text-white shadow-xl shadow-cyan-100 dark:shadow-cyan-950/50 transition-all">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Connect Provider"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}