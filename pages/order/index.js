import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  FunnelIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBar, ShowOrderDetail } from "../../components";
import { ReDate } from "../../hooks/greeter";
import { getSessionStorage, setSessionStorage } from "../../hooks/session";

const OrderPlanPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState("-");
  const [filterWhs, setFilterWhs] = useState("-");
  const [filterDate, setFilterDate] = useState(null);
  const [whsData, setWhsData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [data, setData] = useState(null);
  const [showAll, setShowAll] = useState(true);

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

      let host = `${process.env.API_HOST}/order/ent?etd=${filterDate}&factory=${session.user.Factory}&is_checked=${showAll}`;
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
        const obj = await res.json();
        let doc = []
        if (filterCustomer !== "-") {
          obj.data.map((i, x) => {
            if (i.consignee.customer.description === filterCustomer){
              doc.push(i);
            }
          })
          setData(doc);
        } else {
          setData(obj.data)
        }

        let customer = ["-"]
        obj.data.map((i) => {
          if (customer.indexOf(i.consignee.customer.description) < 0) {
            customer.push(i.consignee.customer.description)
          }
        })
        customer.sort()
        setCustomerData(customer)
      }
      setIsLoading(false);
    }
  };

  const ShowAll = e => {
    setShowAll(e.target.checked)
  }

  const ReloadData = () => {
    let d = getSessionStorage("filterEdtDate");
      if (d === null) {
        d = setSessionStorage("filterEdtDate", ReDate(Date.now()));
      }
      setFilterDate(d);
      setFilterCustomer("-")
      setFilterWhs("-")
      FetchOrder()
  }

  const FetchWhs = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization",session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/whs`, requestOptions);
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
      const obj = await res.json();
      setWhsData(obj.data);
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
    FetchWhs()
  }, [filterDate, session]);

  useEffect(() => {
    FetchOrder();
  }, [filterCustomer, filterWhs, showAll])
  
  return (
    <>
      <NavBar
        user={session?.user}
        title={`Order Plan Control`}
        description={`จัดการข้อมูล Order Plan`}
      />
      {/* start body */}
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                จัดการข้อมูล Order {session?.user.Factory}
              </strong>
              <div className="flex flex-col mt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Popover>
                    <PopoverTrigger>
                      <FunnelIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                        aria-hidden="true"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>เลือกข้อมูล</PopoverHeader>
                      <PopoverBody>
                        <select className="w-full max-w-xs select select-ghost" defaultValue={filterWhs} onChange={e => setFilterWhs(e.target.value)}>
                          {whsData?.map((i, x) => (<option key={i.id} value={i.title}>{i.title}</option>))}
                        </select>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <span>เลือกคลังจัดส่ง {filterWhs}</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Popover>
                    <PopoverTrigger>
                      <UsersIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                        aria-hidden="true"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>เลือกลูกค้า</PopoverHeader>
                      <PopoverBody>
                        <select className="w-full max-w-xs select select-ghost" defaultValue={filterCustomer} onChange={e => setFilterCustomer(e.target.value)}>
                          {customerData?.map((i, x) => (<option key={i} value={i}>{i}</option>))}
                        </select>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  {filterCustomer !== "-" ? <span>เลือกลูกค้า {filterCustomer}</span> : <span>ค้าหาลูกค้า -</span>}
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
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
                          className="w-full input input-bordered"
                          defaultValue={filterDate}
                          onChange={filterDateChange}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <span>เลือกวันที่ {filterDate}</span>
                </div>
              </div>
            </div>
            <div className="flex mt-5 lg:mt-0 lg:ml-4">
              <span className="hidden ml-3 sm:block">
                <label
                  htmlFor="my-modal-etd-date"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <CalendarIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
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
                  className="cursor-pointer modal"
                >
                  <label className="relative modal-box" htmlFor="">
                    <h3 className="text-lg font-bold">เลือกวันที่</h3>
                    <p className="py-4">
                      <input
                        type="date"
                        placeholder="Type here"
                        className="w-full input input-bordered"
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
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => ReloadData()}
                >
                  {isLoading ? (
                    <Spinner size={`sm`} />
                  ) : (
                    <ArrowPathIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                  )}
                  โหลดใหม่
                </button>
              </span>

              {/* Dropdown */}
              {/* <Menu as="div" className="relative ml-3 sm:hidden">
                <Menu.Button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  More
                  <ChevronDownIcon
                    className="w-5 h-5 ml-2 -mr-1 text-gray-500"
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
                  <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 -mr-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
          <div className="z-0 mt-6 overflow-x-auto">
            {data != null && (
              <table className="z-0 table w-full table-compact">
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
                    <th>
                      <div className="flex">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-warning"
                          defaultChecked={showAll}
                          onChange={e => setShowAll(!showAll)}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((i, x) => (
                    <ShowOrderDetail key={i.id} data={i} x={x} showAll={showAll} filterCustomer={filterCustomer} filterWhs={filterWhs} />
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
