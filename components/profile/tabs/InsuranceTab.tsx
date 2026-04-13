import React from "react";
import { Button } from "@/components/ui/button";
import { IconShieldCheck, IconPlus, IconTrash, IconBuildingStore } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

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
  if (insurances.length === 0) {
    return (
      <Card className="p-10 text-center border-dashed border-2 border-slate-200 bg-white rounded-[2rem]">
        <IconBuildingStore className="mx-auto text-slate-300 w-12 h-12 mb-4" />
        <p className="text-slate-500 font-medium">No insurance providers listed</p>
        <p className="text-slate-400 text-sm mt-1">Add accepted insurance plans.</p>
        {isOwner && (
          <button
            onClick={onAddInsurance}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-[#00B0D0] text-white rounded-full text-sm font-medium shadow-md hover:bg-[#21b3d5] transition-all"
          >
            <IconPlus size={16} /> Add Insurance
          </button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isOwner && (
          <Button
            onClick={onAddInsurance}
            size="sm"
            className="rounded-full bg-[#00B0D0] text-white shadow-md hover:shadow-lg transition-all"
          >
            <IconPlus size={16} className="mr-1" /> Add Insurance
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insurances.map((ins: any) => (
          <Card
            key={ins.id}
            className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl text-[#00B0D0]">
                  <IconShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{ins.entity}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">
                    {ins.status === 'عادية' ? 'Standard' : ins.status === 'تغطية كاملة' ? 'Full Coverage' : ins.status === 'جزئية' ? 'Partial' : 'Expired'}
                  </p>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveInsurance(ins.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <IconTrash size={18} />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}