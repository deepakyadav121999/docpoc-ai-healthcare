"use client";
import React, { useEffect } from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import UserAccessTypes from "./AccessTypes";
import axios from "axios";

interface Employee {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  email: string;
 
  json: string;
  accessType: string; // JSON string
 
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

      const params = {
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

  const handleUpdate = async (updatedUser: Employee) => {

    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `http://127.0.0.1:3037/DocPOC/v1/user`;

      const response = await axios.patch(
        endpoint,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with the updated user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );

      console.log("User updated successfully:", response.data);
      alert("User updated successfully:")
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user")
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
              src={"images/user/user-male.jpg"}
            />
          }
          subtitle={user.email}
          title={user.name}
        >
          <UserAccessTypes
            user={user} // Pass the complete user object
            onSubmit={handleUpdate}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
