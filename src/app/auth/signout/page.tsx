"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("docPocAuth_token");
    router.push("/");
    setTimeout(() => {
      window.location.reload();
      router.push("/")
    }, 100);
  }, [router]);
  router.push("/");
  return null;
};

export default SignoutPage;
