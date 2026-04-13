import React, { useState } from "react";
import { IconX, IconStethoscope, IconPlus } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import AddSpecialistModal from "@/components/profile/modals/AddSpecialistModal"; // Ensure path is correct

interface SpecialistsTabProps {
  specialists: any[];
  isOwner: boolean;
  onAddSpecialist: (name: string) => void;
  onRemoveSpecialist: (id: string) => void;
}

export default function SpecialistsTab({
  specialists,
  isOwner,
  onAddSpecialist,
  onRemoveSpecialist,
}: SpecialistsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AddSpecialistModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={onAddSpecialist} 
      />

      {specialists.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-slate-200 bg-white rounded-[2.5rem]">
          <IconStethoscope className="mx-auto text-slate-300 w-12 h-12 mb-4" />
          <p className="text-slate-500 font-medium">No specialists added yet</p>
          <p className="text-slate-400 text-sm mt-1">Add medical specialties to help patients find you.</p>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#00B0D0] text-white rounded-full text-sm font-bold shadow-lg shadow-cyan-100 hover:bg-[#21b3d5] transition-all"
            >
              <IconPlus size={18} /> Add Specialist
            </button>
          )}
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center px-2">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Specialties ({specialists.length})
            </h4>
            {isOwner && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-sm font-bold text-[#00B0D0] hover:text-[#0096b0]"
              >
                <IconPlus size={16} /> Add New
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialists.map((sp: any) => (
              <div
                key={sp.id}
                className="relative group bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00B0D0]" />
                  <span className="text-slate-700 font-bold text-sm">{sp.name}</span>
                </div>
                {isOwner && (
                  <button
                    onClick={() => onRemoveSpecialist(sp.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  >
                    <IconX size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}