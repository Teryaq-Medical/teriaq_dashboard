import React from "react";
import { Button } from "@/components/ui/button";
import { IconAward, IconPlus, IconTrash } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

interface CertificatesTabProps {
  certificates: any[];
  isOwner: boolean;
  onAddCertificate: () => void;
  onRemoveCertificate: (id: string) => void;
}

export default function CertificatesTab({
  certificates,
  isOwner,
  onAddCertificate,
  onRemoveCertificate,
}: CertificatesTabProps) {
  if (certificates.length === 0) {
    return (
      <Card className="p-10 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[2rem]">
        <IconAward className="mx-auto text-slate-300 dark:text-slate-600 w-12 h-12 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">No certificates added</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add professional certificates and licenses.</p>
        {isOwner && (
          <button
            onClick={onAddCertificate}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-[#00B0D0] text-white rounded-full text-sm font-medium shadow-md hover:bg-[#21b3d5] transition-all"
          >
            <IconPlus size={16} /> Add Certificate
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
            onClick={onAddCertificate}
            size="sm"
            className="rounded-full bg-[#00B0D0] text-white shadow-md hover:shadow-lg transition-all"
          >
            <IconPlus size={16} className="mr-1" /> Add Certificate
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert: any) => (
          <Card
            key={cert.id}
            className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-xl text-amber-600">
                  <IconAward size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{cert.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cert.entity}</p>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveCertificate(cert.id)}
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