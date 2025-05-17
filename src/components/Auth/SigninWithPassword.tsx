"use client";
import React, { useState } from "react";
import axios from "axios";
import StyledButton from "@/components/common/Button/StyledButton";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import ResetPasswordModal from "../common/Modal/ResetPasswordModal";
import { useDisclosure } from "@nextui-org/react";

const API_URL = process.env.API_URL;

interface SignInProps {
  // setAuthPage: () => void;
  onLogin: (token: string) => void;
}

const SigninWithPassword: React.FC<SignInProps> = ({
  // setAuthPage,
  onLogin,
}) => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password",
  );
  const [userInput, setUserInput] = useState(""); // Shared input field for email/mobile
  const [inputType, setInputType] = useState<"email" | "phone">("email"); // Determines the type of input
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isOtpFieldVisible, setIsOtpFieldVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordBoxType, setPasswordBoxType] = useState("password");
  const timerCount = 30;

  // Validate and detect the input type dynamically
  function handleInputChange(value: string) {
    setUserInput(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (emailRegex.test(value)) {
      setInputType("email");
    } else if (phoneRegex.test(value)) {
      setInputType("phone");
    } else {
      setInputType("email"); // Default to email
    }
  }

  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profile = response.data;
      // localStorage.setItem("profile", JSON.stringify(profile)); // Store profile in localStorage
      console.log("Fetched profile:", profile);
      return profile;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw new Error("Profile fetch failed");
    }
  };

  async function handleSignInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!userInput || !password) return;

    setLoading(true);
    setError("");

    try {
      const loginPayload =
        inputType === "email"
          ? { username: userInput, password }
          : { phone: userInput, password };

      const response = await axios.post(`${API_URL}/auth/login`, loginPayload);

      const { access_token } = response.data;

      if (access_token) {
        onLogin(access_token);
        localStorage.setItem("docPocAuth_token", access_token);
        await fetchProfile(access_token);
        router.push("/");
        // window.location.reload();
      } else {
        throw new Error("Invalid token received");
      }
    } catch (err) {
      setError(`Invalid email, phone, or password!${err}`);
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  }

  // Send OTP to email or phone
  async function sendOtp() {
    if (!userInput) {
      setError("Please enter a valid email or phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload =
        inputType === "email"
          ? { email: userInput, username: userInput } // Use email if detected as email
          : { phone: userInput, username: userInput }; // Use phone if detected as phone

      // const response = await axios.post(
      //   `${API_URL}/auth/otp/generate`,
      //   payload,
      // );
      await axios.post(`${API_URL}/auth/otp/generate`, payload);

      setTimer(timerCount);
      setIsOtpFieldVisible(true);
    } catch (err) {
      setError(`Failed to send OTP. Please try again.${err}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerification(event: React.FormEvent) {
    event.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // const payload =
      //   inputType === "email"
      //     ? { email: userInput, otp } // Use email if detected as email
      //     : { phone: userInput, otp }; // Use phone if detected as phone
      const payload =
        inputType === "email"
          ? { email: userInput, username: userInput, otp } // Use email if detected as email
          : { phone: userInput, username: userInput, otp };

      const response = await axios.post(`${API_URL}/auth/otp/verify`, payload);

      const { access_token } = response.data;

      if (access_token) {
        onLogin(access_token);
        // const profile = await fetchProfile(access_token);
        await fetchProfile(access_token);
        localStorage.setItem("docPocAuth_token", access_token);
        router.push("/");
        // window.location.reload();
      } else {
        setError("Invalid or expired OTP.");
      }
    } catch (err) {
      setError(`OTP verification failed. Please try again.${err}`);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [timer]);

  return (
    <div>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-dark dark:text-white">
          Sign In Method
        </label>

        <div className="flex gap-4">
          <button
            className={` w-full rounded-lg border p-3 font-medium ${loginMethod === "password" ? " border-primary" : "border-stroke"}`}
            onClick={() => setLoginMethod("password")}
          >
            Login with Password
          </button>
          <button
            className={`w-full rounded-lg border p-3 font-medium${loginMethod === "otp" ? " border-primary" : "border-stroke"}`}
            onClick={() => setLoginMethod("otp")}
          >
            Login with OTP
          </button>
        </div>
      </div>

      {loginMethod === "password" && (
        <form onSubmit={handleSignInWithPassword}>
          {error && <p className="text-red-600">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="userInput"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Email or Phone
            </label>
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                placeholder="Enter your email or phone number"
                required
              />
              <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.11756 2.979H12.8877C14.5723 2.97899 15.9066 2.97898 16.9509 3.11938C18.0256 3.26387 18.8955 3.56831 19.5815 4.25431C20.2675 4.94031 20.5719 5.81018 20.7164 6.8849C20.8568 7.92918 20.8568 9.26351 20.8568 10.9481V11.0515C20.8568 12.7362 20.8568 14.0705 20.7164 15.1148C20.5719 16.1895 20.2675 17.0594 19.5815 17.7454C18.8955 18.4314 18.0256 18.7358 16.9509 18.8803C15.9066 19.0207 14.5723 19.0207 12.8876 19.0207H9.11756C7.43295 19.0207 6.09861 19.0207 5.05433 18.8803C3.97961 18.7358 3.10974 18.4314 2.42374 17.7454C1.73774 17.0594 1.4333 16.1895 1.28881 15.1148C1.14841 14.0705 1.14842 12.7362 1.14844 11.0516V10.9481C1.14842 9.26351 1.14841 7.92918 1.28881 6.8849C1.4333 5.81018 1.73774 4.94031 2.42374 4.25431C3.10974 3.56831 3.97961 3.26387 5.05433 3.11938C6.09861 2.97898 7.43294 2.97899 9.11756 2.979ZM5.23755 4.48212C4.3153 4.60611 3.78396 4.83864 3.39602 5.22658C3.00807 5.61452 2.77554 6.14587 2.65155 7.06812C2.5249 8.01014 2.52344 9.25192 2.52344 10.9998C2.52344 12.7478 2.5249 13.9895 2.65155 14.9316C2.77554 15.8538 3.00807 16.3852 3.39602 16.7731C3.78396 17.161 4.3153 17.3936 5.23755 17.5176C6.17957 17.6442 7.42135 17.6457 9.16927 17.6457H12.8359C14.5839 17.6457 15.8256 17.6442 16.7677 17.5176C17.6899 17.3936 18.2213 17.161 18.6092 16.7731C18.9971 16.3852 19.2297 15.8538 19.3537 14.9316C19.4803 13.9895 19.4818 12.7478 19.4818 10.9998C19.4818 9.25192 19.4803 8.01014 19.3537 7.06812C19.2297 6.14587 18.9971 5.61452 18.6092 5.22658C18.2213 4.83864 17.6899 4.60611 16.7677 4.48212C15.8256 4.35546 14.5839 4.354 12.8359 4.354H9.16927C7.42135 4.354 6.17958 4.35546 5.23755 4.48212ZM4.97445 6.89304C5.21753 6.60135 5.65104 6.56194 5.94273 6.80502L7.92172 8.45418C8.77693 9.16685 9.37069 9.66005 9.87197 9.98246C10.3572 10.2945 10.6863 10.3993 11.0026 10.3993C11.3189 10.3993 11.648 10.2945 12.1332 9.98246C12.6345 9.66005 13.2283 9.16685 14.0835 8.45417L16.0625 6.80502C16.3542 6.56194 16.7877 6.60135 17.0308 6.89304C17.2738 7.18473 17.2344 7.61825 16.9427 7.86132L14.9293 9.5392C14.1168 10.2163 13.4582 10.7651 12.877 11.1389C12.2716 11.5285 11.6184 11.6993 11.0026 11.6993C10.3868 11.6993 9.7336 11.5285 9.12815 11.1389C8.547 10.7651 7.88838 10.2163 7.07588 9.5392L5.06252 7.86132C4.77082 7.61825 4.73137 7.18473 4.97445 6.89304Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordBoxType}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                placeholder="6+ Characters, 1 Capital letter"
                required
              />
              <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.2789 8.9998C16.5138 9.03442 16.7252 9.17135 16.8571 9.37854C17.3626 10.2027 17.752 11.2457 17.752 12.3533C17.752 15.1061 15.4552 17.3968 12.6095 17.3968C9.76373 17.3968 7.46692 15.1061 7.46692 12.3533C7.46692 11.2457 7.85631 10.2027 8.36184 9.37854C8.49378 9.17135 8.70519 9.03442 8.94013 8.9998C8.94161 8.78682 8.94189 8.569 8.94189 8.3518C8.94189 5.47701 10.6796 3.2998 12.6095 3.2998C14.5394 3.2998 16.2771 5.47701 16.2771 8.3518C16.2771 8.569 16.2774 8.78682 16.2789 8.9998ZM18.0539 9.99629C18.0541 9.93144 18.0542 9.86657 18.0542 9.8018C18.0542 5.98353 15.5772 3.0018 12.6095 3.0018C9.64174 3.0018 7.16481 5.98353 7.16481 9.8018C7.16481 9.86657 7.16489 9.93144 7.16501 9.99629C6.45262 10.8875 6.04303 11.9983 6.04303 13.1843C6.04303 16.2187 8.77579 18.6988 12.6095 18.6988C16.4432 18.6988 19.176 16.2187 19.176 13.1843C19.176 11.9983 18.7664 10.8875 18.0539 9.99629ZM12.6094 14.6498C13.5056 14.6498 14.2315 13.924 14.2315 13.0278C14.2315 12.1315 13.5056 11.4058 12.6094 11.4058C11.7132 11.4058 10.9873 12.1315 10.9873 13.0278C10.9873 13.924 11.7132 14.6498 12.6094 14.6498Z"
                  />
                </svg>
              </span>
              <div className="mb-5">
                <div className="flex items-center gap-2.5">
                  <input
                    style={{ height: 13, width: 13 }}
                    type="checkbox"
                    id="checkboxLabel_one"
                    className="h-5 w-5 accent-primary "
                    checked={showPassword}
                    onChange={(e) => {
                      setShowPassword(e.target.checked);
                      // showPassword == false
                      //   ? setPasswordBoxType("text")
                      //   : setPasswordBoxType("password");
                      if (showPassword === false) {
                        setPasswordBoxType("text");
                      } else {
                        setPasswordBoxType("password");
                      }
                    }}
                  />
                  <label
                    style={{ fontSize: 13 }}
                    htmlFor="checkboxLabel_one"
                    className="text-body-color dark:text-white"
                  >
                    Show password
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div>
              {!loading ? (
                <StyledButton
                  label={"Sign In"}
                  type={"submit"}
                  style={{ width: "100%" }}
                />
              ) : (
                <StyledButton
                  label={"Sign In"}
                  type={"submit"}
                  loading={true}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </div>
        </form>
      )}

      {loginMethod === "otp" && (
        <form onSubmit={handleOtpVerification}>
          {error && <p className="text-red-600">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="userInput"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Email or Phone
            </label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              placeholder="Enter your email or phone number"
              required
            />
          </div>

          {isOtpFieldVisible && (
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="mb-2.5 block font-medium text-dark dark:text-white"
              >
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                placeholder="Enter OTP"
              />
            </div>
          )}

          <StyledButton
            label={
              loading
                ? isOtpFieldVisible
                  ? "Verifying..."
                  : "Sending OTP..."
                : isOtpFieldVisible
                  ? "Verify OTP"
                  : "Send OTP"
            }
            type={isOtpFieldVisible ? "submit" : "button"}
            style={{ width: "100%" }}
            clickEvent={!isOtpFieldVisible ? sendOtp : undefined}
            loading={loading}
          />

          {isOtpFieldVisible && (
            <button
              type="button"
              disabled={timer > 0}
              onClick={sendOtp}
              className={`mt-3 w-full text-center p-2 ${
                timer > 0 ? "text-gray-500" : "text-blue-500"
              }`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          )}
        </form>
      )}

      <p className="text-center text-lg text-black dark:text-white">
        Forgot your password?{" "}
        {/* <Link href="/auth/forgotpassword" className="ml-1 text-primary">
        Click to reset
        </Link> */}
        <button onClick={() => onOpen()}> Click to reset</button>
      </p>

      <ResetPasswordModal isOpen={isOpen} onClose={() => onClose()} />
    </div>
  );
};
export default SigninWithPassword;

// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { AuthData, UserSignIn } from "@/api/auth";
// import StyledButton from "../common/Button/StyledButton";
// import axios from 'axios';
// import { useRouter } from "next/navigation";
// export default function SigninWithPassword({ setAuthPage, onLogin }: { setAuthPage: () => void; onLogin: (token: string) => void }) {
//   const router = useRouter();

//   const [data, setData] = useState({
//     remember: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordBoxType, setPasswordBoxType] = useState("password");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [remember, setRemember] = useState(false);
//   const [errors, setShowErrors] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSignIn(event: React.FormEvent) {
//     event.preventDefault();
//     if (!email || !password) return;

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('http://127.0.0.1:3037/DocPOC/v1/auth/login', {
//         username: email,
//         password: password,
//       });

//       const { access_token } = response.data;
//       // const token = "your_auth_token";
//       onLogin(access_token);
//       if (access_token && access_token.length > 5) {
//         localStorage.setItem("docPocAuth_token", access_token);
//         router.push("/")
//         window.location.reload();

//       }

//       else {
//         throw new Error('Invalid token received');
//       }
//     } catch (error) {
//       setError("Invalid email or password!");
//       setShowErrors(true);
//       setTimeout(() => {
//         setError("");
//         setShowErrors(false);
//       }, 8000);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const ErrorMessages = () => {
//     return (
//       <div className="flex gap-12">
//         <ul
//           className="mb-4 block font-medium text-dark dark:text-white"
//           style={{ color: "red" }}
//         >
//           <li>{error}</li>
//         </ul>
//       </div>
//     );
//   };

//   return (
//     <form method="post" onSubmit={handleSignIn}>
//       {errors && <ErrorMessages />}
//       <div className="mb-4">
//         <label
//           htmlFor="email"
//           className="mb-2.5 block font-medium text-dark dark:text-white"
//         >
//           Email
//         </label>
//         <div className="relative">
//           <input
//             value={email}
//             required={true}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             placeholder="Enter your email"
//             name="email"
//             className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
//           />

//           <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
//             <svg
//               className="fill-current"
//               width="22"
//               height="22"
//               viewBox="0 0 22 22"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M9.11756 2.979H12.8877C14.5723 2.97899 15.9066 2.97898 16.9509 3.11938C18.0256 3.26387 18.8955 3.56831 19.5815 4.25431C20.2675 4.94031 20.5719 5.81018 20.7164 6.8849C20.8568 7.92918 20.8568 9.26351 20.8568 10.9481V11.0515C20.8568 12.7362 20.8568 14.0705 20.7164 15.1148C20.5719 16.1895 20.2675 17.0594 19.5815 17.7454C18.8955 18.4314 18.0256 18.7358 16.9509 18.8803C15.9066 19.0207 14.5723 19.0207 12.8876 19.0207H9.11756C7.43295 19.0207 6.09861 19.0207 5.05433 18.8803C3.97961 18.7358 3.10974 18.4314 2.42374 17.7454C1.73774 17.0594 1.4333 16.1895 1.28881 15.1148C1.14841 14.0705 1.14842 12.7362 1.14844 11.0516V10.9481C1.14842 9.26351 1.14841 7.92918 1.28881 6.8849C1.4333 5.81018 1.73774 4.94031 2.42374 4.25431C3.10974 3.56831 3.97961 3.26387 5.05433 3.11938C6.09861 2.97898 7.43294 2.97899 9.11756 2.979ZM5.23755 4.48212C4.3153 4.60611 3.78396 4.83864 3.39602 5.22658C3.00807 5.61452 2.77554 6.14587 2.65155 7.06812C2.5249 8.01014 2.52344 9.25192 2.52344 10.9998C2.52344 12.7478 2.5249 13.9895 2.65155 14.9316C2.77554 15.8538 3.00807 16.3852 3.39602 16.7731C3.78396 17.161 4.3153 17.3936 5.23755 17.5176C6.17957 17.6442 7.42135 17.6457 9.16927 17.6457H12.8359C14.5839 17.6457 15.8256 17.6442 16.7677 17.5176C17.6899 17.3936 18.2213 17.161 18.6092 16.7731C18.9971 16.3852 19.2297 15.8538 19.3537 14.9316C19.4803 13.9895 19.4818 12.7478 19.4818 10.9998C19.4818 9.25192 19.4803 8.01014 19.3537 7.06812C19.2297 6.14587 18.9971 5.61452 18.6092 5.22658C18.2213 4.83864 17.6899 4.60611 16.7677 4.48212C15.8256 4.35546 14.5839 4.354 12.8359 4.354H9.16927C7.42135 4.354 6.17958 4.35546 5.23755 4.48212ZM4.97445 6.89304C5.21753 6.60135 5.65104 6.56194 5.94273 6.80502L7.92172 8.45418C8.77693 9.16685 9.37069 9.66005 9.87197 9.98246C10.3572 10.2945 10.6863 10.3993 11.0026 10.3993C11.3189 10.3993 11.648 10.2945 12.1332 9.98246C12.6345 9.66005 13.2283 9.16685 14.0835 8.45417L16.0625 6.80502C16.3542 6.56194 16.7877 6.60135 17.0308 6.89304C17.2738 7.18473 17.2344 7.61825 16.9427 7.86132L14.9293 9.5392C14.1168 10.2163 13.4582 10.7651 12.877 11.1389C12.2716 11.5285 11.6184 11.6993 11.0026 11.6993C10.3868 11.6993 9.7336 11.5285 9.12815 11.1389C8.547 10.7651 7.88838 10.2163 7.07588 9.5392L5.06252 7.86132C4.77082 7.61825 4.73137 7.18473 4.97445 6.89304Z"
//                 fill=""
//               />
//             </svg>
//           </span>
//         </div>
//       </div>

//       <div className="mb-4">
//         <label
//           htmlFor="password"
//           className="mb-2.5 block font-medium text-dark dark:text-white"
//         >
//           Password
//         </label>
//         <div className="relative">
//           <input
//             type={passwordBoxType}
//             placeholder="6+ Characters, 1 Capital letter"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
//           />
//           <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
//             <svg
//               className="fill-current"
//               width="22"
//               height="22"
//               viewBox="0 0 22 22"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M16.2789 8.9998C16.5138 9.03442 16.7252 9.17135 16.8571 9.37854C17.3626 10.2027 17.752 11.2457 17.752 12.3533C17.752 15.1061 15.4552 17.3968 12.6095 17.3968C9.76373 17.3968 7.46692 15.1061 7.46692 12.3533C7.46692 11.2457 7.85631 10.2027 8.36184 9.37854C8.49378 9.17135 8.70519 9.03442 8.94013 8.9998C8.94161 8.78682 8.94189 8.569 8.94189 8.3518C8.94189 5.47701 10.6796 3.2998 12.6095 3.2998C14.5394 3.2998 16.2771 5.47701 16.2771 8.3518C16.2771 8.569 16.2774 8.78682 16.2789 8.9998ZM18.0539 9.99629C18.0541 9.93144 18.0542 9.86657 18.0542 9.8018C18.0542 5.98353 15.5772 3.0018 12.6095 3.0018C9.64174 3.0018 7.16481 5.98353 7.16481 9.8018C7.16481 9.86657 7.16489 9.93144 7.16501 9.99629C6.45262 10.8875 6.04303 11.9983 6.04303 13.1843C6.04303 16.2187 8.77579 18.6988 12.6095 18.6988C16.4432 18.6988 19.176 16.2187 19.176 13.1843C19.176 11.9983 18.7664 10.8875 18.0539 9.99629ZM12.6094 14.6498C13.5056 14.6498 14.2315 13.924 14.2315 13.0278C14.2315 12.1315 13.5056 11.4058 12.6094 11.4058C11.7132 11.4058 10.9873 12.1315 10.9873 13.0278C10.9873 13.924 11.7132 14.6498 12.6094 14.6498Z"
//               />
//             </svg>
//           </span>
//           <div className="mb-5">
//             <div className="flex items-center gap-2.5">
//               <input
//                 style={{ height: 13, width: 13 }}
//                 type="checkbox"
//                 id="checkboxLabel_one"
//                 className="h-5 w-5 accent-primary "
//                 checked={showPassword}
//                 onChange={(e) => {
//                   setShowPassword(e.target.checked);
//                   showPassword == false
//                     ? setPasswordBoxType("text")
//                     : setPasswordBoxType("password");
//                 }}
//               />
//               <label
//                 style={{ fontSize: 13 }}
//                 htmlFor="checkboxLabel_one"
//                 className="text-body-color dark:text-white"
//               >
//                 Show password
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-5">
//         <div>
//         {!loading ? <StyledButton label={"Sign In"} type={"submit"} style={{width: '100%'}}/> : (<StyledButton  label={"Sign In"} type={"submit"} loading={true} style={{width: '100%'}} />)}
//         </div>
//       </div>

//       <p className="text-center text-lg text-black dark:text-white">
//         Forgot your Password?
//         <Link href="forgotpassword" className="ml-1 text-primary">
//           Click to reset
//         </Link>
//       </p>
//     </form>
//   );
// }
