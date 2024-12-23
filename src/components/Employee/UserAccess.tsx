"use client";
import React, { useEffect } from "react";
import { Accordion, AccordionItem, Avatar,Spinner,
  Modal, ModalContent, ModalBody, ModalFooter, Button,ModalHeader,  useDisclosure,
 } from "@nextui-org/react";
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
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<{ success?: string; error?: string }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      onOpen()
      setModalMessage({ success: "User updated successfully!" })

      // alert("User updated successfully:")
    } catch (err) {
      console.error("Failed to update user:", err);
      // alert("Failed to update user")
      onOpen()
      setModalMessage({ error: "Failed to update user." });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 useEffect(() => {
    const header = document.querySelector("header");
    if (isOpen) {
      header?.classList.remove("z-999");
      header?.classList.add("z-0");
    } else {
      header?.classList.remove("z-0");
      header?.classList.add("z-999");
    }
  }, [isOpen]);

  return (
    <>
     <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center   z-50">
              <Spinner />
            </div>
          )}
        </div>
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
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              {modalMessage.success ? <p className="text-green-600">Success</p> : <p className="text-red-600">Error</p>}
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </>
   
  );
}
