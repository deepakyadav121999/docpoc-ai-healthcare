"use client";

import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import SignUp from "./auth/signup/page";
import SignIn from "./auth/signin/page";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../store';
import { fetchProfile, clearProfile } from '../store/slices/profileSlice';
import { RootState } from '../store';
import { AppDispatch } from '../store';

const API_URL = process.env.API_URL;
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      const profile = useSelector((state: RootState) => state.profile.data);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Get the router to perform redirection
  // const [userProfile, setUserProfile] = useState<any>(null); // To store profile data
  const isAuthenticated = !!profile;
 const isLoading = useSelector((state: RootState) => state.profile.loading);


  // Check authentication and load profile from localStorage
  useEffect(() => {
    

        const validateToken = async () => {
      const token = localStorage.getItem("docPocAuth_token");

      if (token) {
         const token = localStorage.getItem("docPocAuth_token");
            if (token) {
              dispatch(fetchProfile());
            } else {
              dispatch(clearProfile());
            }
      }
    };

    validateToken();
  }, [pathname]);


  

  // Redirection based on authentication and profile data
  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to the sign-in page unless already on an auth route
    if (!isAuthenticated) {
      if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
        router.push("/auth/signin");
      }
    } else {
      // If authenticated, check profile and redirect accordingly
      if (profile) {
        if (!profile.branchId) {
          // Redirect to settings if branchId is missing
          if (pathname !== "/settings") {
            router.push("/settings");
          }
        } else {
          // Redirect to home if branchId is available and currently on an auth page
          if (pathname === "/auth/signin" || pathname === "/auth/signup") {
            router.push("/");
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, profile]);

  const toggleAuthPage = () => {
    setIsSignUpPage((prev) => !prev);
  };

  const handleLogin = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
     dispatch(fetchProfile());
    // setIsAuthenticated(true); // Set authentication state to true after login

    // Optionally fetch and store profile after login
    // const storedProfile = localStorage.getItem("profile");
    // if (storedProfile) {
    //   setUserProfile(JSON.parse(storedProfile));
    // }
  };

  const handleSignupComplete = (token: string) => {
    localStorage.setItem("docPocAuth_token", token);
    // setIsAuthenticated(true);

    const storedProfile = localStorage.getItem("profile");
  
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
    // Render the appropriate auth page based on the current route
    if (pathname === "/auth/signup") {
      return (
        <html lang="en">
          <body suppressHydrationWarning={true}>
            <SignUp onLogin={handleLogin} setAuthPage={() => router.push("/auth/signin")} />
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RootLayout>{children}</RootLayout>
    </Provider>
  );
}

















// "use client";

// import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
// import "@/css/style.css";
// import React, { useEffect } from "react";
// import Loader from "@/components/common/Loader";
// import SignUp from "./auth/signup/page";
// import SignIn from "./auth/signin/page";
// import { usePathname, useRouter } from "next/navigation";
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store } from '../store';
// import { fetchProfile, clearProfile } from '../store/slices/profileSlice';
// import { RootState } from '../store';
// import { AppDispatch } from '../store';

// function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const dispatch = useDispatch<AppDispatch>();
//   const pathname = usePathname();
//   const router = useRouter();
//   const profile = useSelector((state: RootState) => state.profile.data);
//   const isLoading = useSelector((state: RootState) => state.profile.loading);
//   const isAuthenticated = !!profile;

//   useEffect(() => {
//     const token = localStorage.getItem("docPocAuth_token");
//     if (token) {
//       dispatch(fetchProfile());
//     } else {
//       dispatch(clearProfile());
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (isLoading) return;

//     if (!isAuthenticated) {
//       if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
//         router.push("/auth/signin");
//       }
//     } else {
//       if (profile && !profile.branchId) {
//         if (pathname !== "/settings") {
//           router.push("/settings");
//         }
//       } else {
//         if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//           router.push("/");
//         }
//       }
//     }
//   }, [isAuthenticated, isLoading, pathname, router, profile]);

//   const handleLogin = (token: string) => {
//     localStorage.setItem("docPocAuth_token", token);
//     dispatch(fetchProfile());
//   };

//   if (isLoading) {
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <Loader />
//         </body>
//       </html>
//     );
//   }

//   if (!isAuthenticated) {
//     if (pathname === "/auth/signup") {
//       return (
//         <html lang="en">
//           <body suppressHydrationWarning={true}>
//             <SignUp onLogin={handleLogin} setAuthPage={() => router.push("/auth/signin")} />
//           </body>
//         </html>
//       );
//     }
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <SignIn onLogin={handleLogin} setAuthPage={() => router.push("/auth/signup")} />
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>{children}</body>
//     </html>
//   );
// }

// export default function AppLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       <RootLayout>{children}</RootLayout>
//     </Provider>
//   );
// }





// "use client";
// // import "jsvectormap/dist/css/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
// import "@/css/style.css";
// import React, { useEffect, useState } from "react";
// import Loader from "@/components/common/Loader";
// import SignUp from "./auth/signup/page";
// import SignIn from "./auth/signin/page";
// import { usePathname, useRouter } from 'next/navigation'; 
// import axios from "axios";
// const API_URL = process.env.API_URL;
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isSignUpPage, setIsSignUpPage] = useState(false);
//   const pathname = usePathname();  // Get the current pathname
//   const router = useRouter();  // Get the router to perform redirection
//   const [isProfileLoading, setIsProfileLoading] = useState(true); // Profile-specific loading state
//   const [userProfile, setUserProfile] = useState<any>(null); // To store profile data
//   useEffect(() => {
//     const token = localStorage.getItem("docPocAuth_token");
//     if (token) {
//       setIsAuthenticated(true);
//     }
   
