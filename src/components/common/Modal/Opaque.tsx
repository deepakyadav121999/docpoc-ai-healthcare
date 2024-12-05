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
export default function OpaqueModal(props:{modalType:{view:MODAL_TYPES, edit:MODAL_TYPES, delete?:MODAL_TYPES}, modalTitle:string, actionButtonName?:string, patientId: string}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState(props.modalTitle);
  const [formType, setFormType] = React.useState('');


 
  
  const handleOpen = (backdrop: React.SetStateAction<string>, type:MODAL_TYPES | undefined) => {
    if(type == undefined ) return;
    setFormType(type);
    onOpen();
   
    
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
                <ModalForm type={formType} patientId={props.patientId}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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
