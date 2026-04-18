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

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: { day: string; start_time: string; end_time: string; date?: string };
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
  const [loading, setLoading] = useState(false);
  const daysOfWeek = [
    { value: "mon", label: "Monday" }, { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" }, { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" }, { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ];

  const handleSubmit = async () => {
    if (!schedule.day) {
      toast.error("Please select a day");
      return;
    }
    if (!schedule.start_time || !schedule.end_time) {
      toast.error("Please enter start and end times");
      return;
    }

    setLoading(true);
    try {
      const scheduleData = { ...schedule, date: schedule.date || new Date().toISOString().split('T')[0] };
      await onSave(scheduleData);
      toast.success("Schedule added successfully");
      setSchedule({ day: "", start_time: "", end_time: "", date: "" });
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 rounded-[2rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Add Schedule Slot</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase ml-1">Day of Week *</Label>
            <select
              value={schedule.day}
              onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#00B0D0] h-12 text-black dark:text-white"
            >
              <option value="" className="dark:bg-slate-800">Select day</option>
              {daysOfWeek.map((day) => <option key={day.value} value={day.value} className="dark:bg-slate-800">{day.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase ml-1">Start Time *</Label>
              <Input 
                type="time" 
                value={schedule.start_time} 
                onChange={(e) => setSchedule({ ...schedule, start_time: e.target.value })} 
                className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 h-12 border-slate-200 dark:border-slate-700 dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase ml-1">End Time *</Label>
              <Input 
                type="time" 
                value={schedule.end_time} 
                onChange={(e) => setSchedule({ ...schedule, end_time: e.target.value })} 
                className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 h-12 border-slate-200 dark:border-slate-700 dark:text-white" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase ml-1">Specific Date (Optional)</Label>
            <Input 
              type="date" 
              value={schedule.date || ""} 
              onChange={(e) => setSchedule({ ...schedule, date: e.target.value })} 
              className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 h-12 border-slate-200 dark:border-slate-700 dark:text-white" 
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !schedule.day} 
            className="w-full bg-[#00B0D0] hover:bg-[#0096b0] h-14 rounded-2xl font-bold shadow-lg shadow-cyan-100 dark:shadow-cyan-950/50 text-white"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Schedule Slot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}