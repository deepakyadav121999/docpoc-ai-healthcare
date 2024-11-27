"use client";
import React from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import ConfigTypes from "./ConfigTypes";

export default function ReminderConfiguration() {

  return (
    <Accordion selectionMode="multiple">
      <AccordionItem
        key="1"
        aria-label="WhatsApp Notifications"
        startContent={
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            src="images/others/whatsApp.png"
          />
        }
        subtitle="Enabled for 231 patients."
        title="WhatsApp Notifications"
      >
        <ConfigTypes buttons={["Medicine Reminder", "Patient Report", "Patient Invoice", "Birthday Wish", "Visit Confirmation"]}/>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="SMS Notifications"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="images/others/sms-big.png"
          />
        }
        subtitle="Enabled for 820 patients."
        title="SMS Notifications"
      >
        <ConfigTypes buttons={["Medicine Reminder", "Patient Report", "Patient Invoice", "Birthday Wish", "Visit Confirmation"]} />
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Email Notifications"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="https://static.vecteezy.com/system/resources/previews/010/872/860/original/3d-email-notification-icon-png.png"
          />
        }
        subtitle="Enabled for 1231 patients."
        title="Email Notifications"
      >
       <ConfigTypes buttons={["Medicine Reminder", "Birthday Wish"]} />
      </AccordionItem>
    </Accordion>
  );
}
