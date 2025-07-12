"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.API_URL;

interface ModernSigninProps {
  setAuthPage: () => void;
  onLogin: (token: string) => void;
}

const ModernSignin: React.FC<ModernSigninProps> = ({ onLogin }) => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [otpKey, setOtpKey] = useState(0);
  const [shouldClearOtp, setShouldClearOtp] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const currentOtpRef = useRef("");

  const timerCount = 30;

  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const profile = response.data;
      console.log("Fetched profile:", profile);
      return profile;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw new Error("Profile fetch failed");
    }
  };

  const sendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { phone: phoneNumber, username: phoneNumber };
      await axios.post(`${API_URL}/auth/otp/generate`, payload);

      setTimer(timerCount);
      setIsOtpSent(true);
      setOtpInputs(["", "", "", "", "", ""]);
      setActiveOtpIndex(0);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle mobile OTP auto-fill (when user taps the OTP from keyboard)
    if (value.length > 6) {
      // This is likely a mobile OTP auto-fill
      const otpDigits = value
        .slice(-6)
        .split("")
        .map((digit) => digit.replace(/\D/g, ""))
        .filter((digit) => digit !== "");
      if (otpDigits.length === 6) {
        setOtpInputs(otpDigits);
        setOtp(otpDigits.join(""));
        currentOtpRef.current = otpDigits.join("");
        setActiveOtpIndex(5); // Focus last input

        // Auto-submit after a short delay
        setTimeout(() => {
          verifyOtp();
        }, 100);
        return;
      }
    }

    // Regular single digit input
    if (value.length > 1) return; // Only allow single digit

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Auto-focus next input
    if (value && index < 5) {
      setActiveOtpIndex(index + 1);
      // Focus the next input
      setTimeout(() => {
        otpRefs.current[index + 1]?.focus();
      }, 0);
    }

    // Update OTP string
    const otpString = newOtpInputs.join("");
    setOtp(otpString);
    currentOtpRef.current = otpString;

    // Auto-submit when all 6 digits are entered
    if (otpString.length === 6) {
      setTimeout(() => {
        if (currentOtpRef.current.length === 6) {
          verifyOtp();
        }
      }, 100); // Small delay to ensure state is updated
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const otpDigits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (otpDigits.length === 6) {
      setOtpInputs(otpDigits);
      setOtp(otpDigits.join(""));
      currentOtpRef.current = otpDigits.join("");
      setActiveOtpIndex(5);

      // Auto-submit after a short delay
      setTimeout(() => {
        verifyOtp();
      }, 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      setActiveOtpIndex(index - 1);
      setTimeout(() => {
        otpRefs.current[index - 1]?.focus();
      }, 0);
    }
  };

  const verifyOtp = async () => {
    const otpToVerify = currentOtpRef.current || otp;
    if (otpToVerify.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        phone: phoneNumber,
        username: phoneNumber,
        otp: otpToVerify,
      };
      const response = await axios.post(`${API_URL}/auth/otp/verify`, payload);
      const { access_token } = response.data;

      if (access_token) {
        onLogin(access_token);
        await fetchProfile(access_token);
        localStorage.setItem("docPocAuth_token", access_token);
        router.push("/");
      } else {
        setError("Invalid or expired OTP.");
        setShouldClearOtp(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
      setShouldClearOtp(true);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;
    await sendOtp();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [timer]);

  // Clear OTP inputs when there's an error
  useEffect(() => {
    if (shouldClearOtp) {
      setOtpInputs(["", "", "", "", "", ""]);
      setOtp("");
      currentOtpRef.current = "";
      setActiveOtpIndex(0);
      setOtpKey((prev) => prev + 1);
      setShouldClearOtp(false);

      // Focus the first input after clearing
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
    }
  }, [shouldClearOtp]);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isOtpSent ? (
          <motion.div
            key="phone-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-medium">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/20 dark:focus:border-primary transition-all duration-300 group-hover:border-gray-300"
                  placeholder="Enter your phone number"
                  maxLength={10}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            {/* Send OTP Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={sendOtp}
              disabled={loading || !phoneNumber || phoneNumber.length < 10}
              className="relative w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:shadow-xl overflow-hidden group"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {loading ? (
                <div className="flex items-center relative z-10">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center relative z-10">
                  <motion.svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </motion.svg>
                  Send OTP
                </div>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Enter 6-digit OTP
              </label>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  We&apos;ve sent a verification code to +91 {phoneNumber}
                </p>
              </div>

              <div className="flex justify-between gap-3 mb-6" key={otpKey}>
                {otpInputs.map((digit, index) => (
                  <input
                    key={`${index}-${otpKey}`}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onFocus={() => setActiveOtpIndex(index)}
                    onPaste={(e) => handleOtpPaste(e)}
                    className={`w-14 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      activeOtpIndex === index
                        ? "border-primary ring-4 ring-primary/20 bg-primary/5"
                        : digit
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    } dark:bg-gray-800 dark:text-white`}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            {/* Verify OTP Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="relative w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:shadow-xl overflow-hidden group"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {loading ? (
                <div className="flex items-center relative z-10">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center relative z-10">
                  <motion.svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </motion.svg>
                  Verify OTP
                </div>
              )}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                onClick={resendOtp}
                disabled={timer > 0}
                className={`text-sm font-medium transition-colors duration-200 ${
                  timer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:text-primary/80 dark:text-primary/80 dark:hover:text-primary"
                }`}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>

            {/* Back to Phone */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsOtpSent(false);
                  setError("");
                  setOtp("");
                  setOtpInputs(["", "", "", "", "", ""]);
                }}
                className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to phone number
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSignin;
