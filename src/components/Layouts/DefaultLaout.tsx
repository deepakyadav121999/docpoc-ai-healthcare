"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Doku from "../DokuChat";
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
      <style jsx global>{`
        /* iPhone-specific scroll optimizations */
        @supports (-webkit-touch-callout: none) {
          html,
          body {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            overscroll-behavior: contain;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }

          * {
            -webkit-tap-highlight-color: transparent;
          }

          /* Optimize main content area */
          .main-content-area {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            will-change: scroll-position;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Star ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Star ===== --> */}
        <div className="main-content-area relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
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
      <Doku />
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
