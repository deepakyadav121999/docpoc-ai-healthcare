"use client";

import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import Loader from "@/components/common/Loader";
import SignUp from "./auth/signup/page";
import SignIn from "./auth/signin/page";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { fetchProfile, clearProfile } from "../store/slices/profileSlice";
import { RootState } from "../store";
import { AppDispatch } from "../store";
import { AuthProvider } from "@/components/auth-provider";
import { ChatProvider } from "@/components/Context/ChatContext";

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.profile.data);
  const isLoading = useSelector((state: RootState) => state.profile.loading);
  const isAuthenticated = !!profile;

  useEffect(() => {
    const token = localStorage.getItem("docPocAuth_token");
    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(clearProfile());
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (isLoading) return;

  //   if (!isAuthenticated) {
  //     if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
  //       router.push("/auth/signin");
  //     }
  //   } else {
  //     if (profile && !profile.branchId) {
  //       if (pathname !== "/settings") {
  //         router.push("/settings");
  //       }
  //     } else {
  //       if (pathname === "/auth/signin" || pathname === "/auth/signup") {
  //         router.push("/");
  //       }
  //     }
  //   }
  // }, [isAuthenticated, isLoading, pathname, router, profile]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
        router.push("/auth/signin");
      }
    } else {
      try {
        const profileJson = profile?.json ? JSON.parse(profile.json) : {};
        const hasDesignation = !!profileJson?.designation;

        if (!hasDesignation) {
          // FIRST check - Redirect to profile settings if designation is missing
          if (pathname !== "/pages/settings") {
            router.push("/pages/settings");
          }
        } else if (!profile?.branchId) {
          // THEN check - Redirect to hospital setup if branchId is missing
          if (pathname !== "/settings") {
            router.push("/settings");
          }
        } else {
          // Only when both exist, allow access to main app
          if (pathname === "/auth/signin" || pathname === "/auth/signup") {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error parsing profile JSON", error);
        // If JSON parsing fails, treat it as missing designation
        if (pathname !== "/pages/settings") {
          router.push("/pages/settings");
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, profile]);

  const handleLogin = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
    dispatch(fetchProfile());
  };

  if (isLoading) {
    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <Loader />
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    if (pathname === "/auth/signup") {
      return (
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <SignUp
              onLogin={handleLogin}
              setAuthPage={() => router.push("/auth/signin")}
            />
          </body>
        </html>
      );
    }
    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <SignIn
            onLogin={handleLogin}
            setAuthPage={() => router.push("/auth/signup")}
          />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ChatProvider>
          <RootLayout>{children}</RootLayout>
        </ChatProvider>
      </Provider>
    </AuthProvider>
  );
}
