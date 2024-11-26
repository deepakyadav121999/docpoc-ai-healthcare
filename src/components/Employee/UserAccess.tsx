"use client"
import React from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import UserAccessTypes from "./AccessTypes";

export default function UserAccess() {

  return (
    <Accordion selectionMode="multiple">
      <AccordionItem
        key="1"
        aria-label="Binu Bhagat"
        startContent={
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            src="images/user/user-female.jpg"
          />
        }
        subtitle="2 access provided"
        title="Binu Bhagat"
      >
        <UserAccessTypes />
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Avtar Singh"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="images/user/user-male.jpg"
          />
        }
        subtitle="Super Admin"
        title="Avtar Singh"
      >
        <UserAccessTypes />
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Bukun Sarkar"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="images/user/user-male.jpg"
          />
        }
        subtitle={
          <p className="flex">
            2 access provided
            <span className="text-primary ml-1">(2 pending request)</span>
          </p>
        }
        title="Bukun Sarkar"
      >
        <UserAccessTypes note="User has requested access for edit Patient, edit Payments & edit Reminders"/>
      </AccordionItem>
      <AccordionItem
        key="4"
        aria-label="Aman Jha"
        startContent={
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            src="images/user/user-female.jpg"
          />
        }
        subtitle="2 access provided"
        title="Aman Jha"
      >
        <UserAccessTypes />
      </AccordionItem>
      <AccordionItem
        key="5"
        aria-label="Soddi Singh"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="images/user/user-male.jpg"
          />
        }
        subtitle="Super Admin"
        title="Soddi Singh"
      >
       <UserAccessTypes />
      </AccordionItem>
    </Accordion>
  );
}
