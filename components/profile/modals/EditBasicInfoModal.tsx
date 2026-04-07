import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Basic Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Name" defaultValue={displayName} id="name" />
          <Input placeholder="Location" defaultValue={data.address} id="address" />
          <Input
            placeholder="Phone"
            defaultValue={data.phone || data.phone_number}
            id="phone"
          />
          <Input placeholder="Email" defaultValue={data.email} id="email" />
          <Button
            onClick={async () => {
              const name = (document.getElementById("name") as HTMLInputElement).value;
              const address = (document.getElementById("address") as HTMLInputElement).value;
              const phone = (document.getElementById("phone") as HTMLInputElement).value;
              const email = (document.getElementById("email") as HTMLInputElement).value;
              await onSave({ name, address, phone, email });
              onOpenChange(false);
            }}
            className="bg-[#00B0D0]"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}