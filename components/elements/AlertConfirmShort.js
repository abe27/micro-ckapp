import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const AlertConfirmShort = ({ data, onCommit }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [changeToDate, setChangToDate] = useState(null);

  const Confirm = (status) => {
    if (status) {
      if (!changeToDate) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "กรุณาระบุวันที่เลื่อน ETD ด้วย!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      data.etd_tap = changeToDate;
      onCommit(data, status);
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setChangToDate(null);
    }
  }, [isOpen]);

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-pencil-minus text-rose-600 hover:text-orange-600"
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
          <path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path>
          <path d="M13.5 6.5l4 4"></path>
          <path d="M16 18h4"></path>
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
            <AlertDialogBody>
              <FormControl isRequired>
                <FormLabel>เลื่อนไปที่วันที่</FormLabel>
                <Input
                  type="date"
                  placeholder="ETD Date"
                  defaultValue={changeToDate}
                  onChange={(e) => setChangToDate(e.target.value)}
                />
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => Confirm(false)}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={() => Confirm(true)} ml={3}>
                ยืนยัน
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertConfirmShort;
