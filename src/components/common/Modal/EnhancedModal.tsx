import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
// import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"; // Example: Heroicons
const AnimatedSuccessIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
    className="h-10 w-10 text-green-600"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {/* Animated Circular Path */}
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
    {/* Checkmark */}
    <motion.path
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 26l8 8 14-14"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
    />
  </motion.svg>
);

const AnimatedErrorIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
    className="h-10 w-10 text-red-600"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {/* Animated Circular Path */}
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
    {/* Cross */}
    <motion.path
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 16l20 20M36 16L16 36"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
    />
  </motion.svg>
);
interface EnhancedModalProps {
  isOpen: boolean; // Indicates whether the modal is open
  loading: boolean; // Indicates whether a loading spinner should be displayed
  modalMessage: {
    success?: string; // Success message
    error?: string; // Error message
  };
  onClose: () => void; // Function to handle modal close
}

const EnhancedModal: React.FC<EnhancedModalProps> = ({
  isOpen,
  loading,
  modalMessage,
  onClose,
}) => {
  // const getIcon = () => {
  //   if (modalMessage.success) {
  //     return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
  //   } else if (modalMessage.error) {
  //     return <ExclamationCircleIcon className="h-12 w-12 text-red-600" />;
  //   }
  //   return null;
  // };

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onClose={onClose}
      // style={{ margin: 0, marginTop:"50%", marginBottom: "60%"}}
      className="mt-[30%] mb-[70%] sm:mt[10%] sm:mb-[10%]"
    >
      <ModalContent>
        <ModalHeader>
          {/* {loading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {getIcon()}
            </div>
          )} */}
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : modalMessage.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center text-green-600"
            >
              {" "}
              <AnimatedSuccessIcon />
              <p className="text-lg font-semibold">{modalMessage.success}</p>
              {/* <motion.div
                className="mt-4"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
              >
                <svg
                  className="w-10 h-10 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m0 4a9 9 0 11-6 6"
                  />
                </svg>
              </motion.div> */}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center text-red-600"
            >
              {/* <ExclamationCircleIcon className="h-12 w-12" /> */}
              <AnimatedErrorIcon />
              <p className="text-md font-semibold">{modalMessage.error}</p>
              {/* <motion.div
                className="mt-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
              >
                <ExclamationCircleIcon className="h-10 w-10" />
              </motion.div> */}
            </motion.div>
          )}
        </ModalBody>
        <ModalFooter>
          {/* {!loading && (
            <Button color="primary" onPress={onClose}>
              Ok
            </Button>
          )} */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnhancedModal;
