// services/auth.service.ts

import api from "./api";

export const AuthService = {
  // LOGIN
  login: async (email: string, password: string) => {
    const res = await api.post("/login/", {
      email,
      password,
    });

    return res.data;
  },

  // CURRENT USER (FIXED ✅)
  getCurrentUser: async () => {
    try {
      const res = await api.get("/profile/");

      return res.data?.data || res.data;
    } catch (error: any) {
      // ✅ VERY IMPORTANT
      if (error.response?.status === 401) {
        return null; // ← THIS STOPS THE LOOP
      }

      throw error;
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await api.post("/logout/");
    } catch (error) {
      console.error("Logout failed");
    }
  },
};