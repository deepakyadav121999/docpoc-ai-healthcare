"use client";
import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {useRouter } from "next/navigation";
// import { AuthData, UserSignIn, UserSignUp } from "@/api/auth";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Spinner, Button, Input } from "@nextui-org/react";

const placeholderOptions = ["1 to 3 members", "4 to 10 members", "11+ members"];
const API_URL = process.env.API_URL;

interface SignUpProps {
  setAuthPage: () => void; // Function to switch to the sign-in page
  onLogin: (token: string) => void; // Function to handle login after sign-up
}

const SignUp: React.FC<SignUpProps> = ({ 
  setAuthPage,
   onLogin }
) => {
  const [data, setData] = useState({
    remember: false,
    signUpMethod: "email",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordBoxType, setPasswordBoxType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInput, setUserInput] = useState(""); // Unified field for email/phone
  const [inputType, setInputType] = useState<"email" | "phone">("email");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [errors, setShowErrors] = useState(false);
  // const [countryCode] = useState("in");

  const [dropdownOption, setDropdownOption] = useState("");

  const [timer, setTimer] = useState(0);
  // const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningUp] = useState(false);

  // const [buttonText, setButtonText] = useState("Sign Up");
  const [buttonText] = useState("Sign Up");
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const router = useRouter();
  const timerCount = 30;

  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
  };
  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profile = response.data;
      localStorage.setItem("profile", JSON.stringify(profile)); // Store profile in localStorage
      console.log("Fetched profile:", profile);
      return profile;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw new Error("Profile fetch failed");
    }
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          // setButtonText(`Resend OTP in ${prev}s`);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleSignUp(event: { preventDefault: () => void }) {
    event.preventDefault();
    setError("");
    console.log("Sign-up function triggered");
    // Check if userInput is empty
    if (data.signUpMethod === "phone") {
      if (!userInput) {
        setError("Please enter a valid phone number or email.");
        console.log("Validation failed: No user input");
        return;
      }
    }

    // Validation for email/password sign-up method
    if (data.signUpMethod === "email") {
      if (!email) {
        setError("Please enter a valid email address.");
        console.log("Validation failed: No email");
        return;
      }
      if (!password) {
        setError("Please enter a valid password.");
        console.log("Validation failed: No password");
        return;
      }
    }

    // Check if dropdownOption (clinic size) is selected
    if (!dropdownOption) {
      setError("Please select a valid clinic size.");
      return;
    }
    if (data.signUpMethod === "phone") {
      try {
        setLoading(true);
        // Handle signUpMethod "phone" or "email"
        const payload =
          inputType === "email"
            ? { email: userInput.trim(), username: userInput.trim() } // If user input is email
            : { phone: userInput.trim(), username: userInput.trim() }; // If user input is phone

        // Call API for OTP generation
        const response = await axios.post(
          `${API_URL}/auth/otp/generate`,
          payload,
        );

        if (response.status === 200) {
          // Open OTP modal and start the resend timer
          setIsOtpModalOpen(true);
          startTimer();
        } else {
          setError("Failed to generate OTP. Please try again later.");
        }
      } catch (err: any) {
        console.error("Failed to generate OTP:", err);
        setError(
          err.response?.data?.message ||
            "Failed to generate OTP. Please try again later.",
        );
        setShowErrors(true);
      } finally {
        setLoading(false);
      }
    }
    if (data.signUpMethod === "email") {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/user`, {
          name: email.split("@")[0],
          email,
          user_type: "SUPER_ADMIN",
          password,
          accessType:
            '{"setAppointments":true,"messagePatient":true,"editDoctor":true}',
          json: JSON.stringify({ clinicSize: dropdownOption }),
          userName: email,
        });
        if (response.status === 201) {
          const signInResponse = await axios.post(`${API_URL}/auth/login`, {
            username: email,
            password,
          });
          const { access_token } = signInResponse.data;

          // const profileResponse = await fetch(`${API_URL}/auth/profile`, {
          //   method: "GET",
          //   headers: {
          //     "Content-Type": "application/json",
          //     Authorization: `Bearer ${access_token}`,
          //   },
          // });

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

          // if (access_token) {
          //   onLogin(access_token)
          //   localStorage.setItem("docPocAuth_token", access_token);

          //   router.push("/");
          //   // window.location.reload();
          // }
          // const profileData = await profileResponse.json();

          const profileData = await fetchProfile(access_token);

          if (profileData.branchId) {
            // If branchId exists, redirect to dashboard
            onLogin(access_token);
            localStorage.setItem("docPocAuth_token", access_token);

            router.push("/");
          } else {
            // If no branchId, redirect to settings
            onLogin(access_token);
            localStorage.setItem("docPocAuth_token", access_token);
            router.push("/settings");
          }
        }
      } catch (err: any) {
        console.error(
          "Signup failed",
          err.response.data.message[0].message || "Signup failed",
        );
        // setModalMessage({
        //   success: "",
        //   error: "Signup failed. Please check your details or try again later.",
        // });
        setError(`Signup failed. ${err.response.data.message[0].message}.`);
        setShowErrors(true);
        // onOpen();
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleResendOtp() {
    try {
      setLoading(true); // Start loading state
      setError(""); // Clear any previous errors

      // Prepare payload for OTP resend API
      const payload =
        inputType === "email"
          ? { email: userInput.trim(), username: userInput.trim() } // If user input is email
          : { phone: userInput.trim(), username: userInput.trim() }; // If user input is phone

      console.log("Resending OTP with payload:", payload);

      // Call the OTP resend API
      const response = await axios.post(
        `${API_URL}/auth/otp/generate`,
        payload,
      );

      if (response.status === 200) {
        console.log("OTP resent successfully");
        setTimer(timerCount); // Restart the timer
      } else {
        console.log("Failed to resend OTP");
        setError("Failed to resend OTP. Please try again later.");
      }
    } catch (err: any) {
      console.error("Resend OTP failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to resend OTP. Please try again later.",
      );
    } finally {
      setLoading(false); // End loading state
    }
  }

  async function handleOtpVerification() {
    try {
      setLoading(true);
      const payload =
        inputType === "email"
          ? { email: userInput, otp, username: userInput } // Use email if detected as email
          : { phone: userInput, otp, username: userInput };

      const response = await axios.post(`${API_URL}/auth/otp/verify`, payload);
      if (response.status === 200) {
        setIsOtpModalOpen(false);
        const { message, access_token } = response.data;
        if (access_token) {
          // localStorage.setItem("docPocAuth_token", access_token);
          // router.push("/");
          setModalMessage({
            success: "",
            error: "User Is Already Ragisterd Please Login",
          });
          onOpen();
        } else if (message.includes("Please create a password")) {
          setIsPasswordModalOpen(true); // Open password modal
        }
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setModalMessage({ success: "", error: "Invalid or expired OTP." });
      onOpen();
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSetup() {
    try {
      setLoading(true);
      const payload =
        inputType === "email"
          ? {
              email: userInput,
              username: userInput,
              otp,
              password,
              name: email.split("@")[0],
              user_type: "SUPER_ADMIN",
              accessType:
                '{"setAppointments":true,"messagePatient":true,"editDoctor":true}',
              json: JSON.stringify({ clinicSize: dropdownOption }),
            } // Use email if detected as email
          : {
              phone: userInput,
              username: userInput,
              otp,
              password,
              name: "public user",
              user_type: "SUPER_ADMIN",
              accessType:
                '{"setAppointments":true,"messagePatient":true,"editDoctor":true}',
              json: JSON.stringify({ clinicSize: dropdownOption }),
            };

      const response = await axios.post(
        `${API_URL}/auth/set-password`,
        payload,
      );
      if (response.status === 200) {
        const { access_token } = response.data;

        if (access_token) {
          onLogin(access_token);
          await fetchProfile(access_token);
          localStorage.setItem("docPocAuth_token", access_token);

          router.push("/");
          // window.location.reload();
        }
      }
    } catch (err) {
      console.error("Password setup failed:", err);
      setModalMessage({
        success: "",
        error: "Failed to set password. Please try again later.",
      });
      onOpen();
    } finally {
      setLoading(false);
    }
  }

  const ErrorMessages = () => (
    <div className="flex gap-12">
      <ul
        className="mb-4 block font-medium text-dark dark:text-white"
        style={{ color: "red" }}
      >
        <li>{error}</li>
      </ul>
    </div>
  );

  const startTimer = () => {
    setTimer(timerCount);
    // setButtonText(`Resend OTP in ${timerCount}s`);
  };

  return (
    <>
      <form method="post" onSubmit={handleSignUp}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-dark dark:text-white">
            Sign Up Method
          </label>
          {errors && <ErrorMessages />}
          <div className="flex gap-4">
            <button
              type="button"
              className={`w-full rounded-lg border p-3 font-medium ${data.signUpMethod === "email" ? "border-primary" : "border-stroke"}`}
              onClick={() => setData({ ...data, signUpMethod: "email" })}
            >
              Email & Password
            </button>
            <button
              type="button"
              className={`w-full rounded-lg border p-3 font-medium ${data.signUpMethod === "phone" ? "border-primary" : "border-stroke"}`}
              onClick={() => setData({ ...data, signUpMethod: "phone" })}
            >
              Email & Phone OTP
            </button>
          </div>
        </div>

        {data.signUpMethod === "email" && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2.5 block font-medium text-dark dark:text-white"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required={data.signUpMethod === "email"}
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
                      d="M9.11756 2.979H12.8877C14.5723 2.97899 15.9066 2.97898 16.9509 3.11938C18.0256 3.26387 18.8955 3.56831 19.5815 4.25431C20.2675 4.94031 20.5719 5.81018 20.7164 6.8849C20.8568 7.92918 20.8568 9.26351 20.8568 10.9481V11.0515C20.8568 12.7362 20.8568 14.0705 20.7164 15.1148C20.5719 16.1895 20.2675 17.0594 19.5815 17.7454C18.8955 18.4314 18.0256 18.7358 16.9509 18.8803C15.9066 19.0207 14.5723 19.0207 12.8876 19.0207H9.11756C7.43295 19.0207 6.09861 19.0207 5.05433 18.8803C3.97961 18.7358 3.10974 18.4314 2.42374 17.7454C1.73774 17.0594 1.4333 16.1895 1.28881 15.1148C1.14841 14.0705 1.14842 12.7362 1.14844 11.0516V10.9481C1.14842 9.26351 1.14841 7.92918 1.28881 6.8849C1.4333 5.81018 1.73774 4.94031 2.42374 4.25431C3.10974 3.56831 3.97961 3.26387 5.05433 3.11938C6.09861 2.97898 7.43294 2.97899 9.11756 2.979ZM5.23755 4.48212C4.3153 4.60611 3.78396 4.83864 3.39602 5.22658C3.00807 5.61452 2.77554 6.14587 2.65155 7.06812C2.5249 8.01014 2.52344 9.25192 2.52344 10.9998C2.52344 12.7478 2.5249 13.9895 2.65155 14.9316C2.77554 15.8538 3.00807 16.3851 3.39602 16.7731C3.78396 17.1611 4.3153 17.3936 5.23755 17.5176C6.17957 17.6442 7.42136 17.6456 9.16932 17.6456H12.8359C14.5838 17.6456 15.8256 17.6442 16.7676 17.5176C17.6899 17.3936 18.2212 17.1611 18.6092 16.7731C18.9971 16.3851 19.2297 15.8538 19.3537 14.9316C19.4803 13.9895 19.4817 12.7478 19.4817 10.9998C19.4817 9.25192 19.4803 8.01014 19.3537 7.06812C19.2297 6.14587 18.9971 5.61452 18.6092 5.22658C18.2212 4.83864 17.6899 4.60611 16.7676 4.48212C15.8256 4.35547 14.5838 4.35401 12.8359 4.35401H9.16932C7.42136 4.35401 6.17957 4.35547 5.23755 4.48212ZM12.0022 11.0001L17.7172 6.21275L18.428 6.97529L11.5011 12.5025L4.5742 6.97529L5.28502 6.21275L11.0001 11.0001H11.0043L11.5009 11.4014L12.0022 11.0001Z"
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
                  placeholder="6+ Characters, 1 Capital letter"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required={data.signUpMethod === "email"}
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
                      className="h-5 w-5 accent-primary"
                      checked={showPassword}
                      onChange={(e) => {
                        setShowPassword(e.target.checked);
                        setPasswordBoxType(
                          e.target.checked ? "text" : "password",
                        );
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
          </div>
        )}

        {data.signUpMethod === "phone" && (
          <div>
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
                  placeholder="Enter your email or phone number"
                  name="userInput"
                  value={userInput}
                  onChange={(e) => {
                    const input = e.target.value.trim();
                    setUserInput(input);

                    // Determine input type based on user input
                    if (/^\d+$/.test(input)) {
                      // Input contains only numbers
                      setInputType("phone");
                      setPhone(input);
                      setEmail(""); // Clear email value
                    } else {
                      // Input contains alphanumeric characters or is email-like
                      setInputType("email");
                      setEmail(input);
                      setPhone(""); // Clear phone value
                    }
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
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
                      d="M9.11756 2.979H12.8877C14.5723 2.97899 15.9066 2.97898 16.9509 3.11938C18.0256 3.26387 18.8955 3.56831 19.5815 4.25431C20.2675 4.94031 20.5719 5.81018 20.7164 6.8849C20.8568 7.92918 20.8568 9.26351 20.8568 10.9481V11.0515C20.8568 12.7362 20.8568 14.0705 20.7164 15.1148C20.5719 16.1895 20.2675 17.0594 19.5815 17.7454C18.8955 18.4314 18.0256 18.7358 16.9509 18.8803C15.9066 19.0207 14.5723 19.0207 12.8876 19.0207H9.11756C7.43295 19.0207 6.09861 19.0207 5.05433 18.8803C3.97961 18.7358 3.10974 18.4314 2.42374 17.7454C1.73774 17.0594 1.4333 16.1895 1.28881 15.1148C1.14841 14.0705 1.14842 12.7362 1.14844 11.0516V10.9481C1.14842 9.26351 1.14841 7.92918 1.28881 6.8849C1.4333 5.81018 1.73774 4.94031 2.42374 4.25431C3.10974 3.56831 3.97961 3.26387 5.05433 3.11938C6.09861 2.97898 7.43294 2.97899 9.11756 2.979ZM5.23755 4.48212C4.3153 4.60611 3.78396 4.83864 3.39602 5.22658C3.00807 5.61452 2.77554 6.14587 2.65155 7.06812C2.5249 8.01014 2.52344 9.25192 2.52344 10.9998C2.52344 12.7478 2.5249 13.9895 2.65155 14.9316C2.77554 15.8538 3.00807 16.3851 3.39602 16.7731C3.78396 17.1611 4.3153 17.3936 5.23755 17.5176C6.17957 17.6442 7.42136 17.6456 9.16932 17.6456H12.8359C14.5838 17.6456 15.8256 17.6442 16.7676 17.5176C17.6899 17.3936 18.2212 17.1611 18.6092 16.7731C18.9971 16.3851 19.2297 15.8538 19.3537 14.9316C19.4803 13.9895 19.4817 12.7478 19.4817 10.9998C19.4817 9.25192 19.4803 8.01014 19.3537 7.06812C19.2297 6.14587 18.9971 5.61452 18.6092 5.22658C18.2212 4.83864 17.6899 4.60611 16.7676 4.48212C15.8256 4.35547 14.5838 4.35401 12.8359 4.35401H9.16932C7.42136 4.35401 6.17957 4.35547 5.23755 4.48212ZM12.0022 11.0001L17.7172 6.21275L18.428 6.97529L11.5011 12.5025L4.5742 6.97529L5.28502 6.21275L11.0001 11.0001H11.0043L11.5009 11.4014L12.0022 11.0001Z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Additional fields like OTP input can go here */}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-dark dark:text-white">
            Clinic Size
          </label>
          <select
            value={dropdownOption}
            onChange={(e) => setDropdownOption(e.target.value)}
            required
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="" disabled>
              Select Clinic Size
            </option>
            {placeholderOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            // disabled={timer > 0}
            className="w-full font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary rounded-lg bg-primary py-4 px-6  text-gray hover:bg-opacity-90"
          >
            {isSigningUp && data.signUpMethod === "email" ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </form>

      {/* OTP Modal */}
      {/* <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h4>Enter OTP</h4>
          </ModalHeader>
          <ModalBody>
            <Input
              // clearable
              // bordered
              label="Enter OTP"
              placeholder="6-digit OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            /> */}
      {/* </ModalBody>
          <ModalFooter>
            <Button
              // auto
              disabled={loading}
              onPress={handleOtpVerification}
              color="primary"
            >
              {loading ? <Spinner size="lg" /> : "Verify OTP"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h4>Enter OTP</h4>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Enter OTP"
              placeholder="6-digit OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            {/* Resend OTP Button */}
            <div className="mt-4 flex items-center gap-2">
              <p className="text-gray-500 text-sm">
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Didn't receive the OTP?"}
              </p>
              <button
                disabled={timer > 0 || loading}
                onClick={handleResendOtp}
                className="text-blue underline"
              >
                Resend OTP
              </button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loading}
              onPress={handleOtpVerification}
              color="primary"
            >
              {loading ? <Spinner size="lg" /> : "Verify OTP"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Password Setup Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h4>Set Your Password</h4>
          </ModalHeader>
          <ModalBody>
            <Input
              // bordered
              label="Password"
              placeholder="Enter a secure password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              // auto
              disabled={loading}
              onPress={handlePasswordSetup}
              color="primary"
            >
              {loading ? <Spinner size="lg" /> : "Set Password"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* General Error/Success Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>
            {loading ? (
              <Spinner size="lg" />
            ) : modalMessage.success ? (
              <p className="text-green-600">Success</p>
            ) : (
              <p className="text-red-600">Error</p>
            )}
          </ModalHeader>
          <ModalBody>
            {loading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : modalMessage.success ? (
              <p className="text-green-600">{modalMessage.success}</p>
            ) : (
              <p className="text-red-600">{modalMessage.error}</p>
            )}
          </ModalBody>
          <ModalFooter>
            {!loading && (
              <Button color="primary" onPress={handleModalClose}>
                Ok
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SignUp;

// async function handleEmailSignUp() {
//   try {
//     setLoading(true);
//     const response = await axios.post(`${API_URL}/user`, {
//       name: email.split("@")[0],
//       email,
//       password,
//       accessType: "defaultAccessType",
//       json: JSON.stringify({ clinicSize: dropdownOption }),
//       userName: email,
//     });
//     if (response.status === 201) {
//       const signInResponse = await axios.post(`${API_URL}/auth/login`, {
//         username: email,
//         password,
//       });
//       const { access_token } = signInResponse.data;
//       if (access_token) {
//         localStorage.setItem("docPocAuth_token", access_token);
//         router.push("/");
//       }
//     }
//   } catch (err) {
//     console.error("Signup failed", err);
//     // setModalMessage({
//     //   success: "",
//     //   error: "Signup failed. Please check your details or try again later.",
//     // });
//     setError("Signup failed. Please check your details or try again later.")
//     setShowErrors(true)
//     // onOpen();
//   } finally {
//     setLoading(false);
//   }
// }
