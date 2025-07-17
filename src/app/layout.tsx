"use client";

import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import Loader from "@/components/common/Loader";
import SignUp from "./auth/signup/page";
import SignIn from "./auth/signin/page";
import ModernSignUp from "./auth-v2/signup/page";
import ModernSignIn from "./auth-v2/signin/page";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { fetchProfile, clearProfile } from "../store/slices/profileSlice";
import { RootState } from "../store";
import { AppDispatch } from "../store";
import { AuthProvider } from "@/components/auth-provider";
import { ChatProvider } from "@/components/Context/ChatContext";

// Auth Version Configuration
// Set to 'v1' for old auth pages, 'v2' for new modern auth pages
const AUTH_VERSION: "v1" | "v2" = "v2";

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
  const [redirecting, setRedirecting] = React.useState(false);

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
      const authRoutes =
        AUTH_VERSION === "v2"
          ? [
              "/auth-v2/signin",
              "/auth-v2/signup",
              "/auth/signin",
              "/auth/signup",
            ]
          : [
              "/auth/signin",
              "/auth/signup",
              "/auth-v2/signin",
              "/auth-v2/signup",
            ];

      if (!authRoutes.includes(pathname)) {
        const defaultRoute =
          AUTH_VERSION === "v2" ? "/auth-v2/signin" : "/auth/signin";
        router.push(defaultRoute);
      }
    } else {
      try {
        const profileJson = profile?.json ? JSON.parse(profile.json) : {};
        const hasDesignation = !!profileJson?.designation;

        if (!hasDesignation) {
          // FIRST check - Redirect to profile settings if designation is missing
          if (pathname !== "/pages/settings") {
            setRedirecting(true);
            router.push("/pages/settings");
          }
        } else if (!profile?.branchId) {
          // THEN check - Redirect to hospital setup if branchId is missing
          if (pathname !== "/settings") {
            setRedirecting(true);
            router.push("/settings");
          }
        } else {
          // Only when both exist, allow access to main app
          const authRoutes = [
            "/auth/signin",
            "/auth/signup",
            "/auth-v2/signin",
            "/auth-v2/signup",
          ];
          if (authRoutes.includes(pathname)) {
            router.push("/");
          }
        }
        setRedirecting(false);
      } catch (error) {
        console.error("Error parsing profile JSON", error);
        // If JSON parsing fails, treat it as missing designation
        if (pathname !== "/pages/settings") {
          setRedirecting(true);
          router.push("/pages/settings");
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, profile]);

  const handleLogin = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
    dispatch(fetchProfile());
  };

  if (isLoading || redirecting) {
    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <Loader />
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    // Handle v1 auth routes
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
    if (pathname === "/auth/signin") {
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

    // Handle v2 auth routes
    if (pathname === "/auth-v2/signup") {
      return (
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <ModernSignUp
              onLogin={handleLogin}
              setAuthPage={() => router.push("/auth-v2/signin")}
            />
          </body>
        </html>
      );
    }
    if (pathname === "/auth-v2/signin") {
      return (
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <ModernSignIn
              onLogin={handleLogin}
              setAuthPage={() => router.push("/auth-v2/signup")}
            />
          </body>
        </html>
      );
    }

    // Default route based on AUTH_VERSION
    const defaultComponent =
      AUTH_VERSION === "v2" ? (
        <ModernSignIn
          onLogin={handleLogin}
          setAuthPage={() => router.push("/auth-v2/signup")}
        />
      ) : (
        <SignIn
          onLogin={handleLogin}
          setAuthPage={() => router.push("/auth/signup")}
        />
      );

    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>{defaultComponent}</body>
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
