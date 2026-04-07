import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: { day: string; start_time: string; end_time: string };
  setSchedule: (schedule: any) => void;
  onSave: (schedule: any) => Promise<void>;
}

export default function AddScheduleModal({
  open,
  onOpenChange,
  schedule,
  setSchedule,
  onSave,
}: AddScheduleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Schedule Slot</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Day (e.g., Monday)"
          value={schedule.day}
          onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
        />
        <Input
          placeholder="Start time (e.g., 09:00)"
          value={schedule.start_time}
          onChange={(e) => setSchedule({ ...schedule, start_time: e.target.value })}
        />
        <Input
          placeholder="End time (e.g., 17:00)"
          value={schedule.end_time}
          onChange={(e) => setSchedule({ ...schedule, end_time: e.target.value })}
        />
        <Button
          onClick={async () => {
            await onSave(schedule);
            setSchedule({ day: "", start_time: "", end_time: "" });
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