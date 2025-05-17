import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const AnimatedSuccessIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
    className="h-10 w-10 text-green-600"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
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
  isOpen: boolean;
  loading: boolean;
  modalMessage: {
    success?: string;
    error?: string;
  };
  onClose: () => void;
}

const EnhancedModal: React.FC<EnhancedModalProps> = ({
  isOpen,
  loading,
  modalMessage,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && !loading) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Automatically close after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, loading, onClose]);

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onClose={onClose}
      className="mt-[30%] mb-[70%] sm:mt[10%] sm:mb-[10%]"
    >
      <ModalContent>
        <ModalHeader />
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
              <AnimatedSuccessIcon />
              <p className="text-lg font-semibold">{modalMessage.success}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center text-red-600"
            >
              <AnimatedErrorIcon />
              <p className="text-md font-semibold">{modalMessage.error}</p>
            </motion.div>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default EnhancedModal;
