import React from "react";
import { Badge } from "@/components/ui/badge";
import { IconX } from "@tabler/icons-react";

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
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {specialists.length > 0 ? (
        specialists.map((sp: any) => (
          <div key={sp.id} className="relative">
            <Badge className="bg-white border-2 border-slate-100 text-slate-700 px-6 py-2.5 rounded-2xl font-bold shadow-sm">
              {sp.name}
            </Badge>
            {isOwner && (
              <button
                onClick={() => onRemoveSpecialist(sp.id)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm text-red-400 hover:text-red-600"
              >
                <IconX size={14} />
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-slate-400 italic">No specialist categories listed.</p>
      )}
      {isOwner && (
        <button
          onClick={() => {
            const name = prompt("Enter specialist name:");
            if (name) onAddSpecialist(name);
          }}
          className="border-2 border-dashed border-slate-300 rounded-2xl px-4 py-2 text-xs font-bold text-slate-500 hover:border-[#00B0D0] hover:text-[#00B0D0]"
        >
          + Add
        </button>
      )}
    </div>
  );
}