"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SignUpWithPassword from "../SignUpWithPassword";
import StyledButton from "@/components/common/Button/StyledButton";

export default function SignUp({setAuthPage}: {setAuthPage: any}) {

  return (
    <>
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign up with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SignUpWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have any account?{" "}
        </p>
       <Link href="/auth/signin"><StyledButton label={'Sign In'} clickEvent={setAuthPage}/></Link> 
      </div>
    </>
  );
}
