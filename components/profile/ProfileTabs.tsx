import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all tab components
import OverviewTab from "./tabs/OverviewTab";
import TeamTab from "./tabs/TeamTab";
import BookingsTab from "./tabs/BookingsTab";
import SpecialistsTab from "./tabs/SpecialistsTab";
import ScheduleTab from "./tabs/ScheduleTab";
import InsuranceTab from "./tabs/InsuranceTab";
import CertificatesTab from "./tabs/CertificatesTab";
import DoctorSpecialistEditor from "./modals/DoctorSpecialistEditor";

interface ProfileTabsProps {
  data: any;
  isDoctor: boolean;
  isMedicalEntity: boolean;
  isOwner: boolean;
  showBookingsTab?: boolean; // ✅ new prop
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  teamSearchQuery: string;
  setTeamSearchQuery: (query: string) => void;
  teamFilter: string;
  setTeamFilter: (filter: string) => void;
  filteredBookings: any[];
  filteredTeam: any[];
  uniqueSpecialties: string[];
  onEditAbout: () => void;
  onUpdateDoctorSpecialist?: (name: string) => Promise<void>;
  onAddDoctor: () => void;
  onRemoveDoctor: (id: string) => void;
  onAddSpecialist: (name: string) => void;
  onRemoveSpecialist: (id: string) => void;
  onAddSchedule: () => void;
  onRemoveSchedule: (id: string) => void;
  onAddInsurance: () => void;
  onRemoveInsurance: (id: string) => void;
  onAddCertificate: () => void;
  onRemoveCertificate: (id: string) => void;
  onConfirmAppointment?: (id: string) => Promise<void>;
  onCompleteAppointment?: (id: string, code: string) => Promise<void>;
}

export default function ProfileTabs({
  data,
  isDoctor,
  isMedicalEntity,
  isOwner,
  showBookingsTab = false, // ✅ default false
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  teamSearchQuery,
  setTeamSearchQuery,
  teamFilter,
  setTeamFilter,
  filteredBookings,
  filteredTeam,
  uniqueSpecialties,
  onEditAbout,
  onUpdateDoctorSpecialist,
  onAddDoctor,
  onRemoveDoctor,
  onAddSpecialist,
  onRemoveSpecialist,
  onAddSchedule,
  onRemoveSchedule,
  onAddInsurance,
  onRemoveInsurance,
  onAddCertificate,
  onRemoveCertificate,
  onConfirmAppointment,
  onCompleteAppointment,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="bg-transparent border-b w-full justify-start gap-6 h-12 overflow-x-auto no-scrollbar">
        <TabsTrigger value="overview" className="modern-tab">
          Overview
        </TabsTrigger>
        {isMedicalEntity && (
          <TabsTrigger value="team" className="modern-tab">
            Team
          </TabsTrigger>
        )}
        {showBookingsTab && ( // ✅ Conditionally show Bookings tab
          <TabsTrigger value="bookings" className="modern-tab">
            Bookings
          </TabsTrigger>
        )}
        <TabsTrigger value="specialists" className="modern-tab">
          Specialists
        </TabsTrigger>
        {isDoctor && (
          <TabsTrigger value="schedule" className="modern-tab">
            Schedule
          </TabsTrigger>
        )}
        <TabsTrigger value="insurance" className="modern-tab">
          Insurance
        </TabsTrigger>
        <TabsTrigger value="certs" className="modern-tab">
          Certificates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-8">
        <OverviewTab data={data} isOwner={isOwner} onEditAbout={onEditAbout} />
      </TabsContent>

      {isMedicalEntity && (
        <TabsContent value="team" className="pt-8">
          <TeamTab
            data={data}
            isOwner={isOwner}
            teamSearchQuery={teamSearchQuery}
            setTeamSearchQuery={setTeamSearchQuery}
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            filteredTeam={filteredTeam}
            uniqueSpecialties={uniqueSpecialties}
            onAddDoctor={onAddDoctor}
            onRemoveDoctor={onRemoveDoctor}
          />
        </TabsContent>
      )}

      {showBookingsTab && ( // ✅ Conditionally render Bookings content
        <TabsContent value="bookings" className="pt-8">
          <BookingsTab
            stats={data.appointment_stats || {}}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredBookings={filteredBookings}
            isOwner={isOwner}
            onConfirmAppointment={onConfirmAppointment || (() => Promise.resolve())}
            onCompleteAppointment={onCompleteAppointment || (() => Promise.resolve())}
          />
        </TabsContent>
      )}

      <TabsContent value="specialists" className="pt-8">
        {isDoctor ? (
          <DoctorSpecialistEditor
            currentSpecialist={data.specialist?.name || ""}
            onUpdate={onUpdateDoctorSpecialist || (() => Promise.resolve())}
            isOwner={isOwner}
          />
        ) : (
          <SpecialistsTab
            specialists={data.specialists || []}
            isOwner={isOwner}
            onAddSpecialist={onAddSpecialist}
            onRemoveSpecialist={onRemoveSpecialist}
          />
        )}
      </TabsContent>

      {isDoctor && (
        <TabsContent value="schedule" className="pt-8">
          <ScheduleTab
            assignments={data.assignments || []}
            isOwner={isOwner}
            onAddSchedule={onAddSchedule}
            onRemoveSchedule={onRemoveSchedule}
          />
        </TabsContent>
      )}

      <TabsContent value="insurance" className="pt-8">
        <InsuranceTab
          insurances={data.insurance || []}
          isOwner={isOwner}
          onAddInsurance={onAddInsurance}
          onRemoveInsurance={onRemoveInsurance}
        />
      </TabsContent>

      <TabsContent value="certs" className="pt-8">
        <CertificatesTab
          certificates={data.certificates || []}
          isOwner={isOwner}
          onAddCertificate={onAddCertificate}
          onRemoveCertificate={onRemoveCertificate}
        />
      </TabsContent>
    </Tabs>
  );
}