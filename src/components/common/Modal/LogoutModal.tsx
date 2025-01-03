import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";

interface LogoutModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal = ({ loading, isOpen, onClose, onLogout }: LogoutModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop={"blur"}>
      <ModalContent>
        <ModalBody>
          <h2 style={{ color: "#FF0000" }}>Are you sure you want to Signout ?</h2>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={onLogout} isDisabled={loading}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