//     setIsLoading(false);
//   }, [pathname, router]);

//   useEffect(() => {
//     if (isLoading) return;
//     // Redirect to sign-in if not authenticated and trying to access non-auth routes
//     if (!isAuthenticated) {
//       // Redirect unauthenticated users trying to access protected routes
//       if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
//         router.push("/auth/signin");
//       }
//     } else {
//       // Prevent redirecting authenticated users to '/' on page refresh
//       if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//         router.push("/");
//       }
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);



//   useEffect(() => {
//     const validateToken = async () => {
//       const token = localStorage.getItem("docPocAuth_token");

//       if (token) {
//         try {
//           // Call a backend endpoint to validate the token
//           const response = await axios.get(`${API_URL}/auth/profile`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           });

//           // localStorage.setItem("profile", JSON.stringify(response.data))
         

//           if (response) {
//             // If the token is valid, set the authenticated state to true
//             // setIsAuthenticated(true);
          
//             const data = await response.data
//             setUserProfile(data);
//             console.log(`Login response is coming: ${JSON.stringify(data, null, 2)}`)

        
//             setIsAuthenticated(true);
//             localStorage.setItem("profile", JSON.stringify(data));
//           } else {
//             // If the token is invalid, clear it from local storage
//             localStorage.removeItem("docPocAuth_token");
//             setIsAuthenticated(false);
//           }
//         } catch (error) {
//           console.error("Token validation failed:", error);
//           localStorage.removeItem("docPocAuth_token");
//           setIsAuthenticated(false);
//         }
//       }
//       setIsProfileLoading(false);
//       // setIsLoading(false);
//     };

//     validateToken();
//   }, [pathname, router]);

//   useEffect(() => {
//     if (isLoading || isProfileLoading) return;

//     // Redirect to sign-in if not authenticated and trying to access non-auth routes
//     if (!isAuthenticated) {
//       if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
//         router.push("/auth/signin");
//       }
//     } else {
//       // Prevent redirecting authenticated users to '/auth' routes
//       // if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//       //   router.push("/");

//       if (userProfile && !userProfile.branchId) {
//         router.push("/settings"); // No branchId -> redirect to settings
//       } else if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//         router.push("/"); // Authenticated users on auth pages -> redirect to home
//       }
//       }
//     }
//   , [isAuthenticated, isLoading, pathname, router,userProfile,isProfileLoading]);


