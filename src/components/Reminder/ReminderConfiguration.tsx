"use client";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Checkbox,
  Spinner,
} from "@nextui-org/react";
import {
  getBranchNotificationSettings,
  updateBranchNotificationSetting,
  BranchNotificationSetting,
} from "@/api/doku";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;

// mapping from notificationType to a more readable label
const notificationTypeLabels: { [key: string]: string } = {
  general: "General",
  payment_receipt: "Payment Receipt",
  report_sharing: "Report Sharing",
  appointment_feedback: "Appointment Feedback",
  appointment_booking: "Appointment Booking",
  patient_bill: "Patient Bill",
  medicine_reminder: "Medicine Reminder",
};

const notificationDescriptions: { [key: string]: string } = {
  general: "Receive general announcements and updates from the clinic.",
  payment_receipt: "Get an instant digital receipt for all your payments.",
  report_sharing:
    "Notifications for when medical reports are ready and shared.",
  appointment_feedback: "A prompt to provide feedback after your appointments.",
  appointment_booking:
    "Confirmations and reminders for your scheduled appointments.",
  patient_bill: "Alerts for new bills and payment dues.",
  medicine_reminder: "Timely reminders for your prescribed medications.",
};

export default function ReminderConfiguration() {
  const [settings, setSettings] = useState<BranchNotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userProfile = useSelector((state: RootState) => state.profile.data);

  useEffect(() => {
    if (userProfile?.branchId) {
      const fetchSettings = async () => {
        try {
          setIsLoading(true);
          const data = await getBranchNotificationSettings(
            userProfile.branchId!,
            "whatsapp",
          );
          // The API returns medicine_reminder_template but the user wants to see Medicine Reminder
          const mappedData = data.map((d) =>
            d.notificationType === "medicine_reminder_template"
              ? { ...d, notificationType: "medicine_reminder" }
              : d,
          );
          setSettings(mappedData);
          setError(null);
        } catch (e) {
          setError("Failed to fetch notification settings.");
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSettings();
    }
  }, [userProfile]);

  const handleToggle = async (setting: BranchNotificationSetting) => {
    const originalSettings = [...settings];
    const updatedSettings = settings.map((s) =>
      s.id === setting.id ? { ...s, isEnabled: !s.isEnabled } : s,
    );
    setSettings(updatedSettings);

    try {
      await updateBranchNotificationSetting(setting.id, {
        ...setting,
        isEnabled: !setting.isEnabled,
      });
    } catch (error) {
      console.error("Failed to update setting:", error);
      setError("Failed to update setting. Please try again.");
      setSettings(originalSettings); // revert on error
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-40 items-center justify-center">
          <Spinner label="Loading settings..." />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-40 items-center justify-center">
          <p className="text-danger">{error}</p>
        </div>
      );
    }
    if (settings.length === 0) {
      return (
        <div className="flex h-40 items-center justify-center">
          <p>No WhatsApp notification settings found for this branch.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4 p-1">
        {settings
          .filter((setting) => notificationTypeLabels[setting.notificationType]) // Only show settings that have a label
          .map((setting) => (
            <div
              key={setting.id}
              className="rounded-lg border border-stroke bg-gray-2 p-4 transition-all hover:shadow-lg dark:border-stroke-dark dark:bg-gray-dark"
            >
              <Checkbox
                isSelected={setting.isEnabled}
                onValueChange={() => handleToggle(setting)}
                size="lg"
                classNames={{
                  wrapper: "self-start", // Aligns checkbox to the top
                }}
              >
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-gray-7 dark:text-gray-3">
                    {notificationTypeLabels[setting.notificationType] ||
                      setting.notificationType}
                  </span>
                  <p className="text-sm text-gray-6 dark:text-gray-4">
                    {notificationDescriptions[setting.notificationType]}
                  </p>
                </div>
              </Checkbox>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Accordion
      selectionMode="multiple"
      defaultExpandedKeys={["1"]}
      className="rounded-xl bg-white p-2 shadow-lg dark:bg-gray-dark"
    >
      <AccordionItem
        key="1"
        aria-label="WhatsApp Notifications"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src={`${AWS_URL}/docpoc-images/whatsapp.png`}
          />
        }
        title={
          <span className="font-bold text-gray-7 dark:text-white">
            WhatsApp Notifications
          </span>
        }
        subtitle={
          <span className="text-sm text-gray-6 dark:text-gray-4">
            Manage your WhatsApp notification preferences
          </span>
        }
      >
        {renderContent()}
      </AccordionItem>
    </Accordion>
  );
}
