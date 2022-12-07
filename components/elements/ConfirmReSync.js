import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

const ConfirmReSync = ({ isSync = false, refNo, ConfirmReSync }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const confirm = () => {
    ConfirmReSync({
        id: refNo, sync: false
    })
    onClose()
  }

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        {isSync ? (
          <CheckIcon
            className="w-4 h-4 mr-2 -ml-1 text-green-600"
            aria-hidden="true"
          />
        ) : (
          <XCircleIcon
            className="w-4 h-4 mr-2 -ml-1 text-rose-600"
            aria-hidden="true"
          />
        )}
      </span>

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
              คุณต้องการที่จะซิงค์ข้อมูล <strong className="text-rose-800">{refNo}</strong> นี้ใช่หรือไม่?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={confirm} ml={3}>
                ยืนยัน
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmReSync;
