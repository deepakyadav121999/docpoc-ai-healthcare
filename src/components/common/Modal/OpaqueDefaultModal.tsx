import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "@/components/CalenderBox/PlusIcon";
import AddAppointment from "@/components/CalenderBox/AddAppointment";
interface ParentComponentProps {
  child: React.ReactNode;
  headingName: string; 
 }

const App: React.FC<ParentComponentProps> = ({ child,headingName }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="">
      <Button
        color="primary"
        endContent={<PlusIcon />}
        onPress={onOpen}
        style={{ minHeight: 55 }}
      >
        Add New
      </Button>
    
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{maxWidth: 800, maxHeight: 600, overflowY: "scroll", marginTop: '19%'}}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20  ",
        }}
      >
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
               {headingName}
              </ModalHeader>
              <ModalBody>
               {child}
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
     
    </div>
  );
}
export default App;
