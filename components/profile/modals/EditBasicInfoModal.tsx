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
  const [imagePreview, setImagePreview] = useState<string>(data.image || data.profile_image || "");
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updated: any = {
      name: (document.getElementById("name") as HTMLInputElement).value,
      address: (document.getElementById("address") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
    };
    if (imageBase64) {
      updated.image = imageBase64;
      updated.profile_image = imageBase64;
    }
    await onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-none shadow-2xl p-10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Basic Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-8">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Profile Image</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-black dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Full Display Name</Label>
            <Input 
              defaultValue={displayName} 
              id="name" 
              className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-[#00B0D0] dark:text-white" 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Practice Location</Label>
            <Input 
              defaultValue={data.address} 
              id="address" 
              className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-[#00B0D0] dark:text-white" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Phone Number</Label>
              <Input 
                defaultValue={data.phone || data.phone_number} 
                id="phone" 
                className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-[#00B0D0] dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Email Address</Label>
              <Input 
                defaultValue={data.email} 
                id="email" 
                className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-[#00B0D0] dark:text-white" 
              />
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] h-14 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-100 dark:shadow-cyan-950/50 mt-4 transition-all text-white"
          >
            Save Profile Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}