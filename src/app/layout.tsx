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

const API_URL = process.env.API_URL;
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
    if (isLoading) return;
    // Redirect to sign-in if not authenticated and trying to access non-auth routes
    if (!isAuthenticated) {
      // Redirect unauthenticated users trying to access protected routes
      if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
        router.push("/auth/signin");
      }
    } else {
      // Prevent redirecting authenticated users to '/' on page refresh
      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);



  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("docPocAuth_token");

      if (token) {
        try {
          // Call a backend endpoint to validate the token
          const response = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // localStorage.setItem("profile", JSON.stringify(response.data));\
         

          if (response.ok) {
            // If the token is valid, set the authenticated state to true
            // setIsAuthenticated(true);
            
            const data = await response.json()
            console.log(`Login response is coming: ${JSON.stringify(data, null, 2)}`)

        
            setIsAuthenticated(true);
            localStorage.setItem("profile", JSON.stringify(data));
          } else {
            // If the token is invalid, clear it from local storage
            localStorage.removeItem("docPocAuth_token");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("docPocAuth_token");
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, [pathname, router]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to sign-in if not authenticated and trying to access non-auth routes
    if (!isAuthenticated) {
      if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
        router.push("/auth/signin");
      }
    } else {
      // Prevent redirecting authenticated users to '/auth' routes
      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  // const retryFetch = async (
  //   url: string,
  //   options: RequestInit,
  //   retries = 3,
  //   delay = 1000
  // ): Promise<Response> => {
  //   try {
  //     const response = await fetch(url, options);
  
  //     // Check if the response indicates rate-limiting (status 429)
  //     if (response.status === 429 && retries > 0) {
  //       console.warn("Rate-limited. Retrying...");
  //       await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
  //       return retryFetch(url, options, retries - 1, delay * 2); // Exponential backoff
  //     }
  
  //     return response; // Return the response if successful
  //   } catch (error) {
  //     if (retries > 0) {
  //       console.warn("Fetch failed. Retrying...");
  //       await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
  //       return retryFetch(url, options, retries - 1, delay * 2); // Retry on network failure
  //     }
  
  //     console.error("Failed after retries:", error);
  //     throw error; // Rethrow the error if retries are exhausted
  //   }
  // };
  

  // useEffect(() => {
  //   const validateToken = async () => {
  //     const token = localStorage.getItem("docPocAuth_token");
  //     if (!token) {
  //       setIsAuthenticated(false);
  //       setIsLoading(false);
  //       return;
  //     }
  
  //     try {
  //       const response = await retryFetch(`${API_URL}/auth/profile`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (!data.branchId) {
  //           router.push("/settings");
  //         }
  //         setIsAuthenticated(true);
  //       } else {
  //         localStorage.removeItem("docPocAuth_token");
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error("Token validation failed:", error);
  //       localStorage.removeItem("docPocAuth_token");
  //       setIsAuthenticated(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  
  //   if (isLoading) validateToken();
  // }, [isLoading, router]);
  
  // useEffect(() => {
  //   if (isLoading) return;
  
  //   if (!isAuthenticated) {
  //     if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
  //       router.push("/auth/signin");
  //     }
  //   } else {
  //     if (pathname === "/auth/signin" || pathname === "/auth/signup") {
  //       router.push("/");
  //     }
  //   }
  // }, [isAuthenticated, isLoading, pathname, router]);
  


  const toggleAuthPage = () => {
    setIsSignUpPage((prev) => !prev);
  };

  const handleLogin = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
    setIsAuthenticated(true);  // Set authentication state to true after login
  };

  const handleSignupComplete =(token:string) =>{
    localStorage.setItem("docPocAuth_token", token);
    setIsAuthenticated(true);
  }

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
            <SignUp onLogin={handleLogin} setAuthPage={ signupfun}  />
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
