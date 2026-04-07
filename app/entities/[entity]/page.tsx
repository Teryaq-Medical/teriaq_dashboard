"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header"
import { DataTable } from "@/components/data-table"
import { Entities } from "@/services/api.services";
import api from "@/services/api";
export default function EntitiesPage() {
  const params = useParams();
  const entity = params?.entity as string;
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the async function inside the effect
    const fetchEntities = async () => {
      // 1. Start loading state
      setLoading(true);
      
      try {
        /**
         * FIX: Your service 'getEntities' is async and already returns the clean array.
         * We just need to 'await' it and set the state directly.
         */
        const result = await Entities.getEntities(entity);
        
        setData(result); // 'result' is already the array from your service logic
      } catch (err) {
        console.error(`Failed to fetch ${entity}:`, err);
        setData([]); // Reset on error to avoid UI crashes
      } finally {
        // 2. Stop loading regardless of success or failure
        setLoading(false);
      }
    };

    if (entity) {
      fetchEntities();
    }
  }, [entity]);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
               <h1 className="text-2xl font-bold capitalize">Manage {entity}</h1>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                   <span className="animate-spin text-primary">...</span>
                   <p className="text-sm text-muted-foreground">Loading {entity}...</p>
                </div>
              </div>
            ) : (
              // Pass the data array here
              <DataTable data={data} entityType={entity} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}