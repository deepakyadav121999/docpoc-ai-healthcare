// components/Dashboard/ProfileContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set in your environment variables

interface Profile {
  id: string;
  branchId?: string;
  name?: string;
  email?: string;
  [key: string]: any; // Add more fields as required
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Function to fetch or refresh the profile
  const refreshProfile = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      setProfile(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      localStorage.setItem("profile", JSON.stringify(data)); // Update localStorage
      setProfile(data); // Update the state
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.removeItem("docPocAuth_token");
      setProfile(null);
    }
  };

  // Fetch profile when the component mounts
  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
