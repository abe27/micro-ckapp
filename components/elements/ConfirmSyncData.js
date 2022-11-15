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
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef } from "react";

const ConfirmSyncData = ({
  id,
  label = `ยืนยันรายการนี้`,
  description = `คุณต้องการที่จะลบข้อมูล ... ใช่หรือไม่!`,
  isEdit = false,
  onCommitData,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const confirmOrder = () => {
    onCommitData(id);
    onClose();
  };

  return (
    <>
      <Tooltip label={label}>
        <button
          type="button"
          disabled={isEdit}
          className={
            isEdit
              ? `inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm`
              : `inline-flex justify-center rounded-md border border-transparent bg-rose-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2`
          }
          onClick={onOpen}
        >
          <CheckBadgeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {label}
        </button>
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

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={confirmOrder} ml={3}>
                ยืนยัน
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmSyncData;
