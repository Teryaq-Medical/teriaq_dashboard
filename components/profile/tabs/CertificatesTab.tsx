import React from "react";
import { Button } from "@/components/ui/button";
import { IconAward, IconPlus, IconTrash } from "@tabler/icons-react";

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
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isOwner && (
          <Button onClick={onAddCertificate} size="sm" className="rounded-full bg-[#00B0D0] text-white">
            <IconPlus size={16} className="mr-1" /> Add Certificate
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {certificates.length > 0 ? (
          certificates.map((cert: any) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-5 bg-white rounded-[2rem] border shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                  <IconAward />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{cert.name}</p>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {cert.entity}
                  </p>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => onRemoveCertificate(cert.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <IconTrash size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-400 italic">No certificates uploaded.</p>
        )}
      </div>
    </div>
  );
}