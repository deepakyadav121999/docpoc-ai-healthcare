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
export default function OpaqueModal(props:{modalType:{view:MODAL_TYPES, edit:MODAL_TYPES, delete?:MODAL_TYPES}, modalTitle:string, actionButtonName?:string, patientId: string, onPatientDelete:() => void;   }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState(props.modalTitle);
  const [formType, setFormType] = React.useState('');
  const[message,setmessage] =useState('');
  const[error,seterror] = useState('')
  const [updatedPatientData, setUpdatedPatientData] = useState({});
 

  const handleDelete = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `http://127.0.0.1:3037/DocPOC/v1/patient/${props.patientId}`;

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

  // Handle Submit button based on form type

  
  const handleOpen = (backdrop: React.SetStateAction<string>, type:MODAL_TYPES | undefined) => {
    if(type == undefined ) return;
    setFormType(type);
    onOpen();
   
    
  };
  const handleDataChange = (data: any) => {
    setUpdatedPatientData(data); // Update state with child data
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = "http://127.0.0.1:3037/DocPOC/v1/patient";
  
    const requestData = {
      id: props.patientId,
      ...updatedPatientData, // Data collected from the form
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
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating patient:", error);
      seterror("Failed to update the patient. Please try again.");
    }
  };
  const handleSubmit = () => {
    if (formType === props.modalType.delete) {
      handleDelete();
    } else if (formType === props.modalType.edit) {
      handleEdit(); // Call edit function
    } else {
      console.log(updatedPatientData); // Log other cases
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
          {(props.modalType.delete && (<DropdownItem onPress={() => handleOpen("blur", props.modalType.delete)}>Delete</DropdownItem>) ) || <DropdownItem style={{display:"none"}}></DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} style={{maxHeight: 900, maxWidth:800}}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {title}
              </ModalHeader>
              <ModalBody>
                <ModalForm type={formType} patientId={props.patientId} onDataChange={handleDataChange}/>
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
