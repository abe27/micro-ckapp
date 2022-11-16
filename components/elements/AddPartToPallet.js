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
import { useRef } from "react";

const AddPartToPallet = ({ isMatched = false, ctn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

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
            <div className="grid">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ระบุจำนวน</span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    placeholder="0.01"
                    className="input input-bordered"
                  />
                </label>
              </div>
              <div className="form-control">
                <div className="input-group">
                  <select className="select select-bordered">
                    <option disabled selected>
                      Pick category
                    </option>
                    <option>T-shirts</option>
                    <option>Mugs</option>
                  </select>
                  <button className="btn">Go</button>
                </div>
              </div>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              ยกเลิก
            </Button>
            <Button colorScheme="red" ml={3}>
              บันทึก
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddPartToPallet;
