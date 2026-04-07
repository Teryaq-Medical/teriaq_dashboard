import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconPlus, IconTrash } from "@tabler/icons-react";

interface ScheduleTabProps {
  assignments: any[];
  isOwner: boolean;
  onAddSchedule: () => void;
  onRemoveSchedule: (id: string) => void;
}

export default function ScheduleTab({
  assignments,
  isOwner,
  onAddSchedule,
  onRemoveSchedule,
}: ScheduleTabProps) {
  // Flatten schedules from all assignments
  const allSchedules = assignments.flatMap((a: any) => a.schedules || []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isOwner && (
          <Button onClick={onAddSchedule} size="sm" className="rounded-full bg-[#00B0D0] text-white">
            <IconPlus size={16} className="mr-1" /> Add Schedule
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allSchedules.map((s: any) => (
          <Card
            key={s.id}
            className="p-6 rounded-[2rem] border-none shadow-sm bg-white flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-cyan-50 text-[#00B0D0] rounded-2xl flex items-center justify-center group-hover:bg-[#00B0D0] group-hover:text-white transition-colors">
                <IconCalendar size={22} />
              </div>
              <div>
                <p className="font-black text-slate-900 text-lg uppercase">{s.day}</p>
                <p className="text-sm text-slate-500 font-bold">
                  {s.start_time} — {s.end_time}
                </p>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => onRemoveSchedule(s.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <IconTrash size={18} />
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}