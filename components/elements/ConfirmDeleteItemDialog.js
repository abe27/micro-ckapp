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

const ConfirmDeleteItemDialog = ({ data, onCommitData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const ConfirmDelete = () => {
    onCommitData(data);
    onClose();
  };

  return (
    <>
      <Tooltip label={`ลบข้อมูล ${data.ledger.part.title}`}>
        <span className="hover:cursor-pointer" onClick={onOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-trash text-rose-600 hover:cursor-pointer"
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
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ยืนยันคำสั่ง
            </AlertDialogHeader>

            <AlertDialogBody>
              {`คุณต้องการที่จะลบข้อมูล ${data.ledger.part.title} ใช่หรือไม่!`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={ConfirmDelete} ml={3}>
                ลบข้อมูล
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmDeleteItemDialog;
