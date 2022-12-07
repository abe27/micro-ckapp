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
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

const ConfirmOutStock = ({ id, title, confirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const isConfirm = () => {
    confirm({
      serial_no: id,ctn: 0, shelve: "S-PLOUT"
    })
    onClose()
  }

  return (
    <>
      <span className="hover:cursor-pointer" onClick={onOpen}>
        <Tooltip label={title}>
          <XCircleIcon
            className="w-5 h-5 mr-2 -ml-1 text-rose-500"
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
              ยืนยันการตัดยอด Stock
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณต้องการที่จะตัดยอด {id} นี้ใช่หรือไม่?
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

export default ConfirmOutStock;
