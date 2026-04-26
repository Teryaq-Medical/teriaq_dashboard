import React, { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import {
  IconSearch,
  IconUsers,
  IconStethoscope,
  IconPlus,
  IconTrash,
  IconUserOff,
  IconCheck,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/services/api";
import { useTranslations } from "next-intl";

interface ScheduleForm {
  id?: number;
  day: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface TeamTabProps {
  data: any;
  isOwner: boolean;
  teamSearchQuery: string;
  setTeamSearchQuery: (query: string) => void;
  teamFilter: string;
  setTeamFilter: (filter: string) => void;
  filteredTeam: any[];
  uniqueSpecialties: string[];
  onAddDoctor: () => void;
  onRemoveDoctor: (id: string) => void;
}

export default function TeamTab({
  data,
  isOwner,
  teamSearchQuery,
  setTeamSearchQuery,
  teamFilter,
  setTeamFilter,
  filteredTeam,
  uniqueSpecialties,
  onAddDoctor,
  onRemoveDoctor,
}: TeamTabProps) {
  const t = useTranslations("team");

  const [showOnlyRegistered, setShowOnlyRegistered] = useState<
    "all" | "registered" | "unregistered"
  >("all");

  // Schedule-only modal (for registered doctors)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [schedules, setSchedules] = useState<ScheduleForm[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [submittingSchedules, setSubmittingSchedules] = useState(false);

  // Full edit modal (for unregistered doctors)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState<any>({
    full_name: "",
    phone_number: "",
    address: "",
  });
  const [editSchedules, setEditSchedules] = useState<ScheduleForm[]>([]);
  const [loadingEditSchedules, setLoadingEditSchedules] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const registeredDoctors = filteredTeam.filter(
    (asgn: any) => asgn.doctor !== null,
  );
  const unregisteredDoctors = filteredTeam.filter(
    (asgn: any) => asgn.unregistered_doctor !== null,
  );

  const getFilteredDoctors = () => {
    if (showOnlyRegistered === "registered") return registeredDoctors;
    if (showOnlyRegistered === "unregistered") return unregisteredDoctors;
    return filteredTeam;
  };

  const displayedDoctors = getFilteredDoctors();

  // ---------- Schedule-only modal (registered doctors) ----------
  const fetchSchedulesByAssignment = async (assignmentId: number) => {
    setLoadingSchedules(true);
    try {
      const res = await api.get(`/work-schedule/?assignment=${assignmentId}`);
      const data = res.data?.data || res.data?.results || res.data || [];
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(t("errors.scheduleLoadFailed"));
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const openScheduleModal = (assignment: any) => {
    setCurrentAssignment(assignment);
    fetchSchedulesByAssignment(assignment.id);
    setScheduleModalOpen(true);
  };

  const addScheduleRow = () => {
    setSchedules([
      ...schedules,
      {
        day: "",
        start_time: "",
        end_time: "",
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateScheduleRow = (index: number, field: string, value: string) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const removeScheduleRow = (index: number) => {
    const updated = [...schedules];
    updated.splice(index, 1);
    setSchedules(updated);
  };

  const handleSaveSchedules = async () => {
    if (!currentAssignment) return;
    setSubmittingSchedules(true);
    try {
      const validSchedules = schedules.filter(
        (s) => s.day && s.start_time && s.end_time && s.date,
      );
      if (validSchedules.length === 0) {
        toast.error(t("errors.scheduleAtLeastOne"));
        setSubmittingSchedules(false);
        return;
      }
      for (const sch of validSchedules) {
        await api.post("/work-schedule/", {
          assignment: currentAssignment.id,
          day: sch.day,
          start_time: sch.start_time,
          end_time: sch.end_time,
          date: sch.date,
        });
      }
      toast.success(t("success.schedulesSaved"));
      setScheduleModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("errors.scheduleSaveFailed"));
    } finally {
      setSubmittingSchedules(false);
    }
  };

  // ---------- Full edit modal (unregistered doctors) ----------
  const openEditModal = (assignment: any) => {
    const doctor = assignment.unregistered_doctor;
    setCurrentAssignment(assignment);
    setEditDoctorData({
      full_name: doctor.full_name || "",
      phone_number: doctor.phone_number || "",
      address: doctor.address || "",
    });
    setLoadingEditSchedules(true);
    api
      .get(`/work-schedule/?assignment=${assignment.id}`)
      .then((res) => {
        const data = res.data?.data || res.data?.results || res.data || [];
        setEditSchedules(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast.error(t("errors.scheduleLoadFailed"));
        setEditSchedules([]);
      })
      .finally(() => setLoadingEditSchedules(false));
    setEditModalOpen(true);
  };

  const addEditScheduleRow = () => {
    setEditSchedules([
      ...editSchedules,
      {
        day: "",
        start_time: "",
        end_time: "",
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateEditScheduleRow = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...editSchedules];
    updated[index] = { ...updated[index], [field]: value };
    setEditSchedules(updated);
  };

  const removeEditScheduleRow = (index: number) => {
    const updated = [...editSchedules];
    updated.splice(index, 1);
    setEditSchedules(updated);
  };

  const handleSaveEdit = async () => {
    if (!currentAssignment) return;
    setSubmittingEdit(true);
    try {
      const doctorPatch: any = {};
      if (
        editDoctorData.full_name !==
        currentAssignment.unregistered_doctor.full_name
      ) {
        doctorPatch.full_name = editDoctorData.full_name;
      }
      if (
        editDoctorData.phone_number !==
        currentAssignment.unregistered_doctor.phone_number
      ) {
        doctorPatch.phone_number = editDoctorData.phone_number;
      }
      if (
        editDoctorData.address !== currentAssignment.unregistered_doctor.address
      ) {
        doctorPatch.address = editDoctorData.address;
      }
      if (Object.keys(doctorPatch).length > 0) {
        await api.patch(
          `/un-doctors/${currentAssignment.unregistered_doctor.id}/`,
          doctorPatch,
        );
      }

      const validSchedules = editSchedules.filter(
        (s) => s.day && s.start_time && s.end_time && s.date,
      );
      for (const sch of validSchedules) {
        if (!sch.id) {
          await api.post("/work-schedule/", {
            assignment: currentAssignment.id,
            day: sch.day,
            start_time: sch.start_time,
            end_time: sch.end_time,
            date: sch.date,
          });
        }
      }

      toast.success(t("success.doctorUpdated"));
      setEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("errors.doctorUpdateFailed"));
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Translated days for dropdowns
  const daysOfWeek = [
    { value: "mon", label: t("scheduleDays.mon") },
    { value: "tue", label: t("scheduleDays.tue") },
    { value: "wed", label: t("scheduleDays.wed") },
    { value: "thu", label: t("scheduleDays.thu") },
    { value: "fri", label: t("scheduleDays.fri") },
    { value: "sat", label: t("scheduleDays.sat") },
    { value: "sun", label: t("scheduleDays.sun") },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2">
        <div className="relative w-full md:w-80">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
          />
          <Input
            placeholder={t("searchPlaceholder")}
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-[#00B0D0] bg-white dark:bg-slate-800 h-11 text-sm shadow-sm dark:text-white w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setTeamFilter("all")}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
              teamFilter === "all"
                ? "bg-[#00B0D0] text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-[#00B0D0]"
            }`}
          >
            {t("filterAllStaff")}
          </button>
          {uniqueSpecialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setTeamFilter(spec)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                teamFilter === spec
                  ? "bg-[#00B0D0] text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-[#00B0D0]"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Registration type tabs */}
      <div className="flex gap-2 px-2 border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
        <button
          onClick={() => setShowOnlyRegistered("all")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            showOnlyRegistered === "all"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          {t("allDoctors", { count: filteredTeam.length })}
        </button>
        <button
          onClick={() => setShowOnlyRegistered("registered")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            showOnlyRegistered === "registered"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          {t("registeredDoctors", { count: registeredDoctors.length })}
        </button>
        <button
          onClick={() => setShowOnlyRegistered("unregistered")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            showOnlyRegistered === "unregistered"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          {t("unregisteredDoctors", { count: unregisteredDoctors.length })}
        </button>
      </div>

      {isOwner && (
        <div className="flex justify-end px-2">
          <Button
            onClick={onAddDoctor}
            size="sm"
            className="rounded-full bg-[#00B0D0] text-white"
          >
            <IconPlus size={16} className="mr-1" /> {t("addDoctor")}
          </Button>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDoctors.length > 0 ? (
          displayedDoctors.map((asgn: any) => {
            const isRegistered = !!asgn.doctor;
            const doctor = isRegistered
              ? asgn.doctor
              : asgn.unregistered_doctor;
            const doctorName = doctor?.full_name || t("unknownDoctor");
            const specialty = doctor?.specialist?.name || t("generalSpecialist");
            const profileImage =
              doctor?.profile_image || "/placeholders/default-doctor.png";
            const status = asgn.status;
            const isApproved = status === "approved";

            const isClickable = isApproved && isOwner;
            const handleCardClick = () => {
              if (!isClickable) return;
              if (isRegistered) {
                openScheduleModal(asgn);
              } else {
                openEditModal(asgn);
              }
            };

            return (
              <div
                key={asgn.id}
                onClick={handleCardClick}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 transition-all duration-300 ${
                  isClickable
                    ? "cursor-pointer hover:border-[#00B0D0]/50 hover:shadow-xl"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm relative shrink-0">
                    <img
                      src={profileImage}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/placeholders/default-doctor.png")
                      }
                    />
                    {!isRegistered && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <IconUserOff size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {doctorName}
                      </p>
                      {status === "pending" && isRegistered && (
                        <Badge className="bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 text-[9px] px-2 py-0.5">
                          {t("pending")}
                        </Badge>
                      )}
                      {isApproved && (
                        <Badge className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-[9px] px-2 py-0.5">
                          <IconCheck size={12} className="mr-1 inline" />
                          {t("approved")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 mt-0.5">
                      <IconStethoscope
                        size={14}
                        className="text-[#00B0D0] shrink-0"
                      />
                      <p className="text-[10px] font-bold uppercase tracking-tight truncate">
                        {specialty}
                      </p>
                    </div>
                    {!isRegistered && (
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        <span className="truncate">{doctor?.phone_number}</span>
                        <span>•</span>
                        <span className="truncate">{doctor?.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveDoctor(asgn.id);
                    }}
                    className="ml-2 p-2 rounded-full text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 self-end sm:self-auto mt-2 sm:mt-0"
                  >
                    <IconTrash size={16} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
            <IconUsers
              className="mx-auto text-slate-200 dark:text-slate-700 mb-2"
              size={40}
            />
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">
              {t("noDoctors")}
            </p>
          </div>
        )}
      </div>

      {/* Schedule-only modal (for registered doctors) */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-6 sm:p-8 bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {t("scheduleModal.title")} — {currentAssignment?.doctor?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-semibold text-lg text-black dark:text-white">
                {t("scheduleModal.workingSchedules")}
              </h3>
              <Button
                variant="outline"
                onClick={addScheduleRow}
                className="rounded-xl text-sm border-slate-200 dark:border-slate-700 text-black dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <IconPlus size={16} className="mr-1" /> {t("scheduleModal.addSchedule")}
              </Button>
            </div>

            {loadingSchedules ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                {t("scheduleModal.loading")}
              </p>
            ) : schedules.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-slate-500 py-4">
                {t("scheduleModal.noSchedules")}
              </p>
            ) : (
              <div className="space-y-3">
                {schedules.map((sch, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                      <div>
                        <Label className="text-xs uppercase font-black text-black dark:text-white">
                          {t("scheduleModal.day")}
                        </Label>
                        <select
                          value={sch.day}
                          onChange={(e) =>
                            updateScheduleRow(index, "day", e.target.value)
                          }
                          className="w-full mt-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 h-10 text-sm text-black dark:text-white focus:border-[#00B0D0] focus:ring-1 focus:ring-[#00B0D0]/20"
                        >
                          <option value="">{t("scheduleModal.select")}</option>
                          {daysOfWeek.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs uppercase font-black text-black dark:text-white">
                          {t("scheduleModal.startTime")}
                        </Label>
                        <Input
                          type="time"
                          value={sch.start_time}
                          onChange={(e) =>
                            updateScheduleRow(
                              index,
                              "start_time",
                              e.target.value,
                            )
                          }
                          className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs uppercase font-black text-black dark:text-white">
                          {t("scheduleModal.endTime")}
                        </Label>
                        <Input
                          type="time"
                          value={sch.end_time}
                          onChange={(e) =>
                            updateScheduleRow(index, "end_time", e.target.value)
                          }
                          className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs uppercase font-black text-black dark:text-white">
                          {t("scheduleModal.date")}
                        </Label>
                        <Input
                          type="date"
                          value={sch.date}
                          onChange={(e) =>
                            updateScheduleRow(index, "date", e.target.value)
                          }
                          className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScheduleRow(index)}
                        className="rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setScheduleModalOpen(false)}
              className="rounded-full w-full sm:w-auto border-slate-200 dark:border-slate-700 text-black dark:text-slate-300"
            >
              {t("scheduleModal.cancel")}
            </Button>
            <Button
              onClick={handleSaveSchedules}
              disabled={submittingSchedules}
              className="rounded-full bg-[#00B0D0] hover:bg-[#0096b0] text-white w-full sm:w-auto"
            >
              {submittingSchedules ? t("scheduleModal.saving") : t("scheduleModal.saveAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full edit modal (for unregistered doctors) */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] bg-white dark:bg-slate-800 p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {t("editModal.title")}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl">
              <TabsTrigger
                value="details"
                className="rounded-xl data-[state=active]:bg-[#00B0D0] data-[state=active]:text-white text-black dark:text-slate-300"
              >
                {t("editModal.personalDetails")}
              </TabsTrigger>
              <TabsTrigger
                value="schedules"
                className="rounded-xl data-[state=active]:bg-[#00B0D0] data-[state=active]:text-white text-black dark:text-slate-300"
              >
                {t("editModal.schedules")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div>
                <Label className="text-black dark:text-white">
                  {t("editModal.fullName")}
                </Label>
                <Input
                  value={editDoctorData.full_name}
                  onChange={(e) =>
                    setEditDoctorData({
                      ...editDoctorData,
                      full_name: e.target.value,
                    })
                  }
                  className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="text-black dark:text-white">
                  {t("editModal.phoneNumber")}
                </Label>
                <Input
                  value={editDoctorData.phone_number}
                  onChange={(e) =>
                    setEditDoctorData({
                      ...editDoctorData,
                      phone_number: e.target.value,
                    })
                  }
                  className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="text-black dark:text-white">
                  {t("editModal.address")}
                </Label>
                <Input
                  value={editDoctorData.address}
                  onChange={(e) =>
                    setEditDoctorData({
                      ...editDoctorData,
                      address: e.target.value,
                    })
                  }
                  className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
                />
              </div>
            </TabsContent>

            <TabsContent value="schedules">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-black dark:text-white">
                    {t("editModal.workingSchedules")}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={addEditScheduleRow}
                    size="sm"
                    className="rounded-xl border-slate-200 dark:border-slate-700 text-black dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <IconPlus size={14} className="mr-1" /> {t("editModal.add")}
                  </Button>
                </div>

                {loadingEditSchedules ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                    {t("editModal.loading")}
                  </p>
                ) : editSchedules.length === 0 ? (
                  <p className="text-center text-slate-400 dark:text-slate-500 py-4">
                    {t("editModal.noSchedules")}
                  </p>
                ) : (
                  editSchedules.map((sch, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                        <div>
                          <Label className="text-xs uppercase font-black text-black dark:text-white">
                            {t("editModal.day")}
                          </Label>
                          <select
                            value={sch.day}
                            onChange={(e) =>
                              updateEditScheduleRow(
                                index,
                                "day",
                                e.target.value,
                              )
                            }
                            className="w-full mt-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 h-10 text-sm text-black dark:text-white focus:border-[#00B0D0] focus:ring-1 focus:ring-[#00B0D0]/20"
                          >
                            <option value="">{t("editModal.select")}</option>
                            {daysOfWeek.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs uppercase font-black text-black dark:text-white">
                            {t("editModal.start")}
                          </Label>
                          <Input
                            type="time"
                            value={sch.start_time}
                            onChange={(e) =>
                              updateEditScheduleRow(
                                index,
                                "start_time",
                                e.target.value,
                              )
                            }
                            className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase font-black text-black dark:text-white">
                            {t("editModal.end")}
                          </Label>
                          <Input
                            type="time"
                            value={sch.end_time}
                            onChange={(e) =>
                              updateEditScheduleRow(
                                index,
                                "end_time",
                                e.target.value,
                              )
                            }
                            className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase font-black text-black dark:text-white">
                            {t("editModal.date")}
                          </Label>
                          <Input
                            type="date"
                            value={sch.date}
                            onChange={(e) =>
                              updateEditScheduleRow(
                                index,
                                "date",
                                e.target.value,
                              )
                            }
                            className="mt-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditScheduleRow(index)}
                          className="rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                        >
                          <IconTrash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="rounded-full w-full sm:w-auto border-slate-200 dark:border-slate-700 text-black dark:text-slate-300"
            >
              {t("editModal.cancel")}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={submittingEdit}
              className="rounded-full bg-[#00B0D0] hover:bg-[#0096b0] text-white w-full sm:w-auto"
            >
              {submittingEdit ? t("editModal.saving") : t("editModal.saveAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}