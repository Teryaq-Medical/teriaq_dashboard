import React from "react";
import { Button } from "@/components/ui/button";
import { IconShieldCheck, IconPlus, IconTrash } from "@tabler/icons-react";

interface InsuranceTabProps {
  insurances: any[];
  isOwner: boolean;
  onAddInsurance: () => void;
  onRemoveInsurance: (id: string) => void;
}

export default function InsuranceTab({
  insurances,
  isOwner,
  onAddInsurance,
  onRemoveInsurance,
}: InsuranceTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isOwner && (
          <Button onClick={onAddInsurance} size="sm" className="rounded-full bg-[#00B0D0] text-white">
            <IconPlus size={16} className="mr-1" /> Add Insurance
          </Button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {insurances.length > 0 ? (
          insurances.map((ins: any) => (
            <div
              key={ins.id}
              className="flex justify-between items-center p-5 bg-white rounded-[2rem] border shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                  <IconShieldCheck className="text-[#00B0D0]" size={20} />
                </div>
                <p className="font-bold text-slate-800">{ins.entity}</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveInsurance(ins.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <IconTrash size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-400 italic">No insurance providers listed.</p>
        )}
      </div>
    </div>
  );
}