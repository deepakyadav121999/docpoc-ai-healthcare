"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
// import { useEffect } from "react";
// import axios from "axios";

// const API_URL = process.env.API_URL;
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const [profile, setProfile] = useState<any>(null); // State to store profile data
  // const [isLoading, setIsLoading] = useState(true);

  // console.log("default layout is comming")
  // // Fetch profile from API
  // const fetchProfile = async () => {
  //   try {
  //     const token = localStorage.getItem("docPocAuth_token");
  //     if (!token) {
  //       throw new Error("User not authenticated");
  //     }

  //     const response = await axios.get(`${API_URL}/auth/profile`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //       const data = await response.data;
  //       const res = JSON.stringify(data, null, 2)
  //       setProfile( data?JSON.parse(res)  :null); // Store the profile in state

  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   } finally {
  //     setIsLoading(false); // Stop loading
  //   }
  // };

  // // Fetch profile when the component mounts
  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Star ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Star ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
              {/* {React.cloneElement(children as React.ReactElement, { profile })} */}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
