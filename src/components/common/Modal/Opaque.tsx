"use client"
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/CalenderBox/VerticalDotsIcon";
import { MODAL_TYPES } from "@/constants";
import ModalForm from "@/components/ModalForms";
import axios from "axios";
export default function OpaqueModal(props: { modalType: { view: MODAL_TYPES, edit: MODAL_TYPES,  delete: MODAL_TYPES }, modalTitle: string, actionButtonName?: string, userId: string, onPatientDelete: () => void; }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState(props.modalTitle);
  const [formType, setFormType] = React.useState('');
  const [message, setmessage] = useState('');
  const [error, seterror] = useState('')
  const [updatedPatientData, setUpdatedPatientData] = useState({});
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState({})



  const handleDelete = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `http://127.0.0.1:3037/DocPOC/v1/patient/${props.userId}`;

    try {
      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Handle successful deletion
      if (props.onPatientDelete) props.onPatientDelete();
      setmessage("Patient deleted successfully!");

      onClose(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting patient:", error);
      seterror("Failed to delete the patient. Please try again.");
    }
  };
  const deleteEmployee = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:3037/DocPOC/v1/user/${props.userId}`);
      if (response.status === 200) {
        if (props.onPatientDelete) props.onPatientDelete();
        alert('Employee deleted successfully!');
        // Add logic to refresh or update the UI here, if necessary
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete the employee. Please try again.');
    }
  };

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




  const handleOpen = (backdrop: React.SetStateAction<string>, type: MODAL_TYPES | undefined) => {
    if (type == undefined) return;
    setFormType(type);
    onOpen();


  };
  const handleDataChange = (data: any) => {

  if(props.modalType.edit){
    if(formType === MODAL_TYPES.EDIT_EMPLOYEE){
      setUpdatedEmployeeData(data)
    }
    else if(formType === MODAL_TYPES.EDIT_PATIENT){
      setUpdatedPatientData(data);
    }
  }
  };


  const handleEdit = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = "http://127.0.0.1:3037/DocPOC/v1/patient";

    const requestData = {
      id: props.userId,
      ...updatedPatientData, 
    };

    try {
      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (props.onPatientDelete) props.onPatientDelete();
      alert("Patient updated successfully!")
      setmessage("Patient updated successfully!");
      onClose(); 
    } catch (error) {
      console.error("Error updating patient:", error);
      seterror("Failed to update the patient. Please try again.");
      alert("Failed to update the patient. Please try again.");
    }
  };

  const handleEmployeeEdit = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `http://127.0.0.1:3037/DocPOC/v1/user`;

    const requestData = {
      id: props.userId,
      ...updatedEmployeeData, 
    };

    try {
      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (props.onPatientDelete) props.onPatientDelete();
      setmessage("Patient updated successfully!");
      // alert("Patient updated successfully!");
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating patient:", error);
      seterror("Failed to update the patient. Please try again.");
      // alert("Failed to update the patient. Please try again.");
    }
  };

  const handleSubmit = () => {
    console.log("Form Type:", formType);
  console.log("Props Modal Type:", props.modalType);

  if (formType === props.modalType.delete) {
    console.log("Delete action triggered");
    if (formType === MODAL_TYPES.DELETE_PATIENT) {
      console.log("Running handleDelete");
      handleDelete();
    } else if (formType === MODAL_TYPES.DELETE_EMPLOYEE) {
      console.log("Running deleteEmployee");
      deleteEmployee();
    }
  } else if (formType === props.modalType.edit) {
    console.log("Edit action triggered");
    if (formType === MODAL_TYPES.EDIT_PATIENT) {
      console.log("Running handleEdit");
      handleEdit();
    } else if (formType === MODAL_TYPES.EDIT_EMPLOYEE) {
      console.log("Running handleEmployeeEdit");
      handleEmployeeEdit();
    }
  } else {
    console.log("No matching form type. Closing modal.");
    onClose();
  }
  };


  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onPress={() => handleOpen("blur", props.modalType.view)}>View</DropdownItem>
          <DropdownItem onPress={() => handleOpen("blur", props.modalType.edit)}>Edit</DropdownItem>
          {(props.modalType.delete && (<DropdownItem onPress={() => handleOpen("blur", props.modalType.delete)}>Delete</DropdownItem>)) || <DropdownItem style={{ display: "none" }}></DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} style={{ maxHeight: 600, maxWidth: 800 }}

      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {title}
              </ModalHeader>
              <ModalBody>
                <ModalForm type={formType} userId={props.userId} onDataChange={handleDataChange} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {props.actionButtonName || 'Submit'}
                </Button>


              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
