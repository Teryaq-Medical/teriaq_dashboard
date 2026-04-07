import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Certificate Name"
          value={certificate.name}
          onChange={(e) => setCertificate({ ...certificate, name: e.target.value })}
        />
        <Input
          placeholder="Issuing Entity"
          value={certificate.entity}
          onChange={(e) => setCertificate({ ...certificate, entity: e.target.value })}
        />
        <Button
          onClick={async () => {
            await onSave(certificate);
            setCertificate({ name: "", entity: "" });
            onOpenChange(false);
          }}
          className="bg-[#00B0D0]"
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
}