import React from "react";
import { IconClipboardList, IconCircleCheck, IconStarFilled } from "@tabler/icons-react";

interface ProfileStatsProps {
  stats: any;
  rating: number;
}

export default function ProfileStats({ stats, rating }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Total Bookings"
        value={stats.total}
        trend="Overall"
        icon={<IconClipboardList className="text-cyan-500" size={20} />}
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        trend="Success"
        icon={<IconCircleCheck className="text-green-500" size={20} />}
      />
      <StatCard
        label="Clinic Rating"
        value={rating}
        trend="Global"
        icon={<IconStarFilled className="text-amber-400" size={20} />}
      />
    </div>
  );
}

function StatCard({ label, value, trend, icon }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        <span className="text-[9px] font-bold text-[#00B0D0] bg-cyan-50 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
    </div>
  );
}