import React from "react";
import { Card } from "@/components/ui/card";
import { IconActivity } from "@tabler/icons-react";

interface OverviewTabProps {
  data: any;
  isOwner: boolean;
  onEditAbout: () => void;
}

export default function OverviewTab({ data, isOwner, onEditAbout }: OverviewTabProps) {
  const description = data.about?.bio_details || data.description || "";
  const hasDescription = description.length > 0;

  return (
    <Card className="p-8 rounded-[2rem] border-0 shadow-lg bg-white transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <IconActivity className="text-[#00B0D0] w-5 h-5" /> 
          Professional Overview
        </h3>
        {isOwner && (
          <button 
            onClick={onEditAbout} 
            className="text-[#00B0D0] text-sm font-medium px-4 py-2 rounded-full hover:bg-cyan-50 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      {hasDescription ? (
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-inner">
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200">
          <IconActivity className="mx-auto text-slate-300 w-10 h-10 mb-3" />
          <p className="text-slate-400 font-medium">No description added yet.</p>
          {isOwner && (
            <button 
              onClick={onEditAbout}
              className="mt-3 text-[#00B0D0] text-sm hover:underline"
            >
              + Add a description
            </button>
          )}
        </div>
      )}
    </Card>
  );
}