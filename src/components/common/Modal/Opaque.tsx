"use client";
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
  Spinner,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/CalenderBox/VerticalDotsIcon";
import { MODAL_TYPES } from "@/constants";
import ModalForm from "@/components/ModalForms";
import axios from "axios";
import EnhancedModal from "./EnhancedModal";
import { useSelector,useDispatch } from "react-redux";
import { updateAccessToken } from "@/store/slices/profileSlice";
import { RootState } from "@/store";
import { AppDispatch } from "@/store";


const API_URL = process.env.API_URL;
const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;
const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

interface EmployeeData {
  id?: string;
  name?: string;
  profilePicture?: string;
  dp?:string;
  // Add other properties as needed
}
interface PatientData{
  id?: string;
  name?: string;
  displayPicture?: string;
  dp?:string;
  document?:string;
  documents?: Array<string>;

}
export default function OpaqueModal(props: {
  modalType: { view: MODAL_TYPES; edit: MODAL_TYPES; delete: MODAL_TYPES };
  modalTitle: string;
  actionButtonName?: string;
  userId: string;
  onPatientDelete: () => void;
}) {

 const profile = useSelector((state: RootState) => state.profile.data);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState(props.modalTitle);
  const [formType, setFormType] = React.useState("");
  const [message, setmessage] = useState("");
  const [error, seterror] = useState("");
  const [updatedPatientData, setUpdatedPatientData] =  useState<PatientData>({});
  // const [updatedEmployeeData, setUpdatedEmployeeData] = useState({});
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState<EmployeeData>({});
  const [updatedAppointmentData, setUpdatedAppointmentData] = useState({});
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const[profilePhotoUrl, setProfilePhotoUrl] =useState("")
    const [accessToken, setAccessToken] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
 const dispatch = useDispatch<AppDispatch>();

  const handleProfilePhotoChange = (file:any) => {
    setSelectedFile(file); // Store the file in state
  };

  const handleFileChange =(files:any)=>{
    setSelectedFiles(files)
  }


  const uploadProfilePicture = async (file: File, foldername: string): Promise<string> => {
    const token = localStorage.getItem("docPocAuth_token");
    const sanitizedUsername = foldername.replace(/\s+/g, "").toLowerCase().slice(0, 9);
    const folderName = `${sanitizedUsername}${props.userId.slice(-6)}`;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", folderName);
      data.append("contentDisposition", "inline");

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: S3_BUCKET_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data) {
        const fileUrl = `${AWS_URL}/${folderName}/${file.name}`;
        console.log("File uploaded successfully:", fileUrl);
        return fileUrl;
      }
    } catch (error) {
      console.error("Error uploading the photo:", error);
      throw new Error("Failed to upload the photo. Please try again.");
    }
    return "";
  };

  const uploadFiles = async (files: File[], foldername: string): Promise<string[]> => {
    const token = localStorage.getItem("docPocAuth_token");
    const sanitizedUsername = foldername.replace(/\s+/g, "").toLowerCase().slice(0, 9);
    const folderName = `${sanitizedUsername}${props.userId.slice(-6)}`;
    const uploadedFileUrls: string[] = [];
  
    for (const file of files) {
      try {
        const data = new FormData();
        data.append("file", file);
        data.append("folder", folderName);
        data.append("contentDisposition", "inline");
  
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: S3_BUCKET_URL,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: data,
        };
  
        const response = await axios.request(config);
  
        if (response.data) {
          const fileUrl = `${AWS_URL}/${folderName}/${file.name}`;
          console.log("File uploaded successfully:", fileUrl);
          uploadedFileUrls.push(fileUrl);
        }
      } catch (error) {
        console.error("Error uploading the file:", error);
        throw new Error("Failed to upload the file. Please try again.");
      }
    }
  
    return uploadedFileUrls;
  };


  const handleDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `${API_URL}/patient/${props.userId}`;

    try {
      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Handle successful deletion
      onClose();
    
      setModalMessage({ success: "Patient deleted successfully!", error: "" });
     
      setNotificationOpen(true);
      setTimeout(() => {
        if (props.onPatientDelete) props.onPatientDelete();
      }, 2000);
    } catch (error) {
      onClose();
      console.error("Error deleting patient:", error);
      setModalMessage({
        success: "",
        error: "Failed to delete the patient. Please try",
      });
     
      setNotificationOpen(true);
    } finally {
      setLoading(false);
      onClose();
      // setNotificationOpen(true);
    }
  };
  const deleteEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/user/${props.userId}`);
      if (response.status === 200) {
        // setmessage('emplyee deleted')
        onClose();
        setModalMessage({ success: "emplyee deleted", error: "" });
        setNotificationOpen(true);
        setTimeout(() => {
          if (props.onPatientDelete) props.onPatientDelete();
        }, 2000);
      }
    } catch (error) {
      onClose();
      setNotificationOpen(true);
      console.error("Error deleting employee:", error);
      setModalMessage({
        success: "",
        error: "Failed to delete the employee. Please try",
      });
      // seterror('Failed to delete the employee. Please try again.');
    } finally {
      onClose();
      setLoading(false);
      // setNotificationOpen(true);
    }
  };

  const deleteAppointment = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");

    const endpoint = `${API_URL}/appointment/${props.userId}`;
    try {
      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        onClose();
        setModalMessage({ success: "appointment deleted", error: "" });
        setNotificationOpen(true);
        setTimeout(() => {
          if (props.onPatientDelete) props.onPatientDelete();
        }, 2000);
      }
    } catch (error) {
      setNotificationOpen(true);
      console.error("Error deleting appointment:", error);
      setModalMessage({
        success: "",
        error: "Failed to delete the appointment. Please try",
      });
      // seterror('Failed to delete the appointment. Please try again.');
      onClose();
    } finally {
      setLoading(false);
      // setNotificationOpen(true);
      onClose();
    }
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (isOpen || isNotificationOpen) {
      header?.classList.remove("z-999");
      header?.classList.add("z-0");
    }
    // else if(isNotificationOpen) {
    //     header?.classList.remove("z-999");
    //   header?.classList.add("z-0");
    // }
    else {
      header?.classList.remove("z-0");
      header?.classList.add("z-999");
    }
  }, [isOpen, isNotificationOpen]);

  const handleOpen = (
    backdrop: React.SetStateAction<string>,
    type: MODAL_TYPES | undefined,
  ) => {
    if (type == undefined) return;
    setFormType(type);
    onOpen();
  };
  const handleDataChange = (data: any) => {
    if (props.modalType.edit) {
      if (formType === MODAL_TYPES.EDIT_EMPLOYEE) {
        setUpdatedEmployeeData(data);
      } else if (formType === MODAL_TYPES.EDIT_PATIENT) {
        setUpdatedPatientData(data);
      } else if (formType === MODAL_TYPES.EDIT_APPOINTMENT) {
        setUpdatedAppointmentData(data);
      }
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `${API_URL}/patient`;

   
    try {
      let profilePictureUrl = updatedPatientData.displayPicture || "";

      if (selectedFile) {
        profilePictureUrl = await uploadProfilePicture(selectedFile, updatedPatientData.name || "");
        setProfilePhotoUrl(profilePictureUrl);
      }
  // Parse existing documents
  let existingDocuments: Record<string, string> = {};
  if (updatedPatientData.document) {
    try {
      existingDocuments = JSON.parse(updatedPatientData.document);
    } catch (error) {
      console.error("Error parsing existing documents:", error);
    }
  }

  // Upload new files and get their URLs
  const documentsObject: Record<string, string> = { ...existingDocuments };
  if (selectedFiles.length > 0) {
    const uploadedFileUrls = await uploadFiles(selectedFiles, updatedPatientData.name || " ");
    setFileUrls(uploadedFileUrls);

    // Append new documents to the existing ones
    uploadedFileUrls.forEach((url, index) => {
      const newKey = `document${Object.keys(documentsObject).length + index + 1}`;
      documentsObject[newKey] = url;
    });
  }

  // Convert documentsObject to a JSON string
  const documentsPayload = JSON.stringify(documentsObject);

  const requestData = {
    id: props.userId,
    displayPicture: profilePictureUrl ? profilePictureUrl : updatedPatientData.dp,
    documents: documentsPayload ? documentsPayload : updatedPatientData.document,
    ...updatedPatientData,
  };
   

      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (props.onPatientDelete) props.onPatientDelete();

      setmessage("Patient updated successfully!");
      setModalMessage({ success: "Patient updated successfully!", error: "" });
      setNotificationOpen(true);
      onClose();
    } catch (error) {
      console.error("Error updating patient:", error);
      setModalMessage({
        success: "",
        error: "Failed to update the patient. Please try again.",
      });
      seterror("Failed to update the patient. Please try again.");
      // alert("Failed to update the patient. Please try again.");
      setNotificationOpen(true);
    } finally {
      setLoading(false);
      setNotificationOpen(true);
      onClose();
    }
  };

  const handleEmployeeEdit = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `${API_URL}/user`;
  
     
    try {

      let profilePictureUrl = updatedEmployeeData.profilePicture || "";

      if (selectedFile) {
       profilePictureUrl = await uploadProfilePicture(selectedFile, updatedEmployeeData.name || "");
        setProfilePhotoUrl(profilePictureUrl);
      }
     
     

      const requestData = {
        id: props.userId,
        profilePicture: profilePictureUrl ?profilePictureUrl:updatedPatientData.dp,
        ...updatedEmployeeData,
       
      }

      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const newAccessToken = response.data.access_token;

      if (newAccessToken) {
    
        setAccessToken(newAccessToken);
      }

      if (props.onPatientDelete) props.onPatientDelete();
      setmessage("Employee updated successfully!");
      setModalMessage({
        success: "Employee updated successfully!",
        error: " ",
      });


      setNotificationOpen(true);
      // alert("Patient updated successfully!");
      onClose(); // Close the modal after successful update


    } catch (error) {
      console.error("Error updating Employee:", error);
      setModalMessage({ success: "", error: "Error updating Employee" });
      seterror("Error updating Employee");
      setNotificationOpen(true);
      // alert("Failed to update the patient. Please try again.");
    } finally {
      setLoading(false);
      setNotificationOpen(true);
      onClose();
    }
  };

  const handleAppointmentEdit = async () => {
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `${API_URL}/appointment`;

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
      setModalMessage({
        success: "appointment updated successfully!",
        error: " ",
      });
      setNotificationOpen(true);
      // alert("Patient updated successfully!");
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating appointment:", error);
      setModalMessage({ success: "", error: "Error updating appointment" });
      seterror("Error updating appointment");
      setNotificationOpen(true);
      // alert("Failed to update the patient. Please try again.");
    } finally {
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
      } else if (formType === MODAL_TYPES.DELETE_APPOINTMENT) {
        deleteAppointment();
      }
    } else if (formType === props.modalType.edit) {
      console.log("Edit action triggered");
      if (formType === MODAL_TYPES.EDIT_PATIENT) {
        console.log("Running handleEdit");
        handleEdit();
      } else if (formType === MODAL_TYPES.EDIT_EMPLOYEE) {
        console.log("Running handleEmployeeEdit");
        handleEmployeeEdit();
      } else if (formType === MODAL_TYPES.EDIT_APPOINTMENT) {
        handleAppointmentEdit();
      }
    } else {
      onClose();
    }
  };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    setNotificationOpen(false);
   if(profile.id === props.userId){
    dispatch(updateAccessToken(accessToken));
   }

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
          <DropdownItem
            onPress={() => handleOpen("blur", props.modalType.view)}
          >
            View
          </DropdownItem>
          <DropdownItem
            onPress={() => handleOpen("blur", props.modalType.edit)}
          >
            Edit
          </DropdownItem>
          {(props.modalType.delete && (
            <DropdownItem
              onPress={() => handleOpen("blur", props.modalType.delete)}
            >
              Delete
            </DropdownItem>
          )) || <DropdownItem style={{ display: "none" }}></DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        style={{ maxWidth: 800 }}
        className="max-h-[90vh] overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <ModalForm
                  type={formType}
                  userId={props.userId}
                  onDataChange={handleDataChange}
                  onProfilePhotoChange={handleProfilePhotoChange}
                  onFilesChange={handleFileChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                {loading ? <div className="flex"> <p>Saving</p><Spinner size="sm" color="white" /></div>  : (props.actionButtonName || "Submit")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <EnhancedModal
        isOpen={isNotificationOpen}
        loading={loading}
        modalMessage={modalMessage}
        onClose={handleModalClose}
      />
    </>
  );
}
