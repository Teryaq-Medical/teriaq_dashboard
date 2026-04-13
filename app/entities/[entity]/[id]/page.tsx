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
  const [newInsurance, setNewInsurance] = useState({ entity: "", status: "عادية" });
  const [newCertificate, setNewCertificate] = useState({ name: "", entity: "" });
  const [newSchedule, setNewSchedule] = useState({ day: "", start_time: "", end_time: "" });

  const normalizeEntityType = (type: string): string => {
    if (!type) return "";
    return type.endsWith('s') ? type.slice(0, -1) : type;
  };

  const updateDoctorSpecialist = async (specialistName: string) => {
    try {
      await Entities.updateDoctorSpecialist(id, specialistName);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update doctor specialist:", error);
      alert("Failed to update specialization");
    }
  };

  const confirmAppointment = async (appointmentId: string) => {
    try {
      await Entities.updateAppointmentStatus(appointmentId, "confirmed");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      alert("Could not confirm appointment.");
    }
  };

  const completeAppointment = async (appointmentId: string, bookingCode: string) => {
    try {
      await Entities.updateAppointmentStatus(appointmentId, "completed", bookingCode);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to complete appointment:", error);
      alert("Invalid booking code or failed to complete.");
    }
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
        console.log("🔍 Current user:", user);

        const userType = user?.user_type;
        const userEntityId = user?.entity_id;

        const normalizedUrlType = normalizeEntityType(entityType);
        const normalizedUserType = userType ? normalizeEntityType(userType) : null;

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

  // Basic Info Update
  const updateBasicInfo = async (updatedData: any) => {
    try {
      await Entities.updateEntityBasicInfo(entityType, id, updatedData);
      setRefreshTrigger((prev) => prev + 1);
      setEditBasicInfoOpen(false);
    } catch (error) {
      console.error("Failed to update basic info:", error);
      alert("Failed to update basic information. Please try again.");
    }
  };

  // About Update
  const updateAbout = async (about: string) => {
    try {
      await Entities.updateEntityAbout(entityType, id, { bio_details: about });
      setRefreshTrigger((prev) => prev + 1);
      setEditAboutOpen(false);
    } catch (error) {
      console.error("Failed to update about:", error);
      alert("Failed to update about information. Please try again.");
    }
  };

  // Doctor Management
  const addDoctor = async (doctorData: any) => {
    try {
      console.log("📤 Calling API with data:", doctorData);
      const result = await Entities.addDoctorToEntity(entityType, id, doctorData);
      console.log("✅ API Response:", result);
      setRefreshTrigger((prev) => prev + 1);
      setAddDoctorOpen(false);
      setNewDoctorId("");
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
      alert("Failed to remove doctor. Please try again.");
    }
  };

  // Specialist Management
  const addSpecialist = async (name: string) => {
    try {
      if (entityType === "doctors") {
        await Entities.updateDoctorSpecialist(id, name);
      } else {
        await Entities.addSpecialist(entityType, id, name);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to add/update specialist:", error);
      alert("Failed to update specialist. Please try again.");
    }
  };

  const removeSpecialist = async (specialistId: string) => {
    try {
      if (entityType !== "doctors") {
        await Entities.removeSpecialist(entityType, id, specialistId);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to remove specialist:", error);
      alert("Failed to remove specialist. Please try again.");
    }
  };

  // Insurance Management
  const addInsurance = async (insurance: any) => {
    try {
      const statusMap: Record<string, string> = {
        'active': 'عادية',
        'full': 'تغطية كاملة',
        'standard': 'عادية',
        'partial': 'جزئية',
        'expired': 'منتهية'
      };
      let status = insurance.status || "عادية";
      if (statusMap[status]) status = statusMap[status];
      
      const insuranceData = { entity: insurance.entity, status };
      if (entityType === "doctors") {
        await Entities.addDoctorInsurance(id, insuranceData);
      } else {
        await Entities.addInsurance(entityType, id, insuranceData);
      }
      setRefreshTrigger((prev) => prev + 1);
      setEditingSection(null);
      setNewInsurance({ entity: "", status: "عادية" });
    } catch (error: any) {
      console.error("Failed to add insurance:", error);
      alert(error.response?.data?.details || "Failed to add insurance");
    }
  };

  const removeInsurance = async (insuranceId: string) => {
    try {
      if (entityType === "doctors") {
        await Entities.removeDoctorInsurance(id, insuranceId);
      } else {
        await Entities.removeInsurance(entityType, id, insuranceId);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      console.error("Failed to remove insurance:", error);
      alert(error.response?.data?.error || "Failed to remove insurance");
    }
  };

  // Certificate Management
  const addCertificate = async (cert: any) => {
    try {
      if (entityType === "doctors") {
        await Entities.addDoctorCertificate(id, cert);
      } else {
        await Entities.addCertificate(entityType, id, cert);
      }
      setRefreshTrigger((prev) => prev + 1);
      setEditingSection(null);
      setNewCertificate({ name: "", entity: "" });
    } catch (error) {
      console.error("Failed to add certificate:", error);
      alert("Failed to add certificate");
    }
  };

  const removeCertificate = async (certId: string) => {
    try {
      if (entityType === "doctors") {
        await Entities.removeDoctorCertificate(id, certId);
      } else {
        await Entities.removeCertificate(entityType, id, certId);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to remove certificate:", error);
      alert("Failed to remove certificate");
    }
  };

  // Schedule Management (Doctors only)
  const addSchedule = async (schedule: any) => {
    try {
      const scheduleWithDate = {
        ...schedule,
        date: schedule.date || new Date().toISOString().split('T')[0]
      };
      await Entities.addDoctorSchedule(id, scheduleWithDate);
      setRefreshTrigger((prev) => prev + 1);
      setEditingSection(null);
      setNewSchedule({ day: "", start_time: "", end_time: "", date: "" });
    } catch (error) {
      console.error("Failed to add schedule:", error);
      alert("Failed to add schedule");
    }
  };

  const removeSchedule = async (scheduleId: string) => {
    try {
      await Entities.removeDoctorSchedule(id, scheduleId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to remove schedule:", error);
      alert("Failed to remove schedule");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#00B0D0] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="p-10 text-center text-slate-400 font-bold">Profile data not found.</div>;

  const isDoctor = entityType === "doctors";
  const isMedicalEntity = ["hospitals", "clincs", "labs"].includes(entityType);
  const displayName = data.name || data.full_name || data.user?.full_name || "Unnamed";
  const rating = data.rating ?? data.ratings ?? 0;
  const stats = data.appointment_stats || { total: 0, confirmed: 0, completed: 0, cancelled: 0, no_show: 0, bookings: [] };
  const profileImg = getImageUrl(isDoctor ? data.profile_image : data.image, isDoctor ? "doctor" : "entity");

  const filteredBookings = (stats.bookings || []).filter((booking: any) => {
    const matchesStatus = activeFilter === "all" || booking.status === activeFilter;
    const matchesSearch = booking.booking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.assignment_display?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredTeam = (data.assignments || []).filter((asgn: any) => {
    const doctorObj = asgn.doctor || asgn.unregistered_doctor;
    if (!doctorObj) return false;
    const doctorName = doctorObj.full_name?.toLowerCase() || "";
    const specialty = doctorObj.specialist?.name?.toLowerCase() || "";
    const matchesSearch = doctorName.includes(teamSearchQuery.toLowerCase()) || specialty.includes(teamSearchQuery.toLowerCase());
    const matchesType = teamFilter === "all" || specialty.includes(teamFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const uniqueSpecialties = Array.from(new Set((data.assignments || []).map((a: any) => {
    const doc = a.doctor || a.unregistered_doctor;
    return doc?.specialist?.name;
  }).filter(Boolean)));

  // ✅ Show Bookings tab for owner OR admin/superuser/staff
  const showBookingsTab = isOwner || currentUser?.is_superuser || currentUser?.is_staff || currentUser?.user_type === "admin";
  console.log("🔍 showBookingsTab:", showBookingsTab, "isOwner:", isOwner, "is_superuser:", currentUser?.is_superuser, "is_staff:", currentUser?.is_staff, "user_type:", currentUser?.user_type);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProfileHeader entityType={entityType} isOwner={isOwner} onEditBasicInfo={() => setEditBasicInfoOpen(true)} onLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <ProfileSidebar data={data} isDoctor={isDoctor} displayName={displayName} rating={rating} profileImg={profileImg} isOwner={isOwner} onEditBasicInfo={() => setEditBasicInfoOpen(true)} onEditAbout={() => setEditAboutOpen(true)} />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ProfileStats stats={stats} rating={rating} />

            <ProfileTabs
              data={data}
              isDoctor={isDoctor}
              isMedicalEntity={isMedicalEntity}
              isOwner={isOwner}
              showBookingsTab={showBookingsTab}
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
              onEditAbout={() => setEditAboutOpen(true)}
              onUpdateDoctorSpecialist={updateDoctorSpecialist}
              onConfirmAppointment={confirmAppointment}
              onCompleteAppointment={completeAppointment}
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

      {/* Modals (unchanged) */}
      <EditBasicInfoModal open={editBasicInfoOpen} onOpenChange={setEditBasicInfoOpen} displayName={displayName} data={data} onSave={updateBasicInfo} />
      <EditAboutModal open={editAboutOpen} onOpenChange={setEditAboutOpen} initialAbout={data.about?.bio_details || data.description || ""} onSave={updateAbout} />
      <AddDoctorModal open={addDoctorOpen} onOpenChange={setAddDoctorOpen} onAdd={addDoctor} />
      <AddScheduleModal open={editingSection === "schedule"} onOpenChange={(open) => !open && setEditingSection(null)} schedule={newSchedule} setSchedule={setNewSchedule} onSave={addSchedule} />
      <AddInsuranceModal open={editingSection === "insurance"} onOpenChange={(open) => !open && setEditingSection(null)} insurance={newInsurance} setInsurance={setNewInsurance} onSave={addInsurance} />
      <AddCertificateModal open={editingSection === "certs"} onOpenChange={(open) => !open && setEditingSection(null)} certificate={newCertificate} setCertificate={setNewCertificate} onSave={addCertificate} />

      <style jsx global>{`
        .modern-tab { background: transparent !important; border-radius: 0 !important; font-weight: 800 !important; font-size: 0.7rem !important; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8 !important; border-bottom: 3px solid transparent !important; padding: 0 0 0.75rem 0 !important; transition: all 0.3s ease; }
        .modern-tab[data-state="active"] { color: #00b0d0 !important; border-bottom-color: #00b0d0 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}