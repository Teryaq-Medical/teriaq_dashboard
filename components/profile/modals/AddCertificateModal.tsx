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

interface AddCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: { name: string; entity: string };
  setCertificate: (cert: any) => void;
  onSave: (cert: any) => Promise<void>;
}

export default function AddCertificateModal({
  open,
  onOpenChange,
  certificate,
  setCertificate,
  onSave,
}: AddCertificateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add Certificate</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-600 ml-1">Certificate Name</Label>
            <Input
              placeholder="e.g. Board Certified Surgeon"
              value={certificate.name}
              onChange={(e) => setCertificate({ ...certificate, name: e.target.value })}
              className="rounded-xl border-slate-200 focus:ring-[#00B0D0] bg-slate-50/50 h-11 placeholder:text-slate-950"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-600 ml-1">Issuing Entity</Label>
            <Input
              placeholder="e.g. Medical Board"
              value={certificate.entity}
              onChange={(e) => setCertificate({ ...certificate, entity: e.target.value })}
              className="rounded-xl border-slate-200 focus:ring-[#00B0D0] bg-slate-50/50 h-11 placeholder:text-slate-950"
            />
          </div>
          <Button
            onClick={async () => {
              await onSave(certificate);
              setCertificate({ name: "", entity: "" });
              onOpenChange(false);
            }}
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] text-white rounded-xl py-6 font-bold transition-all shadow-lg shadow-cyan-100 mt-2"
          >
            Add Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}