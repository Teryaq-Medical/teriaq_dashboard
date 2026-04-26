
import api from "./api";

export const DashboardService = {
  getStats: async () => {
    const res = await api.get("/dashboard/stats/");
    return {
      dashboard: res.data?.dashboard,
      data: res.data?.data,
    };
  },

  getChartData: async (
    type: "appointments" | "lab_bookings",
    range: string
  ) => {
    const endpoint =
      type === "appointments"
        ? "/dashboard/appointments-chart/"
        : "/dashboard/lab-bookings-chart/";

    const res = await api.get(`${endpoint}?range=${range}`);
    return res.data?.data ?? [];
  },
};

export const Entities = {
  getEntities: async (entity: string) => {
    try {
      const res = await api.get(`/dashboard/entities/${entity}/`);
      return res.data?.data ?? [];
    } catch {
      return [];
    }
  },

  getEntityDetail: async (entityType: string, id: string | number) => {
    try {
      const res = await api.get(
        `/dashboard/entities/${entityType}/${id}/`
      );

      const data = res.data?.data ?? res.data;

      return {
        ...data,
        specialists: data?.specialists ?? [],
        insurance: data?.insurance ?? [],
        certificates: data?.certificates ?? [],
        assignments: data?.assignments ?? [],
      };
    } catch {
      return null;
    }
  },

  createEntity: async (entityType: string, data: any) => {
    const res = await api.post(
      `/dashboard/entities/${entityType}/create/`,
      data
    );
    return res.data;
  },

  deleteEntity: async (entityType: string, id: string | number) => {
    const res = await api.delete(
      `/dashboard/entities/${entityType}/${id}/`
    );
    return res.data;
  },

  updateEntityBasicInfo: async (
    entityType: string,
    id: string | number,
    data: any
  ) => {
    const res = await api.put(
      `/entities/${entityType}/${id}/update/`,
      data
    );
    return res.data;
  },

  updateEntityAbout: async (
    entityType: string,
    id: string | number,
    aboutData: any
  ) => {
    const res = await api.put(
      `/entities/${entityType}/${id}/about/update/`,
      aboutData
    );
    return res.data;
  },

  // ========== INSURANCE MANAGEMENT ==========
  addInsurance: async (entityType: string, id: string | number, insuranceData: {
    entity: string;
    status: string;
  }) => {
    const res = await api.post(`/entities/${entityType}/${id}/insurance/add/`, insuranceData);
    return res.data;
  },

  removeInsurance: async (entityType: string, id: string | number, insuranceId: string | number) => {
    const res = await api.delete(`/entities/${entityType}/${id}/insurance/${insuranceId}/remove/`);
    return res.data;
  },

  // ========== CERTIFICATE MANAGEMENT ==========
  addCertificate: async (entityType: string, id: string | number, certificateData: {
    name: string;
    entity: string;
  }) => {
    const res = await api.post(`/entities/${entityType}/${id}/certificate/add/`, certificateData);
    return res.data;
  },

  removeCertificate: async (entityType: string, id: string | number, certId: string | number) => {
    const res = await api.delete(`/entities/${entityType}/${id}/certificate/${certId}/remove/`);
    return res.data;
  },

  // ========== SPECIALIST MANAGEMENT (Hospitals/Clinics only) ==========
  addSpecialist: async (entityType: string, id: string | number, specialistName: string) => {
    const res = await api.post(`/entities/${entityType}/${id}/specialist/add/`, { name: specialistName });
    return res.data;
  },

  removeSpecialist: async (entityType: string, id: string | number, specialistId: string | number) => {
    const res = await api.delete(`/entities/${entityType}/${id}/specialist/${specialistId}/remove/`);
    return res.data;
  },

  // ========== DOCTOR ASSIGNMENT MANAGEMENT (Hospitals/Clinics only) ==========
  addDoctorToEntity: async (entityType: string, id: string | number, doctorData: any) => {
    console.log("📤 Sending doctor data:", doctorData);
    const res = await api.post(`/entities/${entityType}/${id}/doctor/add/`, doctorData);
    return res.data;
  },

  removeDoctorFromEntity: async (entityType: string, id: string | number, assignmentId: string | number) => {
    const res = await api.delete(`/entities/${entityType}/${id}/doctor/${assignmentId}/remove/`);
    return res.data;
  },

  // ========== DOCTOR-SPECIFIC ENDPOINTS ==========
  updateDoctorSpecialist: async (doctorId: string | number, specialistName: string) => {
    const res = await api.put(`/doctors/${doctorId}/specialist/update/`, { name: specialistName });
    return res.data;
  },

  addDoctorSchedule: async (doctorId: string | number, scheduleData: {
    day: string;
    start_time: string;
    end_time: string;
    date?: string;
  }) => {
    const res = await api.post(`/doctors/${doctorId}/schedule/add/`, scheduleData);
    return res.data;
  },

  removeDoctorSchedule: async (doctorId: string | number, scheduleId: string | number) => {
    const res = await api.delete(`/doctors/${doctorId}/schedule/${scheduleId}/remove/`);
    return res.data;
  },

  updateDoctorSchedule: async (doctorId: string | number, scheduleId: string | number, scheduleData: {
    day?: string;
    start_time?: string;
    end_time?: string;
    date?: string;
  }) => {
    const res = await api.put(`/doctors/${doctorId}/schedule/${scheduleId}/update/`, scheduleData);
    return res.data;
  },

  addDoctorCertificate: async (doctorId: string | number, certificateData: {
    name: string;
    entity: string;
  }) => {
    const res = await api.post(`/doctors/${doctorId}/certificate/add/`, certificateData);
    return res.data;
  },

  removeDoctorCertificate: async (doctorId: string | number, certId: string | number) => {
    const res = await api.delete(`/doctors/${doctorId}/certificate/${certId}/remove/`);
    return res.data;
  },

  addDoctorInsurance: async (doctorId: string | number, insuranceData: {
    entity: string;
    status: string;
  }) => {
    const res = await api.post(`/doctors/${doctorId}/insurance/add/`, insuranceData);
    return res.data;
  },

  removeDoctorInsurance: async (doctorId: string | number, insuranceId: string | number) => {
    const res = await api.delete(`/doctors/${doctorId}/insurance/${insuranceId}/remove/`);
    return res.data;
  },

  // ========== APPOINTMENT MANAGEMENT ==========
  updateAppointmentStatus: async (appointmentId: string | number, status: string, bookingCode?: string) => {
    const payload: any = { status };
    if (bookingCode) {
      payload.booking_code = bookingCode;
    }
    const res = await api.patch(`/appointments/${appointmentId}/`, payload);
    return res.data;
  },

};