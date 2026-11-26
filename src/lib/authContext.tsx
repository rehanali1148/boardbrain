"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getDemoToken, UserProfile } from "./api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  roleKey: "student_10" | "student_09" | "teacher" | "campus_head";
  switchRole: (role: "student_10" | "student_09" | "teacher" | "campus_head", staffPin?: string) => Promise<void>;
  isExamLightMode: boolean;
  toggleExamLightMode: () => void;
  isLoading: boolean;
  /** False until the saved role has been restored, so guards don't act on the default role during a reload. */
  isReady: boolean;
}

const defaultUser: UserProfile = {
  erp_user_id: "NASRA-SAD-STD-10",
  full_name: "Areeba Tariq",
  role: "student",
  campus: "Saddar",
  class_grade: 10,
  section: "A",
  board: "BSEK",
  group_name: "Biology",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  token: null,
  roleKey: "student_10",
  switchRole: async () => {},
  isExamLightMode: false,
  toggleExamLightMode: () => {},
  isLoading: false,
  isReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [roleKey, setRoleKey] = useState<"student_10" | "student_09" | "teacher" | "campus_head">("student_10");
  const [isExamLightMode, setIsExamLightMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const PROFILES: Record<string, UserProfile> = {
    student_10: defaultUser,
    student_09: {
      erp_user_id: "NASRA-SAD-STD-09",
      full_name: "Hamza Siddiqui",
      role: "student",
      campus: "Saddar",
      class_grade: 9,
      section: "B",
      board: "AKU-EB",
      group_name: "Computer Science",
    },
    teacher: {
      erp_user_id: "NASRA-SAD-TCH-01",
      full_name: "Sir Farhan Ahmed",
      role: "teacher",
      campus: "Saddar",
      class_grade: 10,
      section: "A",
      board: "BSEK",
      group_name: "Science",
      subject: "Physics",
      sections: ["10-A", "10-B"],
    },
    campus_head: {
      erp_user_id: "NASRA-SAD-ADM-01",
      full_name: "Mrs. Nasreen Shah",
      role: "campus_head",
      campus: "Saddar",
      board: "BSEK",
    },
  };
  const isStaff = (r: string) => r === "teacher" || r === "campus_head";

  useEffect(() => {
    // Restore the saved session. Staff sessions are only restored when a signed staff token for that role is saved;
    // the server re-checks the signature on every teacher call.
    let savedRole: any = null;
    let savedToken: string | null = null;
    try {
      savedRole = localStorage.getItem("boardbrain_role");
      savedToken = localStorage.getItem("ustad_token");
    } catch {
      /* storage blocked */
    }
    const valid = ["student_10", "student_09", "teacher", "campus_head"];
    if (savedRole && isStaff(savedRole) && savedToken && new RegExp(`^demo_jwt_token_${savedRole}_\\d+_[a-f0-9]{32}$`).test(savedToken)) {
      setRoleKey(savedRole);
      setUser(PROFILES[savedRole]);
      setToken(savedToken);
      setIsReady(true);
      return;
    }
    const role = savedRole && valid.includes(savedRole) && !isStaff(savedRole) ? savedRole : "student_10";
    switchRole(role).finally(() => setIsReady(true));
  }, []);

  /**
   * Switch the active person. Staff roles need the staff PIN, checked by the server; on a wrong PIN nothing changes
   * and the error is thrown to the caller. Student roles never need a PIN.
   */
  const switchRole = async (newRole: "student_10" | "student_09" | "teacher" | "campus_head", staffPin?: string) => {
    setIsLoading(true);
    try {
      if (isStaff(newRole)) {
        const data = await getDemoToken(newRole, staffPin); // throws on a wrong or missing PIN
        setRoleKey(newRole);
        setUser(data.user || PROFILES[newRole]);
        setToken(data.access_token);
        try {
          localStorage.setItem("boardbrain_role", newRole);
          localStorage.setItem("ustad_token", data.access_token);
        } catch {
          /* storage blocked */
        }
        return;
      }
      setRoleKey(newRole);
      setUser(PROFILES[newRole]);
      try {
        localStorage.setItem("boardbrain_role", newRole);
        localStorage.removeItem("ustad_token");
      } catch {
        /* storage blocked */
      }
      try {
        const data = await getDemoToken(newRole);
        if (data && data.user) {
          setUser(data.user);
          setToken(data.access_token);
          localStorage.setItem("ustad_token", data.access_token);
        }
      } catch {
        /* offline: the local profile is enough for students */
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExamLightMode = () => {
    setIsExamLightMode((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roleKey,
        switchRole,
        isExamLightMode,
        toggleExamLightMode,
        isLoading,
        isReady,
      }}
    >
      <div className={isExamLightMode ? "bg-white text-black min-h-screen" : "bg-[#0B1120] text-slate-100 min-h-screen"}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
