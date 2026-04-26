import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/OverviewTab";
import TeamTab from "./tabs/TeamTab";
import BookingsTab from "./tabs/BookingsTab";
import SpecialistsTab from "./tabs/SpecialistsTab";
import ScheduleTab from "./tabs/ScheduleTab";
import InsuranceTab from "./tabs/InsuranceTab";
import CertificatesTab from "./tabs/CertificatesTab";
import DoctorSpecialistEditor from "./modals/DoctorSpecialistEditor";
import { useTranslations } from "next-intl";

// === Interface (must be present) ===
interface ProfileTabsProps {
  data: any;
  isDoctor: boolean;
  isLab?: boolean;
  showTeamTab?: boolean;
  isOwner: boolean;
  showBookingsTab?: boolean;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  teamSearchQuery: string;
  setTeamSearchQuery: (query: string) => void;
  teamFilter: string;
  setTeamFilter: (filter: string) => void;
  filteredBookings: any[];
  labBookings?: any[];
  filteredTeam: any[];
  uniqueSpecialties: string[];
  doctorAssignments?: any[];
  schedulesLoading?: boolean;
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

export default function ProfileTabs(props: ProfileTabsProps) {
  const t = useTranslations("profileTabs");

  // Destructure all props from props object
  const {
    data,
    isDoctor,
    isLab = false,
    showTeamTab = false,
    isOwner,
    showBookingsTab = false,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    teamSearchQuery,
    setTeamSearchQuery,
    teamFilter,
    setTeamFilter,
    filteredBookings,
    labBookings = [],
    filteredTeam,
    uniqueSpecialties,
    doctorAssignments = [],
    schedulesLoading = false,
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
  } = props;

  const bookings = isLab ? labBookings : filteredBookings;
  const labStats = isLab
    ? {
        total: labBookings.length,
        confirmed: labBookings.filter((b: any) => b.status === "confirmed").length,
        completed: labBookings.filter((b: any) => b.status === "completed").length,
        cancelled: labBookings.filter((b: any) => b.status === "cancelled").length,
        no_show: 0,
      }
    : data.appointment_stats || {};

  return (
    <Tabs defaultValue="overview">
      <TabsList className="bg-transparent border-b w-full justify-start gap-6 h-12 overflow-x-auto no-scrollbar">
        <TabsTrigger value="overview" className="modern-tab">
          {t("overview")}
        </TabsTrigger>
        {showTeamTab && (
          <TabsTrigger value="team" className="modern-tab">
            {t("team")}
          </TabsTrigger>
        )}
        {showBookingsTab && (
          <TabsTrigger value="bookings" className="modern-tab">
            {t("bookings")}
          </TabsTrigger>
        )}
        <TabsTrigger value="specialists" className="modern-tab">
          {t("specialists")}
        </TabsTrigger>
        {isDoctor && (
          <TabsTrigger value="schedule" className="modern-tab">
            {t("schedule")}
          </TabsTrigger>
        )}
        <TabsTrigger value="insurance" className="modern-tab">
          {t("insurance")}
        </TabsTrigger>
        <TabsTrigger value="certs" className="modern-tab">
          {t("certs")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-8">
        <OverviewTab data={data} isOwner={isOwner} onEditAbout={onEditAbout} />
      </TabsContent>

      {showTeamTab && (
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

      {showBookingsTab && (
        <TabsContent value="bookings" className="pt-8">
          <BookingsTab
            stats={labStats}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredBookings={bookings}
            isOwner={isOwner}
            onConfirmAppointment={
              onConfirmAppointment || (() => Promise.resolve())
            }
            onCompleteAppointment={
              onCompleteAppointment || (() => Promise.resolve())
            }
            isLab={isLab}
          />
        </TabsContent>
      )}

      <TabsContent value="specialists" className="pt-8">
        {isDoctor ? (
          <DoctorSpecialistEditor
            currentSpecialist={data.specialist?.name || ""}
            onUpdate={
              onUpdateDoctorSpecialist || (() => Promise.resolve())
            }
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
          {schedulesLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#00B0D0] border-t-transparent rounded-full animate-spin" />
              <p className="sr-only">{t("loading")}</p>
            </div>
          ) : (
            <ScheduleTab
              assignments={doctorAssignments}
              isOwner={isOwner}
              onAddSchedule={onAddSchedule}
              onRemoveSchedule={onRemoveSchedule}
            />
          )}
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