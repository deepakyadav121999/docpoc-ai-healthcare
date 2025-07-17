import React, { useEffect, useState } from "react";
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

interface ModalMessage {
  success?: string;
  error?: string;
}

interface ParentComponentProps {
  child: React.ReactNode;
  headingName: string;
  onClose?: () => void;
  onMessage?: (message: ModalMessage) => void;
}
interface ChildComponentProps {
  onClose?: () => void;
  onMessage?: (message: ModalMessage) => void;
  // Add other props your child component might need
}

const App: React.FC<ParentComponentProps> = ({
  child,
  headingName,
  onClose,
}) => {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose: internalClose,
  } = useDisclosure();
  const [modalMessage, setModalMessage] = useState<ModalMessage>({});
  // const handleClose = () => {
  //   // This closes the modal (toggles isOpen)
  //    onOpenChange();
  //   if (onClose) {
  //     onClose(); // Call parent's onClose
  //   }
  // };
  const handleMessage = (message: ModalMessage) => {
    setModalMessage(message);
    // Auto-close only on success after 3 seconds
    if (message.success) {
      setTimeout(() => {
        onOpenChange();
        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    // Only allow closing if it's a success message or manual close
    if (modalMessage.success) {
      onOpenChange();
    }

    if (onClose) {
      onClose();
    }
  };

  const handlecloseButton = () => {
    if (modalMessage.success) {
      onOpenChange();
    }
    if (onClose) {
      onClose();
    }
    internalClose();
  };
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      // Only modify z-index when modal is open
      if (isOpen) {
        header.classList.remove("z-999");
        header.classList.add("z-0");
      } else {
        header.classList.remove("z-0");
        header.classList.add("z-999");
      }
    }
  }, [isOpen]);

  //  useEffect(() => {
  //   if (!isOpen && modalClose) {
  //     modalClose();
  //   }
  // }, [isOpen, modalClose]);

  return (
    <div>
      <Button
        color="primary"
        endContent={<PlusIcon />}
        onPress={onOpen}
        className="responsive-button"
        // style={{ minHeight: 55 }}
      >
        Add New
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{
          maxWidth: 800,
          maxHeight: 600,
          overflowY: "scroll",
          marginTop: "10%",
        }}
        className="max-w-[95%] sm:max-w-[800px] mx-auto debug-border"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-50",
        }}
        onClose={onClose}
      >
        <ModalContent className="modal-content">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-0.5">
                {headingName}
              </ModalHeader>
              {/* <ModalBody className="modal-body">{child}</ModalBody> */}
              {/* <ModalBody>
                {React.isValidElement(child)
                  ? React.cloneElement(child, { onClose: handleClose })
                  : child}
              </ModalBody> */}
              {/* <ModalBody>
                {React.isValidElement<ChildComponentProps>(child)
                  ? React.cloneElement(child, { onClose: handleClose } as ChildComponentProps)
                  : child}
              </ModalBody> */}
              <ModalBody className="modal-body">
                {React.isValidElement<ChildComponentProps>(child)
                  ? React.cloneElement(child, {
                      onClose: handleClose,
                      onMessage: handleMessage,
                    })
                  : child}
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handlecloseButton}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style>
        {" "}
        {`
        /* Base styling for the button */
        .responsive-button {
          min-height: 55px;
          font-size: 1rem;
          padding: 0.8rem 1.5rem;
        }

        /* Adjustments for smaller screens */
        @media (max-width: 768px) {
          .responsive-button {
            font-size: 0.9rem; /* Smaller font size */
            padding: 0.7rem 1.2rem; /* Reduced padding */
            min-height: 50px; /* Smaller height */
          }
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh; /* Adjust as needed */
  overflow-y: auto;
  width: 99%; /* Adjust as needed */
  max-width: 800px; /* Adjust as needed */
  // background: white;
  border-radius: 15px;
  padding-top:10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);-
}

/* Ensure the modal is scrollable */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow-y: auto;
}
        }

        @media (max-width: 480px) {
          .responsive-button {
            font-size: 0.7rem; /* Further reduce font size */
            padding: 0.5rem 0.9rem; /* Further reduce padding */
            min-height: 40px; /* Smaller height */
          } 
        }



      `}
      </style>
    </div>
  );
};

export default App;
