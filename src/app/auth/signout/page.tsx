"use client";
import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { store } from "@/store";

import { authState } from "@/lib/auth-state";
import { clearProfile } from "@/store/slices/profileSlice";
const SignoutPage = () => {
  // const router = useRouter();

  useEffect(() => {
    SignOut();
  }, []);

  async function SignOut() {
    try {
      // Set global sign-out state
      store.dispatch(clearProfile());
      authState.isSigningOut = true;

      // Clear local storage
      localStorage.removeItem("docPocAuth_token");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("profile");
      localStorage.clear(); // Clear everything to be sure

      // 3. Clear all cookies aggressively
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
      // Sign out from NextAuth
      await signOut({
        redirect: false,
      });

      // Force redirect
      // window.location.reload();
      // window.location.href = "/auth/login";
    } catch (error) {
      console.error("Sign out failed:", error);
      // window.location.href = "/auth/login";
    } finally {
      // Reset sign-out state after a delay
      setTimeout(() => {
        authState.isSigningOut = false;
      }, 1000);
    }
  }

  return null;
};

export default SignoutPage;
