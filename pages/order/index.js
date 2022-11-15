import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import {
  Spinner,
  Input,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useToast,
} from "@chakra-ui/react";
import {
  CloudIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  BriefcaseIcon,
  PencilIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import {
  GenerateInvoice,
  SumCtn,
  ReDate,
  ReDateTime,
} from "../../hooks/greeter";
import { getSessionStorage, setSessionStorage } from "../../hooks/session";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const OrderPlanPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [data, setData] = useState(null);

  const FetchOrder = async () => {
    if (filterDate != null && session != undefined) {
      setIsLoading(true);
      setData(null);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      let host = `${process.env.API_HOST}/order/ent?etd=${filterDate}&factory=${session.user.Factory}`;
      console.dir(host);
      const res = await fetch(host, requestOptions);

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: data.message,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
          onCloseComplete: () => {
            if (res.status === 401) {
              router.push("/auth");
            }
          },
        });
        console.dir(res.status);
      }

      if (res.ok) {
        const data = await res.json();
        setData(data.data);
      }
      setIsLoading(false);
      // console.dir(data);
    }
  };

  const filterDateChange = (e) => {
    let d = setSessionStorage("filterEdtDate", ReDate(e.target.value));
    setFilterDate(d);
  };

  useEffect(() => {
    if (filterDate == null) {
      let d = getSessionStorage("filterEdtDate");
      if (d === null) {
        d = setSessionStorage("filterEdtDate", ReDate(Date.now()));
      }
      setFilterDate(d);
    }
    FetchOrder();
  }, [filterDate, session]);
  return (
    <>
      <NavBar
        user={session?.user}
        title={`Order Plan Control`}
        description={`จัดการข้อมูล Order Plan`}
      />
      {/* start body */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <strong className="tfont-bold text-gray-900">
                จัดการข้อมูล Order {session?.user.Factory}
              </strong>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <BriefcaseIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/archive`}>Archive</Link>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CloudIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/edi`}>Remote EDI</Link>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Popover>
                    <PopoverTrigger>
                      <CalendarIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                        aria-hidden="true"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>เลือกวันที่!</PopoverHeader>
                      <PopoverBody>
                        <input
                          type="date"
                          placeholder="Type here"
                          className="input input-bordered w-full"
                          defaultValue={filterDate}
                          onChange={filterDateChange}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <span>Filter on {filterDate}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="ml-3 hidden sm:block">
                <label
                  htmlFor="my-modal-etd-date"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <CalendarIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  Etd Date
                </label>
                <input
                  type="checkbox"
                  id="my-modal-etd-date"
                  className="modal-toggle"
                />
                <label
                  htmlFor="my-modal-etd-date"
                  className="modal cursor-pointer"
                >
                  <label className="modal-box relative" htmlFor="">
                    <h3 className="text-lg font-bold">เลือกวันที่</h3>
                    <p className="py-4">
                      <input
                        type="date"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        defaultValue={filterDate}
                        onChange={filterDateChange}
                      />
                    </p>
                    <div className="modal-action">
                      <label htmlFor="my-modal-etd-date" className="btn">
                        ตกลง
                      </label>
                    </div>
                  </label>
                </label>
                {/* Start modal*/}
              </span>

              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => FetchOrder()}
                >
                  {isLoading ? (
                    <Spinner size={`sm`} />
                  ) : (
                    <ArrowPathIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  โหลดใหม่
                </button>
              </span>

              {/* Dropdown */}
              {/* <Menu as="div" className="relative ml-3 sm:hidden">
                <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  More
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          View
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu> */}
            </div>
          </div>
          {/* /End replace */}
          {/* start table */}
          <div className="overflow-x-auto mt-6">
            {data != null && (
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Whs</th>
                    <th>ETD Date.</th>
                    <th>A/B/T</th>
                    <th>ship from.</th>
                    <th>ship to.</th>
                    <th>Comm.</th>
                    <th>invno.</th>
                    <th>item</th>
                    <th>ctn</th>
                    <th>last update</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((i, x) => (
                    <tr className="hover hover:cursor-pointer" key={i.id}>
                      <th>
                        <Link
                          href={`/order/plan?id=${i.id}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {x + 1}
                        </Link>
                      </th>
                      <td>
                        <span
                          className={
                            i.consignee.whs.title === "DOM"
                              ? `text-teal-600`
                              : i.consignee.whs.title === "NESC"
                              ? "text-rose-600"
                              : i.consignee.whs.title === "ICAM"
                              ? "text-violet-600"
                              : "text-blue-600"
                          }
                        >
                          {i.consignee.whs.title}
                        </span>
                      </td>
                      <td>{ReDate(i.etd_date)}</td>
                      <td>
                        <span
                          className={
                            i.shipment.title === "A"
                              ? `text-rose-700`
                              : i.shipment.title === "T"
                              ? "text-violet-600"
                              : `text-gray-600`
                          }
                        >
                          {i.shipment.description}
                        </span>
                      </td>
                      <td>{i.consignee.affcode.title}</td>
                      <td>
                        <Tooltip
                          label={`${i.consignee.customer.title}-${i.consignee.customer.description}`}
                        >
                          {i.consignee.customer.description}
                        </Tooltip>
                      </td>
                      <td>
                        <span
                          className={
                            i.commercial.title === "N"
                              ? `text-rose-700`
                              : `text-gray-600`
                          }
                        >
                          {i.commercial.title}
                        </span>
                      </td>
                      <td>
                        <Link href={`/order/plan?id=${i.id}`}>
                          <span className="text-fuchsia-600">
                            <Tooltip
                              label={
                                i.is_invoice
                                  ? `ยืนยันแล้ว`
                                  : `ยังไม่ได้ทำ Invoice`
                              }
                            >
                              {GenerateInvoice(i)}
                            </Tooltip>
                          </span>
                        </Link>
                      </td>
                      <td>{i.order_detail.length}</td>
                      <td>{SumCtn(i.order_detail)}</td>
                      <td>{ReDateTime(i.updated_at)}</td>
                      <td>
                        {i.is_invoice ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-check text-green-600"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path
                              stroke="none"
                              d="M0 0h24v24H0z"
                              fill="none"
                            ></path>
                            <path d="M5 12l5 5l10 -10"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-x text-rose-700"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path
                              stroke="none"
                              d="M0 0h24v24H0z"
                              fill="none"
                            ></path>
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* end table */}
        </div>
      </main>
    </>
  );
};

export default OrderPlanPage;
