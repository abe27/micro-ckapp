import { PlusIcon } from "@heroicons/react/20/solid";
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
import { useSession } from "next-auth/react";

const ModalAddNewItem = ({ isAdd = false }) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [poNo, setPoNo] = useState(null);
  const [partNo, setPartNo] = useState(null);
  const [part, setPart] = useState(null);
  const [partName, setPartName] = useState(null);
  const [qty, setQty] = useState(0);
  const [ctn, setCtn] = useState(0);

  const updateData = () => {
    onClose();
  };

  const getHeader = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    return myHeaders;
  };

  const searchPart = async () => {
    var requestOptions = {
      method: "GET",
      headers: getHeader(),
      redirect: "follow",
    };

    console.dir(`${process.env.API_HOST}/part/${partNo}`);

    const res = await fetch(
      `${process.env.API_HOST}/part/${partNo}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data);
      setPart(data.data.title);
      setPartName(data.data.description);
    }
    // return;
  };

  useEffect(() => {
    setPoNo("");
    setPartNo("");
    setPart("");
    setPartName("");
    setQty(0);
    setCtn(0);
  }, [isOpen]);
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={onOpen}
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        เพิ่มข้อมูลใหม่
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>เพิ่มข้อมูลใหม่</ModalHeader>
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
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input input-xs w-full"
                        defaultValue={poNo}
                        onChange={(e) => setPoNo(e.target.value)}
                      />
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      PartNo.:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <div className="form-control">
                        <div className="input-group input-group-xs">
                          <input
                            type="text"
                            placeholder="Search…"
                            className="input input-xs w-full"
                            defaultValue={partNo}
                            onChange={(e) => setPartNo(e.target.value)}
                          />
                          <button
                            className="btn btn-square btn-xs"
                            onClick={searchPart}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <p>
                        {" "}
                        No: <strong className="text-blue-600">
                          {part}
                        </strong>{" "}
                      </p>
                      <p>
                        Description:{" "}
                        <strong className="text-blue-600">{partName}</strong>
                      </p>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Bal Qty.:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        placeholder="Type here"
                        className="input input-xs w-full"
                        defaultValue={qty}
                        onChange={(e) => setQty(e.target.value)}
                      />
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
                        onChange={(e) => setCtn(e.target.value)}
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

export default ModalAddNewItem;
