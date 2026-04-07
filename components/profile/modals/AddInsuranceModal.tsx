import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Insurance Provider</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Insurance Name"
          value={insurance.entity}
          onChange={(e) => setInsurance({ ...insurance, entity: e.target.value })}
        />
        <Button
          onClick={async () => {
            await onSave(insurance);
            setInsurance({ entity: "", status: "active" });
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