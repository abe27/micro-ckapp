import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Spinner,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowUturnLeftIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

const ConfirmSendToStock = ({ id, title, confirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const isConfirm = () => {
    confirm({
      serial_no: id,ctn: 1, shelve: "SNON"
    })
    onClose()
  }

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        <Tooltip label={title}>
          <ArrowUturnLeftIcon
            className="w-5 h-5 mr-2 -ml-1 text-green-500"
            aria-hidden="true"
          />
        </Tooltip>
      </span>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ยืนยันการดึงยอด Stock กลับ
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณต้องการที่จะดึงยอด {id} นี้ใช่หรือไม่?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={isConfirm} ml={3}>
                ยืนยัน
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmSendToStock;
