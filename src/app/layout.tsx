"use client";
// import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import SignUp from "./auth/signup/page";
import SignIn from "./auth/signin/page";
import { usePathname, useRouter } from 'next/navigation'; 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const pathname = usePathname();  // Get the current pathname
  const router = useRouter();  // Get the router to perform redirection

  useEffect(() => {
    const token = localStorage.getItem("docPocAuth_token");
    if (token) {
      setIsAuthenticated(true);
    }
   
    setIsLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    // Redirect to sign-in if not authenticated and trying to access non-auth routes
    if (!isAuthenticated && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
      router.push('/auth/signin');  // Redirect to sign-in page
    }

    // Redirect to the main page after successful login
    if (isAuthenticated && pathname === '/auth/signin' || isAuthenticated && pathname === '/auth/signup' ) {
      router.push('/');  // Change '/main' to the appropriate main route in your app
    }
  }, [isAuthenticated, pathname, router]);



  const toggleAuthPage = () => {
    setIsSignUpPage((prev) => !prev);
  };

  const handleLogin = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
    setIsAuthenticated(true);  // Set authentication state to true after login
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
   const  signupfun =()=>{
    router.push("/auth/signin")
     }
  if (!isAuthenticated) {
    // Render the appropriate auth page based on the current route
    if (pathname === "/auth/signup") {
      return (
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <SignUp setAuthPage={signupfun}/>
          </body>
        </html>
      );
    }
    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <SignIn onLogin={handleLogin} setAuthPage={() => router.push("/auth/signup")} />
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
