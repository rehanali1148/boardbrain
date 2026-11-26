"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getDemoToken, UserProfile } from "./api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  roleKey: "student_10" | "student_09" | "teacher" | "campus_head";
  switchRole: (role: "student_10" | "student_09" | "teacher" | "campus_head") => Promise<void>;
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

  useEffect(() => {
    // Restore the saved role. Never infer "teacher" from the URL: that let anyone open /teacher and become a teacher.
    let savedRole: any = null;
    try {
      savedRole = localStorage.getItem("boardbrain_role");
    } catch {
      /* storage blocked */
    }
    const role = savedRole && ["student_10", "student_09", "teacher", "campus_head"].includes(savedRole) ? savedRole : "student_10";
    switchRole(role).finally(() => setIsReady(true));
  }, []);

  const switchRole = async (newRole: "student_10" | "student_09" | "teacher" | "campus_head") => {
    setIsLoading(true);
    setRoleKey(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("boardbrain_role", newRole);
    }
    try {
      const data = await getDemoToken(newRole);
      if (data && data.user) {
        setUser(data.user);
        setToken(data.access_token);
        localStorage.setItem("ustad_token", data.access_token);
      }
    } catch (e) {
      console.warn("Using offline role state for:", newRole);
      const fallbackMap: Record<string, UserProfile> = {
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
      setUser(fallbackMap[newRole]);
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
