"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import SignUp from "./auth/signup";
import SignIn from "./auth/signin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUpPage, setIsSignUpPage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("docPocAuth_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const toggleAuthPage = () => {
    setIsSignUpPage((prev) => !prev);
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
    return (
      // <html lang="en">
      //   <body suppressHydrationWarning={true}>
      //     {isSignUpPage ? (
      //       <SignUp setAuthPage={toggleAuthPage} />
      //     ) : (
      //       <SignIn setAuthPage={toggleAuthPage} />
      //     )}
      //   </body>
      // </html>
      <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
    );
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
