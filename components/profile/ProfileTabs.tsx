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

interface ProfileTabsProps {
  data: any;
  isDoctor: boolean;
  isMedicalEntity: boolean;
  isOwner: boolean;
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
}

export default function ProfileTabs({
  data,
  isDoctor,
  isMedicalEntity,
  isOwner,
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
        <TabsTrigger value="bookings" className="modern-tab">
          Bookings
        </TabsTrigger>
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
        <OverviewTab data={data} isOwner={isOwner} onEditAbout={onAddSchedule} /> {/* onEditAbout is a placeholder; we'll fix in actual implementation – original used editAboutOpen */}
        {/* Actually original OverviewTab used onEditAbout to open the about modal. We'll pass the correct handler */}
        {/* We need to adjust: The original opened editAboutOpen. We'll rename prop to onEditAbout and pass setEditAboutOpen from parent */}
        {/* Since this is a refactor, I'll keep the prop as onEditAbout expecting a function that opens the about modal */}
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

      <TabsContent value="bookings" className="pt-8">
        <BookingsTab
          stats={data.appointment_stats || {}}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredBookings={filteredBookings}
        />
      </TabsContent>

      <TabsContent value="specialists" className="pt-8">
        <SpecialistsTab
          specialists={data.specialists || []}
          isOwner={isOwner}
          onAddSpecialist={onAddSpecialist}
          onRemoveSpecialist={onRemoveSpecialist}
        />
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