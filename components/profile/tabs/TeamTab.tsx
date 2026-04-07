import React, { useState } from "react";
import Link from "next/link";
import { IconSearch, IconUsers, IconStethoscope, IconPlus, IconTrash, IconUserCircle, IconUserOff } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image";

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
  const [showOnlyRegistered, setShowOnlyRegistered] = useState<"all" | "registered" | "unregistered">("all");

  // Separate registered and unregistered doctors
  const registeredDoctors = filteredTeam.filter((asgn: any) => asgn.doctor !== null);
  const unregisteredDoctors = filteredTeam.filter((asgn: any) => asgn.unregistered_doctor !== null);

  const getFilteredDoctors = () => {
    if (showOnlyRegistered === "registered") return registeredDoctors;
    if (showOnlyRegistered === "unregistered") return unregisteredDoctors;
    return filteredTeam;
  };

  const displayedDoctors = getFilteredDoctors();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full md:w-80">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search doctor or specialty..."
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-slate-200 focus:border-[#00B0D0] bg-white h-11 text-sm shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setTeamFilter("all")}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
              teamFilter === "all"
                ? "bg-[#00B0D0] text-white shadow-md"
                : "bg-white text-slate-400 border border-slate-100 hover:border-[#00B0D0]"
            }`}
          >
            All Staff
          </button>
          {uniqueSpecialties.map((spec: any) => (
            <button
              key={spec}
              onClick={() => setTeamFilter(spec)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                teamFilter === spec
                  ? "bg-[#00B0D0] text-white shadow-md"
                  : "bg-white text-slate-400 border border-slate-100 hover:border-[#00B0D0]"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor type filter tabs */}
      <div className="flex gap-2 px-2 border-b border-slate-100">
        <button
          onClick={() => setShowOnlyRegistered("all")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            showOnlyRegistered === "all"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          All Doctors ({filteredTeam.length})
        </button>
        <button
          onClick={() => setShowOnlyRegistered("registered")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            showOnlyRegistered === "registered"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Registered ({registeredDoctors.length})
        </button>
        <button
          onClick={() => setShowOnlyRegistered("unregistered")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            showOnlyRegistered === "unregistered"
              ? "text-[#00B0D0] border-b-2 border-[#00B0D0]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Unregistered ({unregisteredDoctors.length})
        </button>
      </div>

      {isOwner && (
        <div className="flex justify-end px-2">
          <Button onClick={onAddDoctor} size="sm" className="rounded-full bg-[#00B0D0] text-white">
            <IconPlus size={16} className="mr-1" /> Add Doctor
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDoctors.length > 0 ? (
          displayedDoctors.map((asgn: any) => {
            const isRegistered = !!asgn.doctor;
            const doctor = isRegistered ? asgn.doctor : asgn.unregistered_doctor;
            const doctorName = doctor?.full_name || "Unknown Doctor";
            const specialty = doctor?.specialist?.name || "General Specialist";
            const profileImage = isRegistered 
              ? getImageUrl(doctor?.profile_image, "doctor")
              : doctor?.profile_image || "/placeholders/default-doctor.png";
            const status = asgn.status;
            const isPending = status === "pending";
            
            return (
              <div
                key={asgn.id}
                className="group flex items-center justify-between p-4 bg-white rounded-[2rem] border border-slate-100 hover:border-[#00B0D0]/30 hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={isRegistered ? `/entities/doctors/${doctor?.id}` : "#"}
                  className={`flex items-center gap-4 flex-1 ${!isRegistered ? "cursor-default" : ""}`}
                >
                  <div className="size-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm relative">
                    <img
                      src={profileImage}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/placeholders/default-doctor.png")
                      }
                    />
                    {!isRegistered && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <IconUserOff size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 group-hover:text-[#00B0D0] transition-colors">
                        {doctorName}
                      </p>
                      {!isRegistered && (
                        <Badge className="bg-orange-100 text-orange-700 text-[9px] px-2 py-0.5">
                          Pending Approval
                        </Badge>
                      )}
                      {isPending && isRegistered && (
                        <Badge className="bg-yellow-100 text-yellow-700 text-[9px] px-2 py-0.5">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                      <IconStethoscope size={14} className="text-[#00B0D0]" />
                      <p className="text-[10px] font-bold uppercase tracking-tight">
                        {specialty}
                      </p>
                    </div>
                    {!isRegistered && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-400">
                          {doctor?.phone_number}
                        </p>
                        <p className="text-[10px] text-slate-400">•</p>
                        <p className="text-[10px] text-slate-400">
                          {doctor?.address}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
                {isOwner && (
                  <button
                    onClick={() => onRemoveDoctor(asgn.id)}
                    className="ml-2 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <IconTrash size={16} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <IconUsers className="mx-auto text-slate-200 mb-2" size={40} />
            <p className="text-slate-400 text-sm font-medium italic">
              {teamSearchQuery 
                ? "No team members match your criteria."
                : showOnlyRegistered === "registered" 
                ? "No registered doctors found in your team."
                : showOnlyRegistered === "unregistered"
                ? "No unregistered doctors found in your team."
                : "No team members added yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}