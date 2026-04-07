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

  // CURRENT USER
  getCurrentUser: async () => {
    const res = await api.get("/profile/");

    // handle both formats safely
    return res.data?.data || res.data;
  },

  // LOGOUT
  logout: async () => {
    await api.post("/logout/");
  }

};