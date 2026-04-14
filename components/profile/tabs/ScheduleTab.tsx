import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconPlus,
  IconTrash,
  IconBuildingHospital,
  IconUser,
  IconBuildingStore,
} from "@tabler/icons-react";

interface ScheduleTabProps {
  assignments?: any;
  isOwner: boolean;
  onAddSchedule: () => void;
  onRemoveSchedule: (scheduleId: string) => void;
}

export default function ScheduleTab({
  assignments,
  isOwner,
  onAddSchedule,
  onRemoveSchedule,
}: ScheduleTabProps) {
  const dataArray = React.useMemo(() => {
    if (!assignments) return [];
    if (Array.isArray(assignments)) return assignments;
    if (assignments.data && Array.isArray(assignments.data)) return assignments.data;
    return [];
  }, [assignments]);

  const formatDay = (day: string) => {
    const days: Record<string, string> = {
      mon: "Monday", tue: "Tuesday", wed: "Wednesday",
      thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
    };
    return days[day] || day;
  };

  const groupedData = {
    doctor: dataArray.filter((a: any) => a.entity_type === "doctor"),
    hospital: dataArray.filter((a: any) => a.entity_type === "hospital"),
    clinic: dataArray.filter((a: any) => a.entity_type === "clinic"),
  };

  const ScheduleList = ({ assignmentsList }: { assignmentsList: any[] }) => (
    <div className="space-y-8">
      {assignmentsList.length > 0 ? (
        assignmentsList.map((assignment) => (
          <div key={assignment.id} className="space-y-4">
            {assignment.entity_type !== "doctor" && (
              <div className="flex items-center gap-2 px-1">
                <div className="h-4 w-1 bg-[#00B0D0] rounded-full" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {assignment.doctor?.full_name ||
                   assignment.unregistered_doctor?.full_name ||
                   "Assigned Location"}
                </h4>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignment.schedules?.map((schedule: any) => (
                <Card
                  key={schedule.id}
                  className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-white flex items-center justify-between group transition-all hover:border-cyan-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-cyan-50 text-[#00B0D0] rounded-2xl flex items-center justify-center group-hover:bg-[#00B0D0] group-hover:text-white transition-colors">
                      <IconCalendar size={22} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase leading-tight">
                        {formatDay(schedule.day)}
                      </p>
                      <p className="text-sm text-slate-500 font-bold">
                        {schedule.start_time.slice(0, 5)} — {schedule.end_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => onRemoveSchedule(schedule.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <IconTrash size={18} />
                    </button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <IconCalendar className="mx-auto text-slate-300 size-10 mb-3 opacity-50" />
          <p className="text-slate-400 text-sm font-medium">No schedules found in this category.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Working Hours</h2>
          <p className="text-sm text-slate-500">View your shifts and availability.</p>
        </div>
        {isOwner && (
          <Button onClick={onAddSchedule} size="sm" className="rounded-full bg-[#00B0D0] hover:bg-[#009bb8] text-white px-4">
            <IconPlus size={18} className="mr-1" /> Add
          </Button>
        )}
      </div>

      <Tabs defaultValue="doctor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1.5 rounded-2xl mb-8">
          <TabsTrigger value="doctor" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm flex gap-2 py-2.5">
            <IconUser size={18} /> 
            <span className="font-bold text-xs sm:text-sm">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="hospital" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm flex gap-2 py-2.5">
            <IconBuildingHospital size={18} /> 
            <span className="font-bold text-xs sm:text-sm">Hospitals</span>
          </TabsTrigger>
          <TabsTrigger value="clinic" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm flex gap-2 py-2.5">
            <IconBuildingStore size={18} /> 
            <span className="font-bold text-xs sm:text-sm">Clinics</span>
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[200px]">
          <TabsContent value="doctor" className="mt-0 outline-none">
            <ScheduleList assignmentsList={groupedData.doctor} />
          </TabsContent>
          <TabsContent value="hospital" className="mt-0 outline-none">
            <ScheduleList assignmentsList={groupedData.hospital} />
          </TabsContent>
          <TabsContent value="clinic" className="mt-0 outline-none">
            <ScheduleList assignmentsList={groupedData.clinic} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}