//   // const retryFetch = async (
//   //   url: string,
//   //   options: RequestInit,
//   //   retries = 3,
//   //   delay = 1000
//   // ): Promise<Response> => {
//   //   try {
//   //     const response = await fetch(url, options);
  
//   //     // Check if the response indicates rate-limiting (status 429)
//   //     if (response.status === 429 && retries > 0) {
//   //       console.warn("Rate-limited. Retrying...");
//   //       await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
//   //       return retryFetch(url, options, retries - 1, delay * 2); // Exponential backoff
//   //     }
  
//   //     return response; // Return the response if successful
//   //   } catch (error) {
//   //     if (retries > 0) {
//   //       console.warn("Fetch failed. Retrying...");
//   //       await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
//   //       return retryFetch(url, options, retries - 1, delay * 2); // Retry on network failure
//   //     }
  
//   //     console.error("Failed after retries:", error);
//   //     throw error; // Rethrow the error if retries are exhausted
//   //   }
//   // };
  

//   // useEffect(() => {
//   //   const validateToken = async () => {
//   //     const token = localStorage.getItem("docPocAuth_token");
//   //     if (!token) {
//   //       setIsAuthenticated(false);
//   //       setIsLoading(false);
//   //       return;
//   //     }
  
//   //     try {
//   //       const response = await retryFetch(`${API_URL}/auth/profile`, {
//   //         method: "GET",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });
  
//   //       if (response.ok) {
//   //         const data = await response.json();
//   //         if (!data.branchId) {
//   //           router.push("/settings");
//   //         }
//   //         setIsAuthenticated(true);
//   //       } else {
//   //         localStorage.removeItem("docPocAuth_token");
//   //         setIsAuthenticated(false);
//   //       }
//   //     } catch (error) {
//   //       console.error("Token validation failed:", error);
//   //       localStorage.removeItem("docPocAuth_token");
//   //       setIsAuthenticated(false);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };
  
//   //   if (isLoading) validateToken();
//   // }, [isLoading, router]);
  
//   // useEffect(() => {
//   //   if (isLoading) return;
  
//   //   if (!isAuthenticated) {
//   //     if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
//   //       router.push("/auth/signin");
//   //     }
//   //   } else {
//   //     if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//   //       router.push("/");
//   //     }
//   //   }
//   // }, [isAuthenticated, isLoading, pathname, router]);
  


//   const toggleAuthPage = () => {
//     setIsSignUpPage((prev) => !prev);
//   };

//   const handleLogin = (token: string) => {
//     localStorage.setItem("docPocAuth_token", token);
//     setIsAuthenticated(true);  // Set authentication state to true after login
//   };

//   const handleSignupComplete =(token:string) =>{
//     localStorage.setItem("docPocAuth_token", token);
//     setIsAuthenticated(true);
//   }

//   if (isLoading) {
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <Loader />
//         </body>
//       </html>
//     );
//   }
//    const  signupfun =()=>{
//     router.push("/auth/signin")
//      }
//   if (!isAuthenticated) {
//     // Render the appropriate auth page based on the current route
//     if (pathname === "/auth/signup") {
//       return (
//         <html lang="en">
//           <body suppressHydrationWarning={true}>
//             <SignUp onLogin={handleLogin} setAuthPage={ signupfun}  />
//           </body>
//         </html>
//       );
//     }
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <SignIn onLogin={handleLogin} setAuthPage={() => router.push("/auth/signup")} />
//         </body>
//       </html>
//     );
//   }
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>{children}</body>
//     </html>
//   );
// }





// "use client";

// import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
// import "@/css/style.css";
// import React, { useEffect, useState } from "react";
// import Loader from "@/components/common/Loader";
// import SignUp from "./auth/signup/page";
// import SignIn from "./auth/signin/page";
// import { usePathname, useRouter } from "next/navigation";
// import axios from "axios";

// const API_URL = process.env.API_URL;
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isSignUpPage, setIsSignUpPage] = useState(false);
//   const pathname = usePathname(); // Get the current pathname
//   const router = useRouter(); // Get the router to perform redirection
//   const [userProfile, setUserProfile] = useState<any>(null); // To store profile data

