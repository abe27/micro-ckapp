import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Flex,
  Center,
  Text,
  Square,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const AddPartToPallet = ({
  data = [],
  isMatched = false,
  ctn = 0,
  pallet = 0,
  confirmAddData,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [isValidate, setIsValidate] = useState(null);
  const [total, setTotal] = useState(null);
  const [isDisabled, setDisabled] = useState(false);

  const CheckPalletTotal = (e) => {
    setDisabled(true);
    let a = ctn - pallet;
    if (parseInt(e.target.value) > a) {
      setIsValidate("input-error");
      setDisabled(false);
    } else {
      setIsValidate(null);
      setTotal(e.target.value);
    }
  };

  const saveData = () => {
    confirmAddData();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (ctn - pallet === 0) {
        setDisabled(true);
      }
      setIsValidate("");
      setTotal(ctn - pallet);
    }
  }, [isOpen]);

  return (
    <>
      <div className={`flex justify-end hover:cursor-pointer`} onClick={onOpen}>
        <span
          className={
            isMatched
              ? `text-rose-600 hover:text-orange-500`
              : `text-gray-600 hover:text-green-500`
          }
        >
          {ctn.toLocaleString()}
        </span>
      </div>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>เพิ่มข้อมูลไปที่พาเลท</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <div className="flex space-x-2">
              <div className="w-2/5">
                <span>ระบุจำนวน:</span>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Type here"
                  className={`input ${isValidate} input-bordered input-sm w-52`}
                  defaultValue={total}
                  onChange={CheckPalletTotal}
                  disabled={isDisabled}
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="w-2/5">เลือกพาเลท/กล่อง:</div>
              <div>
                <select
                  className="select select-bordered select-sm w-52"
                  disabled={isDisabled}
                >
                  {data?.map((i, x) => (
                    <option key={i.id} value={i.id}>{`${i.pallet_prefix}${(
                      "000" + i.pallet_no
                    ).slice(-3)}(${i.pallet_type.pallet_size_width}x${
                      i.pallet_type.pallet_size_length
                    }x${i.pallet_type.pallet_size_hight})`}</option>
                  ))}
                </select>
              </div>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              ยกเลิก
            </Button>
            <Button colorScheme="red" ml={3} onClick={saveData}>
              บันทึก
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddPartToPallet;
