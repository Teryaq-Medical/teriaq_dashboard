import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EditBasicInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  data: any;
  onSave: (updatedData: any) => Promise<void>;
}

export default function EditBasicInfoModal({
  open,
  onOpenChange,
  displayName,
  data,
  onSave,
}: EditBasicInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Basic Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-8">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Display Name</Label>
            <Input defaultValue={displayName} id="name" className="rounded-2xl border-slate-200 h-12 bg-slate-50/50 focus:ring-[#00B0D0]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Practice Location</Label>
            <Input defaultValue={data.address} id="address" className="rounded-2xl border-slate-200 h-12 bg-slate-50/50 focus:ring-[#00B0D0]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</Label>
              <Input defaultValue={data.phone || data.phone_number} id="phone" className="rounded-2xl border-slate-200 h-12 bg-slate-50/50 focus:ring-[#00B0D0]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</Label>
              <Input defaultValue={data.email} id="email" className="rounded-2xl border-slate-200 h-12 bg-slate-50/50 focus:ring-[#00B0D0]" />
            </div>
          </div>
          <Button
            onClick={async () => {
              const updated = {
                name: (document.getElementById("name") as HTMLInputElement).value,
                address: (document.getElementById("address") as HTMLInputElement).value,
                phone: (document.getElementById("phone") as HTMLInputElement).value,
                email: (document.getElementById("email") as HTMLInputElement).value,
              };
              await onSave(updated);
              onOpenChange(false);
            }}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] h-14 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-100 mt-4 transition-all"
          >
            Save Profile Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}