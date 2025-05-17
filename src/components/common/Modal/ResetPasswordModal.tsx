import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";

const API_URL = process.env.API_URL;
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({
    emailOrPhone: "", // Dynamic input for email or phone
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [errorMessage, setErrorMessage] = useState(""); // To show error messages
  const [passwordMismatchError, setPasswordMismatchError] = useState(""); // For mismatched passwords

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Reset step to 1
      setFormData({
        emailOrPhone: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      }); // Reset all form fields
      setErrorMessage("");
      setPasswordMismatchError("");
    }
  }, [isOpen]);
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Determine whether the input is email or phone
  const isEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Step 1: Generate OTP
  const handleGenerateOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = isEmail(formData.emailOrPhone)
        ? { email: formData.emailOrPhone, username: formData.emailOrPhone } // If it's an email
        : { phone: formData.emailOrPhone, username: formData.emailOrPhone }; // If it's a phone

      await axios.post(`${API_URL}/password/otp/generate`, payload);
      setStep(2); // Move to the next step
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to generate OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = isEmail(formData.emailOrPhone)
        ? {
            email: formData.emailOrPhone,
            username: formData.emailOrPhone,
            otp: formData.otp,
          }
        : {
            phone: formData.emailOrPhone,
            username: formData.emailOrPhone,
            otp: formData.otp,
          };

      await axios.post(`${API_URL}/password/otp/verify`, payload);
      setStep(3); // Move to the next step
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    setErrorMessage("");
    setPasswordMismatchError("");

    // Check if the passwords match before making the API call
    if (formData.newPassword !== formData.confirmNewPassword) {
      setPasswordMismatchError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const payload = isEmail(formData.emailOrPhone)
        ? {
            email: formData.emailOrPhone,
            username: formData.emailOrPhone,
            otp: formData.otp,
            password: formData.newPassword,
          }
        : {
            phone: formData.emailOrPhone,
            username: formData.emailOrPhone,
            otp: formData.otp,
            password: formData.newPassword,
          };

      await axios.post(`${API_URL}/password/reset`, payload);
      onClose(); // Close the modal after resetting the password
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Render the content based on the current step
  const renderContent = () => {
    switch (step) {
      case 1: // Step 1: Generate OTP
        return (
          <>
            <Input
              label="Email or Phone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Enter your email or phone"
              fullWidth
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </>
        );

      case 2: // Step 2: Verify OTP
        return (
          <>
            <Input
              label="OTP"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter the OTP sent to your email or phone"
              fullWidth
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </>
        );

      case 3: // Step 3: Reset Password
        return (
          <>
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              fullWidth
            />
            <Input
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              fullWidth
              style={{ marginTop: "10px" }}
            />
            {passwordMismatchError && (
              <p className="text-red-500">{passwordMismatchError}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </>
        );

      default:
        return null;
    }
  };

  // Handle footer buttons based on the current step
  const renderFooterButtons = () => {
    switch (step) {
      case 1: // Step 1: Generate OTP
        return (
          <Button
            onPress={handleGenerateOtp}
            color="primary"
            isDisabled={loading || !formData.emailOrPhone}
          >
            {loading ? "Generating OTP..." : "Generate OTP"}
          </Button>
        );

      case 2: // Step 2: Verify OTP
        return (
          <Button
            onPress={handleVerifyOtp}
            color="primary"
            isDisabled={loading || !formData.otp}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </Button>
        );

      case 3: // Step 3: Reset Password
        return (
          <Button
            onPress={handleResetPassword}
            color="primary"
            isDisabled={
              loading || !formData.newPassword || !formData.confirmNewPassword
            }
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop={"blur"}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        style={{
          maxWidth: 500,
          overflowY: "scroll",
          marginTop: "8%",
        }}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-50",
        }}
      >
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalBody>{renderContent()}</ModalBody>
          <ModalFooter>
            {renderFooterButtons()}
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              isDisabled={loading}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