//   // Check authentication and load profile from localStorage
//   useEffect(() => {
//     // const token = localStorage.getItem("docPocAuth_token");
//     // const storedProfile = localStorage.getItem("profile");

//     // if (token) {
//     //   setIsAuthenticated(true);

//     //   // Parse profile from localStorage
//     //   if (storedProfile) {
//     //     const parsedProfile = JSON.parse(storedProfile);
//     //     setUserProfile(parsedProfile);
//     //   }
//     // } else {
//     //   setIsAuthenticated(false);
//     // }

//     // setIsLoading(false);



//         const validateToken = async () => {
//       const token = localStorage.getItem("docPocAuth_token");

//       if (token) {
//         try {
//           // Call a backend endpoint to validate the token
//           const response = await axios.get(`${API_URL}/auth/profile`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           });

//           localStorage.setItem("profile", JSON.stringify(response.data))
         

//           if (response) {
//             // If the token is valid, set the authenticated state to true
//             // setIsAuthenticated(true);
          
//             const data = await response.data
//             setUserProfile(data);
//             console.log(`Login response is coming: ${JSON.stringify(data, null, 2)}`)

        
//             setIsAuthenticated(true);
//             localStorage.setItem("profile", JSON.stringify(data));
//           } else {
//             // If the token is invalid, clear it from local storage
//             localStorage.removeItem("docPocAuth_token");
//             setIsAuthenticated(false);
//           }
//         } catch (error) {
//           console.error("Token validation failed:", error);
//           localStorage.removeItem("docPocAuth_token");
//           setIsAuthenticated(false);
//         }
//       }
//       // setIsProfileLoading(false);
//       setIsLoading(false);
//     };

//     validateToken();
//   }, [pathname]);


  

//   // Redirection based on authentication and profile data
//   useEffect(() => {
//     if (isLoading) return;

//     // If not authenticated, redirect to the sign-in page unless already on an auth route
//     if (!isAuthenticated) {
//       if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
//         router.push("/auth/signin");
//       }
//     } else {
//       // If authenticated, check profile and redirect accordingly
//       if (userProfile) {
//         if (!userProfile.branchId) {
//           // Redirect to settings if branchId is missing
//           if (pathname !== "/settings") {
//             router.push("/settings");
//           }
//         } else {
//           // Redirect to home if branchId is available and currently on an auth page
//           if (pathname === "/auth/signin" || pathname === "/auth/signup") {
//             router.push("/");
//           }
//         }
//       }
//     }
//   }, [isAuthenticated, isLoading, pathname, router, userProfile]);

//   const toggleAuthPage = () => {
//     setIsSignUpPage((prev) => !prev);
//   };

//   const handleLogin = (token: string) => {
//     localStorage.setItem("docPocAuth_token", token);
//     setIsAuthenticated(true); // Set authentication state to true after login

//     // Optionally fetch and store profile after login
//     const storedProfile = localStorage.getItem("profile");
//     if (storedProfile) {
//       setUserProfile(JSON.parse(storedProfile));
//     }
//   };

//   const handleSignupComplete = (token: string) => {
//     localStorage.setItem("docPocAuth_token", token);
//     setIsAuthenticated(true);

//     const storedProfile = localStorage.getItem("profile");
//     if (storedProfile) {
//       setUserProfile(JSON.parse(storedProfile));
//     }
//   };

//   if (isLoading) {
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <Loader />
//         </body>
//       </html>
//     );
//   }

//   if (!isAuthenticated) {
//     // Render the appropriate auth page based on the current route
//     if (pathname === "/auth/signup") {
//       return (
//         <html lang="en">
//           <body suppressHydrationWarning={true}>
//             <SignUp onLogin={handleLogin} setAuthPage={() => router.push("/auth/signin")} />
//           </body>
//         </html>
//       );
//     }
//     return (
//       <html lang="en">
//         <body suppressHydrationWarning={true}>
//           <SignIn onLogin={handleLogin} setAuthPage={() => router.push("/auth/signup")} />
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>{children}</body>
//     </html>
//   );
// }



