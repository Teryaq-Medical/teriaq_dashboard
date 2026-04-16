import React, { useState } from "react";
import {
  IconCircleCheck,
  IconActivity,
  IconCircleX,
  IconUsers,
  IconSearch,
  IconCalendar,
  IconClock,
  IconClipboardList,
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
} from "@/components/ui/dialog";

interface BookingsTabProps {
  stats: any;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBookings: any[];
  isOwner: boolean;
  onConfirmAppointment: (appointmentId: string) => Promise<void>;
  onCompleteAppointment: (appointmentId: string, bookingCode: string) => Promise<void>;
  isLab?: boolean;
}

export default function BookingsTab({
  stats,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  filteredBookings,
  isOwner,
  onConfirmAppointment,
  onCompleteAppointment,
  isLab = false,
}: BookingsTabProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (id: string) => {
    if (window.confirm("Confirm this booking?")) {
      await onConfirmAppointment(id);
    }
  };

  const handleComplete = async (id: string) => {
    if (!codeInput.trim()) {
      alert("Please enter the booking code provided by the patient.");
      return;
    }
    setLoading(true);
    try {
      await onCompleteAppointment(id, codeInput.trim());
      setCompletingId(null);
      setCodeInput("");
    } catch (error) {
      alert("Invalid booking code or failed to complete.");
    } finally {
      setLoading(false);
    }
  };

  const displayStats = stats;

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeFilter === "all"
              ? "bg-[#00B0D0] text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#00B0D0]"
          }`}
        >
          All Bookings
        </button>
        <BookingStat
          icon={<IconCircleCheck className="text-green-500" />}
          label="Confirmed"
          value={displayStats.confirmed || 0}
          color="bg-green-50 dark:bg-green-950/30"
          isActive={activeFilter === "confirmed"}
          onClick={() => setActiveFilter(activeFilter === "confirmed" ? "all" : "confirmed")}
        />
        <BookingStat
          icon={<IconActivity className="text-blue-500" />}
          label="Completed"
          value={displayStats.completed || 0}
          color="bg-blue-50 dark:bg-blue-950/30"
          isActive={activeFilter === "completed"}
          onClick={() => setActiveFilter(activeFilter === "completed" ? "all" : "completed")}
        />
        <BookingStat
          icon={<IconCircleX className="text-red-500" />}
          label="Cancelled"
          value={displayStats.cancelled || 0}
          color="bg-red-50 dark:bg-red-950/30"
          isActive={activeFilter === "cancelled"}
          onClick={() => setActiveFilter(activeFilter === "cancelled" ? "all" : "cancelled")}
        />
        {!isLab && (
          <BookingStat
            icon={<IconUsers className="text-orange-500" />}
            label="No Show"
            value={displayStats.no_show || 0}
            color="bg-orange-50 dark:bg-orange-950/30"
            isActive={activeFilter === "no_show"}
            onClick={() => setActiveFilter(activeFilter === "no_show" ? "all" : "no_show")}
          />
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 mb-2">
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              {activeFilter === "all"
                ? "All Recent Appointments"
                : `${activeFilter} Appointments`}
            </h4>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <Input
              placeholder="Search by patient, doctor, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200 dark:border-slate-700 focus:border-[#00B0D0] dark:bg-slate-800 dark:text-white text-xs h-9"
            />
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className="group p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-[#00B0D0]/30 transition-all flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-[#00B0D0] group-hover:bg-[#00B0D0] group-hover:text-white transition-colors">
                  <IconCalendar size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {booking.patient_name || "Patient"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isLab ? booking.service_name : booking.assignment_display}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      <IconCalendar size={12} className="text-[#00B0D0]" />{" "}
                      {booking.appointment_date || booking.created_at?.split('T')[0]}
                    </span>
                    {!isLab && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        <IconClock size={12} className="text-[#00B0D0]" /> {booking.appointment_time}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {!isOwner && booking.booking_code && (
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Code</p>
                    <p className="text-xs font-mono font-bold text-[#00B0D0]">{booking.booking_code}</p>
                  </div>
                )}

                <Badge
                  className={`rounded-full px-4 py-1 text-[10px] font-black uppercase border-none shadow-sm ${
                    booking.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                      : booking.status === "confirmed"
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : booking.status === "cancelled"
                      ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {booking.status}
                </Badge>

                {isOwner && booking.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(booking.id)}
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <IconCheck size={14} className="mr-1" /> Confirm
                  </Button>
                )}

                {isOwner && booking.status === "confirmed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCompletingId(booking.id)}
                    className="rounded-full border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
            <IconClipboardList className="mx-auto text-slate-200 dark:text-slate-600 mb-2" size={40} />
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No matches found for your criteria.</p>
          </div>
        )}
      </div>

      <Dialog open={!!completingId} onOpenChange={() => setCompletingId(null)}>
        <DialogContent className="bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Complete Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Please enter the booking code provided by the patient to mark this booking as completed.</p>
            <Input placeholder="Enter booking code" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} className="dark:bg-slate-700 dark:border-slate-600" />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCompletingId(null)}>Cancel</Button>
              <Button onClick={() => completingId && handleComplete(completingId)} disabled={loading} className="bg-[#00B0D0]">
                {loading ? "Processing..." : "Complete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookingStat({ icon, label, value, color, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl ${color} flex flex-col items-center text-center space-y-2 transition-all duration-300 border-2 ${
        isActive
          ? "border-[#00B0D0] shadow-md scale-[1.02] ring-4 ring-[#00B0D0]/10"
          : "border-transparent opacity-70 hover:opacity-100"
      }`}
    >
      <div className="size-8 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <p className="text-xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-tighter">{label}</p>
    </button>
  );
}