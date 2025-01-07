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
  Spinner
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/CalenderBox/VerticalDotsIcon";
import { MODAL_TYPES } from "@/constants";
import ModalForm from "@/components/ModalForms";
import axios from "axios";
import EnhancedModal from "./EnhancedModal";

export default function OpaqueModal(props: { modalType: { view: MODAL_TYPES, edit: MODAL_TYPES, delete: MODAL_TYPES }, modalTitle: string, actionButtonName?: string, userId: string, onPatientDelete: () => void; }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState(props.modalTitle);
  const [formType, setFormType] = React.useState('');
  const [message, setmessage] = useState('');
  const [error, seterror] = useState('')
  const [updatedPatientData, setUpdatedPatientData] = useState({});
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState({})
  const [updatedAppointmentData, setUpdatedAppointmentData] = useState({})
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });

 

  const handleDelete = async () => {
    setLoading(true);
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
      setModalMessage({ success: "Patient deleted successfully!", error: "" });
      setmessage("Patient deleted successfully!");
      setNotificationOpen(true)

    } catch (error) {

      console.error("Error deleting patient:", error);
      setModalMessage({ success: "", error: "Failed to delete the patient. Please try" });
      seterror("Failed to delete the patient. Please try again.");
      setNotificationOpen(true)
    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
    }
  };
  const deleteEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://127.0.0.1:3037/DocPOC/v1/user/${props.userId}`);
      if (response.status === 200) {
        setmessage('emplyee deleted')
        setModalMessage({ success: "emplyee deleted", error: "" });
        setNotificationOpen(true)
        if (props.onPatientDelete) props.onPatientDelete();
      }
    } catch (error) {
      setNotificationOpen(true)
      console.error('Error deleting employee:', error);
      setModalMessage({ success: "", error: "Failed to delete the employee. Please try" });
      seterror('Failed to delete the employee. Please try again.');

    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
    }
  };

  const deleteAppointment = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");

       const endpoint =`http://127.0.0.1:3037/DocPOC/v1/appointment/${props.userId}`
    try {
      const response = await axios.delete(endpoint,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
      
        setModalMessage({ success: "appointment deleted", error: "" });
        setNotificationOpen(true)
        if (props.onPatientDelete) props.onPatientDelete();
      }
    } catch (error) {
      setNotificationOpen(true)
      console.error('Error deleting appointment:', error);
      setModalMessage({ success: "", error: "Failed to delete the appointment. Please try" });
      seterror('Failed to delete the appointment. Please try again.');

    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
    }
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (isOpen) {
      header?.classList.remove("z-999");
      header?.classList.add("z-0");
    } 
    // else if(isNotificationOpen) {
    //     header?.classList.remove("z-999");
    //   header?.classList.add("z-0");
    // }
    else{
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

    if (props.modalType.edit) {
      if (formType === MODAL_TYPES.EDIT_EMPLOYEE) {
        setUpdatedEmployeeData(data)
      }
      else if (formType === MODAL_TYPES.EDIT_PATIENT) {
        setUpdatedPatientData(data);
      }
      else if(formType === MODAL_TYPES.EDIT_APPOINTMENT){
        setUpdatedAppointmentData(data)
      }
    }
  };


  const handleEdit = async () => {
    setLoading(true);
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

      setmessage("Patient updated successfully!");
      setModalMessage({ success: "Patient updated successfully!", error: "" });
      setNotificationOpen(true)
      onClose();
    } catch (error) {
      console.error("Error updating patient:", error);
      setModalMessage({ success: "", error: "Failed to update the patient. Please try again." });
      seterror("Failed to update the patient. Please try again.");
      // alert("Failed to update the patient. Please try again.");
      setNotificationOpen(true)
    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
      onClose();
    }
  };

  const handleEmployeeEdit = async () => {
    setLoading(true);
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
      setmessage("Employee updated successfully!");
      setModalMessage({ success: "Employee updated successfully!", error: " " });
      setNotificationOpen(true)
      // alert("Patient updated successfully!");
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating Employee:", error);
      setModalMessage({ success: "", error: "Error updating Employee" });
      seterror("Error updating Employee");
      setNotificationOpen(true)
      // alert("Failed to update the patient. Please try again.");
    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
      onClose();
    }
  };

  const handleAppointmentEdit = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `http://127.0.0.1:3037/DocPOC/v1/appointment`;

    const requestData = {
      id: props.userId,
      ...updatedAppointmentData,
    };

    try {
      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (props.onPatientDelete) props.onPatientDelete();
      setmessage("appointment updated successfully!");
      setModalMessage({ success: "appointment updated successfully!", error: " " });
      setNotificationOpen(true)
      // alert("Patient updated successfully!");
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating appointment:", error);
      setModalMessage({ success: "", error: "Error updating appointment" });
      seterror("Error updating appointment");
      setNotificationOpen(true)
      // alert("Failed to update the patient. Please try again.");
    }
    finally {
      setLoading(false);
      setNotificationOpen(true);
      onClose();
    }
  };

  const handleSubmit = () => {
    console.log("Form Type:", formType);
    console.log("Props Modal Type:", props.modalType);
    if (loading) return;

    if (formType === props.modalType.delete) {
      console.log("Delete action triggered");
      if (formType === MODAL_TYPES.DELETE_PATIENT) {
        console.log("Running handleDelete");
        handleDelete();
      } else if (formType === MODAL_TYPES.DELETE_EMPLOYEE) {
        console.log("Running deleteEmployee");
        deleteEmployee();
      }
      else if(formType === MODAL_TYPES.DELETE_APPOINTMENT){
        deleteAppointment()
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
      else if(formType === MODAL_TYPES.EDIT_APPOINTMENT){
        handleAppointmentEdit()
      }
    }
    else{
      onClose()
    }
  };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    setNotificationOpen(false)
    // onClose();

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
        <ModalContent >
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


      {/* <Modal backdrop={"blur"} isOpen={isNotificationOpen} onClose={() => setNotificationOpen(false)}>
        <ModalContent>
          <ModalHeader>{modalMessage.success ? <p className="text-green-600">Success</p> : <p className="text-red-600">Error</p>}</ModalHeader>
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
            <Button color="primary" onPress={() => setNotificationOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      
         <EnhancedModal
                isOpen={isNotificationOpen}
                loading={loading}
                modalMessage={modalMessage}
                onClose={handleModalClose}
              />
    </>
  );
}
