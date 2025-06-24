// AppointmentListModal.tsx
import React from "react";
// import AppointmentTable from "@/components/CalenderBox/Table";
import AppointmentListTable from "@/components/CalenderBox/AppointmentListTable";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface AppointmentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTime: string;
  endTime: string;
  onRefresh: () => void;
}

const AppointmentListModal: React.FC<AppointmentListModalProps> = ({
  isOpen,
  onClose,
  startTime,
  endTime,
  onRefresh,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop={"blur"}
      style={{
        maxWidth: 800,
        maxHeight: 600,
        overflowY: "scroll",
        marginTop: "15%",
      }}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-50",
      }}
    >
      <ModalContent>
        <ModalHeader>Appointment Details</ModalHeader>
        <ModalBody>
          <AppointmentListTable
            startTime={startTime}
            endTime={endTime}
            onRefresh={onRefresh}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentListModal;
