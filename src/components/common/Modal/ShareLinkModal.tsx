import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  link,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [countdown, setCountdown] = useState(20); // 20 seconds countdown

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    // Reset copied status after 10 seconds
    setTimeout(() => setIsCopied(false), 10000);
  };

  useEffect(() => {
    if (isOpen) {
      // Start countdown when modal opens
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Reset countdown when modal closes
      setCountdown(5);
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="mt-[30%] mb-[70%] sm:mt[10%] sm:mb-[10%]"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Share Report with Patient
        </ModalHeader>
        <ModalBody>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Copy this link to share with the patient. The link will expire in{" "}
              <span className="font-semibold">{countdown}</span> seconds.
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={link}
                readOnly
                className="flex-1"
                variant="bordered"
              />
              <Button
                color={isCopied ? "success" : "primary"}
                onPress={copyToClipboard}
                className="min-w-[80px]"
              >
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareLinkModal;
