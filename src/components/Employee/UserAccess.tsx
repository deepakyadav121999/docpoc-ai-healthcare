"use client";
import React, { useEffect } from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import UserAccessTypes from "./AccessTypes";
import axios from "axios";

interface Employee {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  email: string;
  status: string;
  lastVisit: string;
  displayPicture: string;
  isActive: string;
  json: string;
  accessType: string;
}

export default function UserAccess() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [users, setUsers] = React.useState<Employee[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint =
        "http://127.0.0.1:3037/DocPOC/v1/user/list/12a1c77b-39ed-47e6-b6aa-0081db2c1469";

      const params: any = {
        page: 1,
        pageSize: 50,
        from: "2024-12-04T03:32:25.812Z",
        to: "2024-12-11T03:32:25.815Z",
      };

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUsers(response.data.rows || response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Accordion selectionMode="multiple">
      {users.map((user) => (
        <AccordionItem
          key={user.id}
          aria-label={user.name}
          startContent={
            <Avatar
              isBordered
              color="primary"
              radius="lg"
              src={user.displayPicture || "images/user/user-male.jpg"}
            />
          }
          subtitle={user.status}
          title={user.name}
        >
          <UserAccessTypes accessType={user.accessType} />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
