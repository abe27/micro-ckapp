import {
  NavBar,
  ModalAddNewPallet,
  AlertDialogQuestion,
} from "../../../components";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  CogIcon,
  PlusIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

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

const Summary = (i) => {
  let x = 0;
  i?.map((j) => {
    if (j.pallet_detail !== undefined) {
      x += j.pallet_detail.length;
    }
  });
  return x.toLocaleString();
};

const PalletPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [palletList, setPalletList] = useState(null);
  const [showPalletDetail, setShowPalletDetail] = useState(false);

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
      const res = await fetch(
        `${process.env.API_HOST}/order/pallet?order_id=${id}`,
        requestOptions
      );

      if (!res.ok) {
        console.log(res.status);
      }

      if (res.ok) {
        const obj = await res.json();
        // console.dir(obj.data);
        setData(obj.data);
      }
      setIsLoading(false);
    }
  };

  const AddNewPallet = async (obj) => {
    let plPrefix = "P";
    if (obj[1][0]["type"] === "-") {
      plPrefix = "C";
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("order_id", id);
    urlencoded.append("pallet_type_id", obj[1][0]["id"]);
    urlencoded.append("pallet_prefix", plPrefix);
    urlencoded.append("pallet_no", obj[0]);
    urlencoded.append("pallet_total", obj[1][0]["limit_total"]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/pallet`,
      requestOptions
    );

    if (res.ok) {
      FetchOrderDetail();
    }
  };

  const DeletePallet = async (pl_id, isDelete) => {
    if (isDelete) {
      console.dir(`delete ${pl_id}`);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.API_HOST}/order/pallet/${pl_id}`,
        requestOptions
      );

      if (res.ok) {
        FetchOrderDetail();
      }
    }
  };

  const showDetail = (obj) => {
    setShowPalletDetail(!showPalletDetail);
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
        title={`Set Pallet`}
        description={`จัดการข้อมูลการ Set Pallet`}
      />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <strong className="tfont-bold text-gray-900">
                เลขที่เอกสาร: {ReInvoice(data?.order)}
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
                <ModalAddNewPallet
                  lastPalletNo={data?.length}
                  onCommitData={AddNewPallet}
                />
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
                    Dimension
                  </button>
                </Link>
              </span>
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={FetchOrderDetail}
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
          <div className="mt-6 overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>เลขที่</th>
                  <th>ประเภท</th>
                  <th>กว้าง</th>
                  <th>ยาว</th>
                  <th>สูง</th>
                  <th>จำนวน/พาเลท</th>
                  <th>ชั้น</th>
                  <th>หน่วย</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data != null &&
                  data?.map((i, x) => (
                    <tr key={i.id}>
                      <th>{x + 1}</th>
                      <td>
                        <Link
                          href={`/order/pallet/detail?id=${i.id}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {`${i.pallet_prefix}${("000" + i.pallet_no).slice(
                            -3
                          )}`}
                        </Link>
                      </td>
                      <td>{i.pallet_type.type}</td>
                      <td>{i.pallet_type.pallet_size_width}</td>
                      <td>{i.pallet_type.pallet_size_length}</td>
                      <td>{i.pallet_type.pallet_size_hight}</td>
                      <td>
                        {i.pallet_detail === null
                          ? `0`
                          : i.pallet_detail?.length}
                      </td>
                      <td>{i.pallet_type.floors}</td>
                      <td>CM./P</td>
                      <td>
                        <div className="flex justify-end space-x-2">
                          <span className="hover:cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-pencil text-orange-600"
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
                              <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                              <line
                                x1="13.5"
                                y1="6.5"
                                x2="17.5"
                                y2="10.5"
                              ></line>
                            </svg>
                          </span>
                          <AlertDialogQuestion
                            id={i.id}
                            title={`ลบ ${i.pallet_prefix}${(
                              "000" + i.pallet_no
                            ).slice(-3)}`}
                            description={`คุณต้องการที่จะลบ ${`${
                              i.pallet_prefix
                            }${("000" + i.pallet_no).slice(
                              -3
                            )}`} นี้ใช่หรือไม่?`}
                            onCommit={DeletePallet}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={6}>
                    <div className="flex justify-center">ผลรวม</div>
                  </th>
                  <th>{Summary(data)}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
          {showPalletDetail ? (
            <div className="mt-6 overflow-x-auto">test</div>
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
};

export default PalletPage;
