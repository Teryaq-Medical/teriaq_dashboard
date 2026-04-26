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
  IconClock,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("schedule");

  const dataArray = React.useMemo(() => {
    if (!assignments) return [];
    if (Array.isArray(assignments)) return assignments;
    if (assignments.data && Array.isArray(assignments.data)) return assignments.data;
    return [];
  }, [assignments]);

  // Translated day names
  const dayMap: Record<string, string> = {
    mon: t("days.mon"),
    tue: t("days.tue"),
    wed: t("days.wed"),
    thu: t("days.thu"),
    fri: t("days.fri"),
    sat: t("days.sat"),
    sun: t("days.sun"),
  };

  const formatDay = (day: string) => dayMap[day] || day;

  const groupedData = {
    doctor: dataArray.filter((a: any) => a.entity_type === "doctor" || a.entity_type === "individual"),
    hospital: dataArray.filter((a: any) => a.entity_type === "hospital"),
    clinic: dataArray.filter((a: any) => a.entity_type === "clinic"),
  };

  const ScheduleList = ({ assignmentsList }: { assignmentsList: any[] }) => (
    <div className="space-y-6">
      {assignmentsList.length > 0 ? (
        assignmentsList.map((assignment) => (
          <div key={assignment.id} className="space-y-3">
            {assignment.entity_type !== "doctor" && assignment.entity_type !== "individual" && (
              <div className="flex items-center gap-3 px-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                <div className="h-6 w-1 bg-gradient-to-b from-[#00B0D0] to-cyan-400 rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/50 rounded-lg">
                    {assignment.entity_type === "hospital" ? (
                      <IconBuildingHospital size={14} className="text-[#00B0D0]" />
                    ) : (
                      <IconBuildingStore size={14} className="text-[#00B0D0]" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {assignment.doctor?.full_name ||
                     assignment.unregistered_doctor?.full_name ||
                     (assignment.entity_type === "hospital" ? t("hospitalAssignment") : t("clinicAssignment"))}
                  </h4>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignment.schedules?.map((schedule: any) => (
                <Card
                  key={schedule.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#00B0D0]/30"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00B0D0]/5 to-transparent rounded-bl-3xl pointer-events-none" />
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#00B0D0]/20 rounded-xl blur-sm pointer-events-none" />
                          <div className="relative size-12 bg-gradient-to-br from-[#00B0D0] to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                            <IconCalendar size={22} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-white text-base uppercase tracking-wide">
                            {formatDay(schedule.day)}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <IconClock size={12} className="text-slate-400 dark:text-slate-500" />
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {schedule.start_time.slice(0, 5)} — {schedule.end_time.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => onRemoveSchedule(schedule.id)}
                          className="relative z-10 p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-all duration-200"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <IconCalendar className="text-slate-300 dark:text-slate-500 size-8" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t("noSchedules")}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t("noSchedulesHint")}</p>
        </div>
      )}
    </div>
  );

  const hasAnySchedules = groupedData.doctor.length > 0 || groupedData.hospital.length > 0 || groupedData.clinic.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t("title")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("subtitle")}</p>
        </div>
        {isOwner && (
          <Button
            onClick={onAddSchedule}
            className="rounded-xl bg-gradient-to-r from-[#00B0D0] to-cyan-500 hover:from-[#009bb8] hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-5 py-2.5"
          >
            <IconPlus size={18} className="mr-2" /> {t("addButton")}
          </Button>
        )}
      </div>

      {hasAnySchedules ? (
        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="inline-flex h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 mb-8">
            {groupedData.doctor.length > 0 && (
              <TabsTrigger
                value="doctor"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium transition-all dark:text-slate-300"
              >
                <IconUser size={16} className="mr-2" />
                {t("tabs.personal")}
              </TabsTrigger>
            )}
            {groupedData.hospital.length > 0 && (
              <TabsTrigger
                value="hospital"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium transition-all dark:text-slate-300"
              >
                <IconBuildingHospital size={16} className="mr-2" />
                {t("tabs.hospitals")}
              </TabsTrigger>
            )}
            {groupedData.clinic.length > 0 && (
              <TabsTrigger
                value="clinic"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#00B0D0] data-[state=active]:shadow-sm px-4 py-2.5 text-sm font-medium transition-all dark:text-slate-300"
              >
                <IconBuildingStore size={16} className="mr-2" />
                {t("tabs.clinics")}
              </TabsTrigger>
            )}
          </TabsList>

          <div className="min-h-[300px]">
            {groupedData.doctor.length > 0 && (
              <TabsContent value="doctor" className="mt-0 outline-none">
                <ScheduleList assignmentsList={groupedData.doctor} />
              </TabsContent>
            )}
            {groupedData.hospital.length > 0 && (
              <TabsContent value="hospital" className="mt-0 outline-none">
                <ScheduleList assignmentsList={groupedData.hospital} />
              </TabsContent>
            )}
            {groupedData.clinic.length > 0 && (
              <TabsContent value="clinic" className="mt-0 outline-none">
                <ScheduleList assignmentsList={groupedData.clinic} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      ) : (
        <div className="text-center py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <IconCalendar className="text-slate-300 dark:text-slate-500 size-10" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t("emptyTitle")}</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">{t("emptyDescription")}</p>
          {isOwner && (
            <Button
              onClick={onAddSchedule}
              variant="outline"
              className="mt-6 rounded-xl border-[#00B0D0] text-[#00B0D0] hover:bg-[#00B0D0] hover:text-white transition-all"
            >
              <IconPlus size={16} className="mr-2" /> {t("addFirstSchedule")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}