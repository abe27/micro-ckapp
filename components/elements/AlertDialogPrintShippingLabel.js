import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const AlertDialogPrintShippingLabel = ({
  seq = 0,
  data,
  title = "ระบบแจ้งเตือน!",
  description = `คุณต้องการที่จะลบ...ใช่หรือไม่!`,
  onCommit,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const Confirm = (status) => {
    data.seq = seq;
    onCommit([data], status);
    onClose();
  };

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-printer text-violet-400 hover:text-violet-700"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path>
          <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path>
          <rect x="7" y="13" width="10" height="8" rx="2"></rect>
        </svg>
      </span>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>{description}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => Confirm(false)}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={() => Confirm(true)} ml={3}>
                ยืนยันคำสั่ง
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertDialogPrintShippingLabel;
