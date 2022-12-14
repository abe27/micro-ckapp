import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const ModalAddNewPallet = ({ lastPalletNo = 0, onCommitData }) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [palletType, setPalletType] = useState(null);
  const [palletNo, setPalletNo] = useState(null);
  const [palletTypeId, setPalletTypeId] = useState(null);
  const [palletLimit, setPalletLimit] = useState(null);

  const FetchPalletType = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/pallettype`,
      requestOptions
    );

    if (res.ok) {
      const result = await res.json();
      setPalletType(result.data);
    }
  };

  const selectPalletType = (e) => {
    setPalletTypeId(e.target.value);
    palletType.map((i) => {
      if (e.target.value === i.id) {
        if (palletLimit === 0) {
          setPalletLimit(i.limit_total);
        }
      }
    });
  };

  const SaveData = () => {
    if (palletTypeId === null) {
      toast({
        title: `กรุณาเลือกประเภท/ขนาดด้วย`,
        position: "top",
        status: "error",
        isClosable: true,
      });
      return;
    }

    let p = [];
    if (palletType !== null) {
      palletType.map((i) => {
        if (palletTypeId === i.id) {
          if (palletLimit > 0) {
            i.limit_total = palletLimit;
          } else if (palletLimit === 0) {
            if (i.type === "-") {
              i.limit_total = 1;
            }
          }
          p.push(i);
        }
      });
    }
    // console.dir(p);
    let data = [palletNo, p];
    onCommitData(data);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setPalletNo(lastPalletNo + 1);
      setPalletTypeId(null);
      setPalletLimit(0);
      FetchPalletType();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        onClick={onOpen}
      >
        <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        เพิ่มข้อมูลใหม่
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>เพิ่มข้อมูลพาเลทใหม่</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>เลขที่</FormLabel>
              <Input
                type="number"
                value={palletNo}
                onChange={(e) => setPalletNo(e.target.value)}
                placeholder="ระบุเลขที่พาเลท"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>ประเภท/ขนาด</FormLabel>
              <Select
                placeholder="เลือกประเภทพาเลท/กล่อง"
                value={palletTypeId}
                onChange={selectPalletType}
              >
                {palletType?.map((i, x) => (
                  <option key={i.id} value={i.id}>
                    {`${i.type}(ขนาด: ${i.pallet_size_width}x${i.pallet_size_length}x${i.pallet_size_hight} จำนวน: ${i.limit_total})`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>จำนวน/พาเลท</FormLabel>
              <Input
                type="number"
                value={palletLimit}
                onChange={(e) => setPalletLimit(e.target.value)}
                placeholder="ระบุจำนวน"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={SaveData}>
              บันทึกข้อมูล
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalAddNewPallet;
