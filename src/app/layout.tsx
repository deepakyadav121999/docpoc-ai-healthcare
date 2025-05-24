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

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
        router.push("/auth/signin");
      }
    } else {
      if (profile && !profile.branchId) {
        if (pathname !== "/settings") {
          router.push("/settings");
        }
      } else {
        if (pathname === "/auth/signin" || pathname === "/auth/signup") {
          router.push("/");
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
    <Provider store={store}>
      <AuthProvider>
        <RootLayout>{children}</RootLayout>
      </AuthProvider>
    </Provider>
  );
}
