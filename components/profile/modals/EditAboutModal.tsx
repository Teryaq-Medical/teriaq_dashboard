import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditAboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAbout: string;
  onSave: (about: string) => Promise<void>;
}

export default function EditAboutModal({
  open,
  onOpenChange,
  initialAbout,
  onSave,
}: EditAboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit About / Biography</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Write about the entity..."
          defaultValue={initialAbout}
          rows={6}
          id="about"
        />
        <Button
          onClick={async () => {
            const about = (document.getElementById("about") as HTMLTextAreaElement).value;
            await onSave(about);
            onOpenChange(false);
          }}
          className="bg-[#00B0D0]"
        >
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}