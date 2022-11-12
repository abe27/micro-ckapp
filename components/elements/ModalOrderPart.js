import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ModalOrderPart = ({ data, onCommitData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ctn, setCtn] = useState(0);
  const [balqty, setBalqty] = useState(0);

  const updateData = () => {
    data.orderplan.balqty = balqty;
    data.order_ctn = ctn;
    if (data.total_on_pallet === undefined) {
      data.total_on_pallet = 0;
    }
    onCommitData(data);
    onClose();
  };

  const ChangeCtn = (e) => {
    let ctn = parseInt(e.target.value);
    setCtn(ctn);
    let qty = data.orderplan.bistdp * ctn;
    setBalqty(qty);
  };

  useEffect(() => {
    let ctn = 0;
    let qty = 0;
    if (data) {
      if (data.orderplan.balqty > 0) {
        qty = data.orderplan.balqty;
        ctn = data.orderplan.balqty / data.orderplan.bistdp;
      }
    }
    setBalqty(qty);
    setCtn(ctn);
  }, [data]);
  return (
    <>
      <Tooltip label={`แก้ไขข้อมูล ${data.ledger.part.title}`}>
        <span onClick={onOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-pencil text-orange-500 hover:cursor-pointer"
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
            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
            <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
          </svg>
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>แก้ไขข้อมูล</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="overflow-hidden sm:rounded-lg">
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Po No.:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {data.orderplan.pono}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      PartNo.:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {data.ledger.part.title}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500" />
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {data.ledger.part.description}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Bal Qty.:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {balqty.toLocaleString()}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Ctn:</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        placeholder="Type here"
                        className="input input-xs w-full"
                        defaultValue={ctn}
                        onChange={ChangeCtn}
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateData}>
              บันทึกข้อมูล
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalOrderPart;
