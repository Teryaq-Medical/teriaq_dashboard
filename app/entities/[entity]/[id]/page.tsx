"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Entities } from "@/services/api.services";
import { getImageUrl } from "@/lib/image";

// Import all new components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";

// Import modals
import EditBasicInfoModal from "@/components/profile/modals/EditBasicInfoModal";
import EditAboutModal from "@/components/profile/modals/EditAboutModal";
import AddDoctorModal from "@/components/profile/modals/AddDoctorModal";
import AddScheduleModal from "@/components/profile/modals/AddScheduleModal";
import AddInsuranceModal from "@/components/profile/modals/AddInsuranceModal";
import AddCertificateModal from "@/components/profile/modals/AddCertificateModal";

export default function UltraModernEntityProfile() {
  const params = useParams();
  const router = useRouter();
  const entityType = params?.entity as string;
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [editBasicInfoOpen, setEditBasicInfoOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [newDoctorId, setNewDoctorId] = useState("");
  const [newInsurance, setNewInsurance] = useState({ entity: "", status: "active" });
  const [newCertificate, setNewCertificate] = useState({ name: "", entity: "" });
  const [newSchedule, setNewSchedule] = useState({ day: "", start_time: "", end_time: "" });

  const normalizeEntityType = (type: string): string => {
    if (!type) return "";
    return type.endsWith('s') ? type.slice(0, -1) : type;
  };

  // Fetch entity data
  useEffect(() => {
    const fetchDetail = async () => {
      if (!entityType || !id) return;
      try {
        const result = await Entities.getEntityDetail(entityType, id);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch entity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [entityType, id, refreshTrigger]);

  // Fetch current user and check ownership
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
        console.log("🔍 Current user from /profile/:", user);
        console.log("🔍 URL entity type:", entityType);
        console.log("🔍 URL entity ID:", id);

        const userType = user?.user_type;
        const userEntityId = user?.entity_id;

        console.log("🔍 User type from backend:", userType);
        console.log("🔍 User entity ID from backend:", userEntityId);

        const normalizedUrlType = normalizeEntityType(entityType);
        const normalizedUserType = userType ? normalizeEntityType(userType) : null;

        console.log("🔍 Normalized URL type:", normalizedUrlType);
        console.log("🔍 Normalized user type:", normalizedUserType);

        if (
          user &&
          normalizedUserType &&
          normalizedUserType === normalizedUrlType &&
          String(userEntityId) === String(id)
        ) {
          setIsOwner(true);
          console.log("✅ User is OWNER");
        } else {
          setIsOwner(false);
          console.log("❌ User is NOT owner");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsOwner(false);
      }
    };
    fetchUser();
  }, [entityType, id]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // API placeholder functions (replace with actual endpoints)
  const updateBasicInfo = async (updatedData: any) => {
  try {
    await Entities.updateEntityBasicInfo(entityType, id, updatedData);
    setRefreshTrigger((prev) => prev + 1);
    setEditBasicInfoOpen(false);
  } catch (error) {
    console.error("Failed to update basic info:", error);
  }
};

  const updateAbout = async (about: string) => {
  try {
    await Entities.updateEntityAbout(entityType, id, about);
    setRefreshTrigger((prev) => prev + 1);
    setEditAboutOpen(false);
  } catch (error) {
    console.error("Failed to update about:", error);
  }
};

  const addDoctor = async (doctorData: any) => {
  try {
    console.log("📤 Calling API with data:", doctorData);
    const result = await Entities.addDoctorToEntity(entityType, id, doctorData);
    console.log("✅ API Response:", result);
    setRefreshTrigger((prev) => prev + 1);
    setAddDoctorOpen(false);
  } catch (error: any) {
    console.error("❌ Failed to add doctor:", error);
    console.error("Error response:", error.response?.data);
    alert(error.response?.data?.error || "Failed to add doctor. Please try again.");
  }
};



  const removeDoctor = async (assignmentId: string) => {
  try {
    await Entities.removeDoctorFromEntity(entityType, id, assignmentId);
    setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to remove doctor:", error);
  }
};


  const addSpecialist = async (name: string) => {
  try {
    await Entities.addSpecialist(entityType, id, name);
    setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to add specialist:", error);
  }
};


  const removeSpecialist = async (specialistId: string) => {
  try {
    await Entities.removeSpecialist(entityType, id, specialistId);
    setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to remove specialist:", error);
  }
};


  const addInsurance = async (insurance: any) => {
  try {
    await Entities.addInsurance(entityType, id, insurance);
    setRefreshTrigger((prev) => prev + 1);
    setEditingSection(null);
    setNewInsurance({ entity: "", status: "active" });
  } catch (error) {
    console.error("Failed to add insurance:", error);
  }
};

  const removeInsurance = async (insuranceId: string) => {
  try {
    await Entities.removeInsurance(entityType, id, insuranceId);
    setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to remove insurance:", error);
  }
};


  const addCertificate = async (cert: any) => {
  try {
    await Entities.addCertificate(entityType, id, cert);
    setRefreshTrigger((prev) => prev + 1);
    setEditingSection(null);
    setNewCertificate({ name: "", entity: "" });
  } catch (error) {
    console.error("Failed to add certificate:", error);
  }
};


  const removeCertificate = async (certId: string) => {
  try {
    await Entities.removeCertificate(entityType, id, certId);
    setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to remove certificate:", error);
  }
};


  const addSchedule = async (schedule: any) => {
    console.log("Add schedule", schedule);
    setRefreshTrigger((prev) => prev + 1);
  };
  const removeSchedule = async (scheduleId: string) => {
    console.log("Remove schedule", scheduleId);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-4 border-[#00B0D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-slate-400 font-bold">
        Profile data not found.
      </div>
    );
  }

  const isDoctor = entityType === "doctors";
  const isMedicalEntity = ["hospitals", "clincs", "labs"].includes(entityType);
  const displayName = data.name || data.full_name || data.user?.full_name || "Unnamed";
  const rating = data.rating ?? data.ratings ?? 0;
  const stats = data.appointment_stats || {
    total: 0, confirmed: 0, completed: 0, cancelled: 0, no_show: 0, bookings: [],
  };
  const profileImg = getImageUrl(
    isDoctor ? data.profile_image : data.image,
    isDoctor ? "doctor" : "entity"
  );

  const filteredBookings = (stats.bookings || []).filter((booking: any) => {
    const matchesStatus = activeFilter === "all" || booking.status === activeFilter;
    const matchesSearch =
      booking.booking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.assignment_display?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredTeam = (data.assignments || []).filter((asgn: any) => {
    const doctorName = asgn.doctor?.full_name?.toLowerCase() || "";
    const specialty = asgn.doctor?.specialist?.name?.toLowerCase() || "";
    const matchesSearch =
      doctorName.includes(teamSearchQuery.toLowerCase()) ||
      specialty.includes(teamSearchQuery.toLowerCase());
    const matchesType = teamFilter === "all" || specialty.includes(teamFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const uniqueSpecialties = Array.from(
    new Set((data.assignments || []).map((a: any) => a.doctor?.specialist?.name))
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* <ProfileHeader
          entityType={entityType}
          isOwner={isOwner}
          onEditBasicInfo={() => setEditBasicInfoOpen(true)}
          onLogout={handleLogout}
        /> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <ProfileSidebar
              data={data}
              isDoctor={isDoctor}
              displayName={displayName}
              rating={rating}
              profileImg={profileImg}
              isOwner={isOwner}
              onEditBasicInfo={() => setEditBasicInfoOpen(true)}
              onEditAbout={() => setEditAboutOpen(true)}
            />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ProfileStats stats={stats} rating={rating} />

            <ProfileTabs
              data={data}
              isDoctor={isDoctor}
              isMedicalEntity={isMedicalEntity}
              isOwner={isOwner}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              teamSearchQuery={teamSearchQuery}
              setTeamSearchQuery={setTeamSearchQuery}
              teamFilter={teamFilter}
              setTeamFilter={setTeamFilter}
              filteredBookings={filteredBookings}
              filteredTeam={filteredTeam}
              uniqueSpecialties={uniqueSpecialties}
              onAddDoctor={() => setAddDoctorOpen(true)}
              onRemoveDoctor={removeDoctor}
              onAddSpecialist={addSpecialist}
              onRemoveSpecialist={removeSpecialist}
              onAddSchedule={() => setEditingSection("schedule")}
              onRemoveSchedule={removeSchedule}
              onAddInsurance={() => setEditingSection("insurance")}
              onRemoveInsurance={removeInsurance}
              onAddCertificate={() => setEditingSection("certs")}
              onRemoveCertificate={removeCertificate}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditBasicInfoModal
        open={editBasicInfoOpen}
        onOpenChange={setEditBasicInfoOpen}
        displayName={displayName}
        data={data}
        onSave={updateBasicInfo}
      />
      <EditAboutModal
        open={editAboutOpen}
        onOpenChange={setEditAboutOpen}
        initialAbout={data.about?.bio_details || data.description || ""}
        onSave={updateAbout}
      />
      <AddDoctorModal
        open={addDoctorOpen}
        onOpenChange={setAddDoctorOpen}
        doctorId={newDoctorId}
        setDoctorId={setNewDoctorId}
        onAdd={addDoctor}
      />
      <AddScheduleModal
        open={editingSection === "schedule"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        schedule={newSchedule}
        setSchedule={setNewSchedule}
        onSave={addSchedule}
      />
      <AddInsuranceModal
        open={editingSection === "insurance"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        insurance={newInsurance}
        setInsurance={setNewInsurance}
        onSave={addInsurance}
      />
      <AddCertificateModal
        open={editingSection === "certs"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        certificate={newCertificate}
        setCertificate={setNewCertificate}
        onSave={addCertificate}
      />

      <style jsx global>{`
        .modern-tab {
          background: transparent !important;
          border-radius: 0 !important;
          font-weight: 800 !important;
          font-size: 0.7rem !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8 !important;
          border-bottom: 3px solid transparent !important;
          padding: 0 0 0.75rem 0 !important;
          transition: all 0.3s ease;
        }

        .modern-tab[data-state="active"] {
          color: #00b0d0 !important;
          border-bottom-color: #00b0d0 !important;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}