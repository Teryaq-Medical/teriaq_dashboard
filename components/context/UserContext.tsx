"use client";

import * as React from "react";
import api from "@/services/api"; // your Axios instance

export type UserType = "admin" | "hospitals" | "clincs" | "labs" | "doctors";

export type User = {
  id: number;
  full_name: string;
  email: string;
  user_type: UserType;
  is_superuser: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

export const UserContext = React.createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const refreshUser = React.useCallback(async () => {
    try {
      const res = await api.get("/profile/"); // must return user_type & is_superuser
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}