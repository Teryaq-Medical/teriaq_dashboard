import React from "react";
import { Button } from "@/components/ui/button";
import { IconShieldCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("insurance");

  // Map raw Arabic status values to translation keys
  const getStatusLabel = (rawStatus: string) => {
    const statusMap: Record<string, string> = {
      "تغطية كاملة": t("status.full"),
      "عادية": t("status.standard"),
      "جزئية": t("status.partial"),
      "منتهية": t("status.expired"),
    };
    return statusMap[rawStatus] || rawStatus;
  };

  if (insurances.length === 0) {
    return (
      <Card className="p-10 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[2rem]">
        <IconShieldCheck className="mx-auto text-slate-300 dark:text-slate-600 w-12 h-12 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {t("empty.title")}
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          {t("empty.description")}
        </p>
        {isOwner && (
          <button
            onClick={onAddInsurance}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-[#00B0D0] text-white rounded-full text-sm font-medium shadow-md hover:bg-[#21b3d5] transition-all"
          >
            <IconPlus size={16} /> {t("addButton")}
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
            <IconPlus size={16} className="mr-1" /> {t("addButton")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insurances.map((ins: any) => (
          <Card
            key={ins.id}
            className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/30 rounded-xl text-[#00B0D0]">
                  <IconShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">
                    {ins.entity}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {getStatusLabel(ins.status)}
                  </p>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveInsurance(ins.id)}
                  className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors p-1"
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