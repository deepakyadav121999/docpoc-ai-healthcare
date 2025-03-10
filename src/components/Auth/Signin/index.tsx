"use client";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import StyledButton from "@/components/common/Button/StyledButton";
import Link from "next/link";

interface SignInProps {
  setAuthPage: () => void;
  onLogin: (token: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ setAuthPage, onLogin }) => {
  return (
    <>
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword setAuthPage={setAuthPage} onLogin={onLogin} />
      </div>

      <div className="mt-6 text-center">
        <p>Don’t have any account? </p>
        <Link href="/auth/signup">
          {" "}
          <StyledButton label={"Sign Up"} clickEvent={setAuthPage} />
        </Link>
      </div>
    </>
  );
};
export default SignIn;
