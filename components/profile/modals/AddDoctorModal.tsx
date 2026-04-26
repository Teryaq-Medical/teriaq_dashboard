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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Schedule {
  day: string;
  start_time: string;
  end_time: string;
}

interface AddDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (doctorData: any) => Promise<void>;
}

export default function AddDoctorModal({
  open,
  onOpenChange,
  onAdd,
}: AddDoctorModalProps) {
  const t = useTranslations("modals.addDoctor");
  const [doctorType, setDoctorType] = useState<"registered" | "unregistered">("registered");
  const [registeredDoctorId, setRegisteredDoctorId] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([
    { day: "", start_time: "", end_time: "" }
  ]);

  const [unregisteredData, setUnregisteredData] = useState({
    full_name: "",
    specialist_name: "",
    phone_number: "",
    address: "",
    license_number: "",
    profile_image: "",
    license_document: "",
  });

  const [loading, setLoading] = useState(false);

  const days = [
    { value: "mon", label: t("days.mon") },
    { value: "tue", label: t("days.tue") },
    { value: "wed", label: t("days.wed") },
    { value: "thu", label: t("days.thu") },
    { value: "fri", label: t("days.fri") },
    { value: "sat", label: t("days.sat") },
    { value: "sun", label: t("days.sun") },
  ];

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await handleFileToBase64(file);
      setUnregisteredData({ ...unregisteredData, [field]: base64 });
    }
  };

  const addSchedule = () => setSchedules([...schedules, { day: "", start_time: "", end_time: "" }]);
  const removeSchedule = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };
  const updateSchedule = (index: number, field: keyof Schedule, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (doctorType === "registered") {
        if (!registeredDoctorId) {
          toast.error(t("errors.doctorIdRequired"));
          return;
        }
        const validSchedules = schedules.filter(s => s.day && s.start_time && s.end_time);
        await onAdd({
          doctor_type: "registered",
          doctor_id: parseInt(registeredDoctorId),
          schedules: validSchedules,
        });
      } else {
        if (!unregisteredData.full_name || !unregisteredData.specialist_name || !unregisteredData.phone_number) {
          toast.error(t("errors.requiredFields"));
          return;
        }
        await onAdd({
          ...unregisteredData,
          doctor_type: "unregistered",
        });
      }
      toast.success(doctorType === "registered" ? t("success.registered") : t("success.unregistered"));
      onOpenChange(false);
      setRegisteredDoctorId("");
      setSchedules([{ day: "", start_time: "", end_time: "" }]);
      setUnregisteredData({
        full_name: "",
        specialist_name: "",
        phone_number: "",
        address: "",
        license_number: "",
        profile_image: "",
        license_document: "",
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide bg-white dark:bg-slate-800 rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black dark:text-white">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={doctorType} onValueChange={(v) => setDoctorType(v as any)} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl h-14">
            <TabsTrigger
              value="registered"
              className="rounded-xl h-full data-[state=active]:bg-[#00B0D0] data-[state=active]:shadow-sm data-[state=active]:text-white text-sm font-semibold text-black dark:text-slate-300 hover:text-white dark:hover:text-white transition-all"
            >
              {t("tabs.registered")}
            </TabsTrigger>
            <TabsTrigger
              value="unregistered"
              className="rounded-xl h-full data-[state=active]:bg-[#00B0D0] data-[state=active]:shadow-sm data-[state=active]:text-white text-sm font-semibold text-black dark:text-slate-300 hover:text-white dark:hover:text-white transition-all"
            >
              {t("tabs.addNew")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className="space-y-4 mt-8">
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("doctorIdLabel")}
              </Label>
              <Input
                type="number"
                placeholder="Enter professional ID"
                value={registeredDoctorId}
                onChange={(e) => setRegisteredDoctorId(e.target.value)}
                className="rounded-2xl border-slate-200 dark:border-slate-700 h-12 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
          </TabsContent>

          <TabsContent value="unregistered" className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("fullNameLabel")}
              </Label>
              <Input
                placeholder="Doctor's full name"
                value={unregisteredData.full_name}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, full_name: e.target.value })}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("specializationLabel")}
              </Label>
              <Input
                placeholder="e.g. Cardiologist"
                value={unregisteredData.specialist_name}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, specialist_name: e.target.value })}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("addressLabel")}
              </Label>
              <Input
                placeholder="Clinic/Hospital address"
                value={unregisteredData.address}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, address: e.target.value })}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("phoneLabel")}
              </Label>
              <Input
                placeholder="Contact number"
                value={unregisteredData.phone_number}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, phone_number: e.target.value })}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("licenseNumberLabel")}
              </Label>
              <Input
                placeholder="Medical license"
                value={unregisteredData.license_number}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, license_number: e.target.value })}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 placeholder:text-black dark:placeholder:text-slate-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("profileImageLabel")}
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile_image")}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-black dark:text-white"
              />
              {unregisteredData.profile_image && (
                <img src={unregisteredData.profile_image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-xl" />
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-wider">
                {t("licenseDocLabel")}
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleImageUpload(e, "license_document")}
                className="rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-black dark:text-white"
              />
            </div>
            <div className="col-span-full bg-cyan-50/50 dark:bg-cyan-950/30 p-4 rounded-2xl flex gap-3 items-center border border-cyan-100/50 dark:border-cyan-800/50 mt-2">
              <IconInfoCircle className="text-black dark:text-cyan-400" size={20} />
              <p className="text-xs text-black dark:text-cyan-300 font-medium italic">
                {t("verificationNote")}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {doctorType === "registered" && (
          <div className="mt-10">
            <Label className="text-lg font-bold text-black dark:text-white block mb-4">
              {t("schedulesTitle")}
            </Label>
            {schedules.map((schedule, index) => (
              <div key={index} className="mb-4 p-5 bg-slate-50/50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] relative">
                {schedules.length > 1 && (
                  <button onClick={() => removeSchedule(index)} className="absolute top-4 right-4 text-black dark:text-slate-400 hover:text-red-600 transition-colors">
                    <IconTrash size={18} className="text-black dark:text-slate-400" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-black dark:text-slate-400">
                      {t("day")}
                    </Label>
                    <select
                      value={schedule.day}
                      onChange={(e) => updateSchedule(index, "day", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#00B0D0]/20 outline-none h-11 text-sm text-black dark:text-white"
                    >
                      <option value="">{t("selectDay")}</option>
                      {days.map(day => <option key={day.value} value={day.value}>{day.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-black dark:text-slate-400">
                      {t("start")}
                    </Label>
                    <Input
                      type="time"
                      value={schedule.start_time}
                      onChange={(e) => updateSchedule(index, "start_time", e.target.value)}
                      className="bg-white dark:bg-slate-800 rounded-xl h-11 text-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-black dark:text-slate-400">
                      {t("end")}
                    </Label>
                    <Input
                      type="time"
                      value={schedule.end_time}
                      onChange={(e) => updateSchedule(index, "end_time", e.target.value)}
                      className="bg-white dark:bg-slate-800 rounded-xl h-11 text-black dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addSchedule} className="w-full border-dashed border-2 rounded-2xl py-7 text-black dark:text-slate-300 hover:text-[#00B0D0] hover:border-[#00B0D0] bg-white dark:bg-slate-800 transition-colors">
              <IconPlus size={20} className="mr-2 text-black dark:text-slate-300" /> {t("addAnotherShift")}
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-10">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl px-8 h-12 text-black dark:text-slate-300 font-bold hover:text-slate-700 dark:hover:text-white">
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#00B0D0] hover:bg-[#0096b0] rounded-xl px-10 h-12 font-bold shadow-lg shadow-cyan-100 dark:shadow-cyan-950/50 text-white">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : t("confirmSave")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}