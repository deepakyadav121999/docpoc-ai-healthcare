import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

export const metadata: Metadata = {
  title: "Doku - Healthcare AI Assistant",
  description: "Your intelligent healthcare AI assistant for patient management, appointments, reports, and reminders.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="hidden" />
      </DefaultLayout>
    </>
  );
}
