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
import { useEffect, useRef } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AlertDialogQuestion = ({
  id,
  data=[],
  title = "ลบข้อมูลนี้",
  description = `คุณต้องการที่จะลบ...ใช่หรือไม่!`,
  onCommit,
  iconName = `icon-tabler-trash`,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const Confirm = (status) => {
    onCommit(data, status);
    onClose();
  };

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`icon icon-tabler icon-tabler-trash text-rose-500 hover:text-rose-700 hover:cursor-pointer`}
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
          <line x1="4" y1="7" x2="20" y2="7"></line>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
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
              ระบบแจ้งเตือน!
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

export default AlertDialogQuestion;
