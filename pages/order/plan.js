import {
  NavBar,
  OrderInformation,
  OrderDetail,
  SkeletonLoading,
} from "../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  CogIcon,
  PencilIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react";

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

const ReInvoice = (i) => {
  if (i) {
    let prefix = "NO";
    if (i.commercial.title != "N") {
      prefix = i.consignee.prefix;
    }
    return `${i.consignee.factory.inv_prefix}${prefix}${i.etd_date.substring(
      3,
      4
    )}${("0000" + i.running_seq).slice(-4)}${i.shipment.title}`;
  }
  return "-";
};

const OrderDetailPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  /* set variable */
  const [isEdit, setIsEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [data, setData] = useState(null);

  const FetchOrderDetail = async () => {
    setData(null);
    if (session !== undefined) {
      setIsLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      // console.dir(`${process.env.API_HOST}/order/ent/${id}`);

      const res = await fetch(
        `${process.env.API_HOST}/order/ent/${id}`,
        requestOptions
      );

      if (!res.ok) {
        console.log(res.status);
      }

      if (res.ok) {
        const obj = await res.json();
        setData(obj.data);
        console.dir(data);
      }
      setIsLoading(false);
      return;
    }
    return;
  };

  useEffect(() => {
    if (id) {
      FetchOrderDetail();
    }
  }, [id]);

  return (
    <>
      <NavBar
        user={session?.user}
        title={`Show Order Details ${id}`}
        description={`แสดงข้อมูล Order Details`}
      />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <strong className="tfont-bold text-gray-900">
                เลขที่เอกสาร: {ReInvoice(data)}
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
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                    aria-hidden="true"
                  />
                  <span>Filter on {invoiceNo}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  {isEdit ? `ปิดแก้ไข` : `เปิดแก้ไข`}
                </button>
              </span>
              <span className="ml-3 hidden sm:block">
                <Link
                  href={`/order/joblist?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PrinterIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    JobList
                  </button>
                </Link>
              </span>
              <span className="ml-3 hidden sm:block">
                <Link
                  href={`/order/pallet?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <CogIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    ตั้งค่าพาเลท
                  </button>
                </Link>
              </span>

              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => FetchOrderDetail()}
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
            </div>
          </div>
          {/* /End replace */}
          {data ? (
            <div className="flex flex-col w-full border-opacity-50">
              <div className="grid place-items-center">
                <OrderInformation data={data} isEdit={isEdit} />
              </div>
              <div className="divider" />
              <div className="grid place-items-center">
                <OrderDetail data={data} />
              </div>
            </div>
          ) : (
            <SkeletonLoading />
          )}
        </div>
      </main>
    </>
  );
};

export default OrderDetailPage;
