// components/profile/tabs/BookingsTab.tsx

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
}: BookingsTabProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (id: string) => {
    if (window.confirm("Confirm this appointment?")) {
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

  return (
    <>
      {/* Grid of stat cards (original styling) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* "All Bookings" button as first card */}
        <button
          onClick={() => setActiveFilter("all")}
          className={`p-6 rounded-[2rem] flex flex-col items-center text-center space-y-2 transition-all duration-300 border-2 w-full ${
            activeFilter === "all"
              ? "bg-[#00B0D0] text-white shadow-md border-[#00B0D0]"
              : "bg-white text-slate-500 border-slate-200 hover:border-[#00B0D0]"
          }`}
        >
          <div className="size-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <IconClipboardList size={20} className={activeFilter === "all" ? "text-white" : "text-[#00B0D0]"} />
          </div>
          <p className="text-2xl font-black">{stats.total || 0}</p>
          <p className="text-[10px] font-bold uppercase tracking-tighter">All Bookings</p>
        </button>

        <BookingStat
          icon={<IconCircleCheck className="text-green-500" />}
          label="Confirmed"
          value={stats.confirmed}
          color="bg-green-50"
          isActive={activeFilter === "confirmed"}
          onClick={() => setActiveFilter(activeFilter === "confirmed" ? "all" : "confirmed")}
        />
        <BookingStat
          icon={<IconActivity className="text-blue-500" />}
          label="Completed"
          value={stats.completed}
          color="bg-blue-50"
          isActive={activeFilter === "completed"}
          onClick={() => setActiveFilter(activeFilter === "completed" ? "all" : "completed")}
        />
        <BookingStat
          icon={<IconCircleX className="text-red-500" />}
          label="Cancelled"
          value={stats.cancelled}
          color="bg-red-50"
          isActive={activeFilter === "cancelled"}
          onClick={() => setActiveFilter(activeFilter === "cancelled" ? "all" : "cancelled")}
        />
        <BookingStat
          icon={<IconUsers className="text-orange-500" />}
          label="No Show"
          value={stats.no_show}
          color="bg-orange-50"
          isActive={activeFilter === "no_show"}
          onClick={() => setActiveFilter(activeFilter === "no_show" ? "all" : "no_show")}
        />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 mb-2">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              {activeFilter === "all"
                ? "All Recent Appointments"
                : `${activeFilter} Appointments`}
            </h4>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="text-[10px] font-bold text-[#00B0D0] hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <IconSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Search code or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200 focus:border-[#00B0D0] text-xs h-9"
            />
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className="group p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-[#00B0D0]/30 transition-all flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#00B0D0] group-hover:bg-[#00B0D0] group-hover:text-white transition-colors">
                  <IconCalendar size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{booking.assignment_display}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <IconCalendar size={12} className="text-[#00B0D0]" />{" "}
                      {booking.appointment_date}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <IconClock size={12} className="text-[#00B0D0]" /> {booking.appointment_time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Booking code - hidden from owner */}
                {!isOwner && (
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      Code
                    </p>
                    <p className="text-xs font-mono font-bold text-[#00B0D0]">
                      {booking.booking_code}
                    </p>
                  </div>
                )}

                <Badge
                  className={`rounded-full px-4 py-1 text-[10px] font-black uppercase border-none shadow-sm ${
                    booking.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : booking.status === "confirmed"
                      ? "bg-blue-100 text-blue-600"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {booking.status}
                </Badge>

                {/* Owner actions */}
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
                    className="rounded-full border-amber-400 text-amber-600 hover:bg-amber-50"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center">
            <IconClipboardList className="mx-auto text-slate-200 mb-2" size={40} />
            <p className="text-slate-400 text-sm font-medium">
              No matches found for your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Complete Appointment Modal */}
      <Dialog open={!!completingId} onOpenChange={() => setCompletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Please enter the booking code provided by the patient to mark this appointment as completed.
            </p>
            <Input
              placeholder="Enter booking code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCompletingId(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => completingId && handleComplete(completingId)}
                disabled={loading}
                className="bg-[#00B0D0]"
              >
                {loading ? "Processing..." : "Complete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Original BookingStat component (unchanged)
function BookingStat({ icon, label, value, color, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-[2rem] ${color} flex flex-col items-center text-center space-y-2 transition-all duration-300 border-2 w-full ${
        isActive
          ? "border-[#00B0D0] shadow-md scale-[1.02] ring-4 ring-[#00B0D0]/10"
          : "border-transparent opacity-60 hover:opacity-100"
      }`}
    >
      <div className="size-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">{label}</p>
    </button>
  );
}