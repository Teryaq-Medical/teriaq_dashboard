"use client";

import { ReactNode } from "react";
import { IconEdit } from "@tabler/icons-react";

export function ContactItem({
  icon,
  label,
  value,
  editable,
  onEdit,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  editable?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-sm font-semibold text-slate-800">
            {value || "—"}
          </p>
        </div>
      </div>

      {editable && (
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-[#00B0D0]"
        >
          <IconEdit size={14} />
        </button>
      )}
    </div>
  );
}

// (اختياري) لو بتستخدمهم في باقي الصفحة
export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
      {icon}
    </div>
  );
}

export function BookingStat({
  label,
  value,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border text-left transition ${
        isActive
          ? "bg-[#00B0D0] text-white"
          : "bg-white text-slate-700 hover:border-[#00B0D0]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold">{label}</span>
        {icon}
      </div>
      <p className="text-lg font-black mt-2">{value}</p>
    </button>
  );
}