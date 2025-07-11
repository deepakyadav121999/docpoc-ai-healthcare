"use client";
import React from "react";
// import GoogleSigninButton from "../GoogleSigninButton";
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
      {/* <GoogleSigninButton text="Sign in" onLogin={onLogin} /> */}

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Sign In With Mobile Otp
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword onLogin={onLogin} />
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
