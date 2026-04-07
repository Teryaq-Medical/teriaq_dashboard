import React from "react";
import { Card } from "@/components/ui/card";
import { IconActivity } from "@tabler/icons-react";

interface OverviewTabProps {
  data: any;
  isOwner: boolean;
  onEditAbout: () => void;
}

export default function OverviewTab({ data, isOwner, onEditAbout }: OverviewTabProps) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <IconActivity className="text-[#00B0D0]" /> Professional Overview
        </h3>
        {isOwner && (
          <button onClick={onEditAbout} className="text-[#00B0D0] text-sm font-medium">
            Edit
          </button>
        )}
      </div>
      <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
        {data.about?.bio_details || data.description || "No description available"}
      </p>
    </Card>
  );
}