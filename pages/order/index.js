import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ReDate = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)}`;
};

const ReDateTime = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
    -2
  )}`;
};

const SumCtn = (obj) => {
  let ctn = 0;
  obj.map((i) => {
    ctn += i.order_ctn;
  });
  return ctn.toLocaleString();
};

const OrderPlanPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [showFilterDate, setShowFilterDate] = useState(false);
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

      console.dir(
        `${process.env.API_HOST}/order/ent?etd=${filterDate}&factory=${session.user.Factory}`
      );

      const res = await fetch(
        `${process.env.API_HOST}/order/ent?etd=${filterDate}&factory=INJ`,
        requestOptions
      );

      if (!res.ok) {
        console.log(res.status);
      }

      if (res.ok) {
        const data = await res.json();
        setData(data.data);
      }
      setIsLoading(false);
      console.dir(data);
      return;
    }
  };

  useEffect(() => {
    let d = Date.now();
    setFilterDate(ReDate(d));
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
                <div
                  className="mt-2 flex items-center text-sm text-gray-500"
                  onClick={() => setShowFilterDate(true)}
                >
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Plan on {filterDate}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-small text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => FetchOrder()}
                >
                  {isLoading ? (
                    <Spinner size={`sm`} />
                  ) : (
                    <ArrowPathIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                  Refresh
                </button>
              </span>
              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <LinkIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  View
                </button>
              </span>

              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <CheckIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Publish
                </button>
              </span>

              {/* Dropdown */}
              <Menu as="div" className="relative ml-3 sm:hidden">
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
              </Menu>
            </div>
          </div>
          {/* /End replace */}
          {/* start table */}
          <div className="overflow-x-auto mt-6">
            {data != null && (
              <table className="table w-full">
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
                  </tr>
                </thead>
                <tbody>
                  {data.map((i, x) => (
                    <tr className="hover hover:cursor-pointer" key={i.id}>
                      <th>
                        <Link href={`/order/plan?id=${i.id}`}>{x + 1}</Link>
                      </th>
                      <td>{i.consignee.whs.title}</td>
                      <td>{ReDate(i.etd_date)}</td>
                      <td>
                        <span
                          className={
                            i.shipment.title === "A"
                              ? `text-rose-700`
                              : `text-gray-600`
                          }
                        >
                          {i.shipment.description}
                        </span>
                      </td>
                      <td>{i.ship_form}</td>
                      <td>{i.ship_to}</td>
                      <td>{i.commercial.title}</td>
                      <td>{i.running_seq}</td>
                      <td>{i.order_detail.length}</td>
                      <td>{SumCtn(i.order_detail)}</td>
                      <td>{ReDateTime(i.updated_at)}</td>
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
