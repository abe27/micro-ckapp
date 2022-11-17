import {
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  PencilIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  NavBar,
  OrderDetail,
  OrderInformation,
  OrderLabel,
  OrderPallet,
  SkeletonLoading,
} from "../../components";

const ReDate = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)}`;
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
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  /* set variable */
  const [isEdit, setIsEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [data, setData] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderPallet, setOrderPallet] = useState(null);

  const FetchOrder = async () => {
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

      console.dir(`${process.env.API_HOST}/order/ent/${id}`);

      const res = await fetch(
        `${process.env.API_HOST}/order/ent/${id}`,
        requestOptions
      );

      if (!res.ok) {
        toast({
          title: `เกิดข้อผิดพลาด ${res.status}!`,
          duration: 3000,
          status: "error",
          position: "top",
          isClosable: true,
        });
      }

      if (res.ok) {
        const obj = await res.json();
        setData(obj.data);
        setOrderDetail(obj.data.order_detail);
        setOrderPallet(obj.data.pallet);
      }
      setIsLoading(false);
    }
  };

  const FetchOrderDetail = async () => {
    // setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/detail?order_id=${id}`,
      requestOptions
    );

    if (!res.ok) {
      toast({
        title: `เกิดข้อผิดพลาด ${res.status}!`,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const obj = await res.json();
      setOrderDetail(obj.data);
    }
    // setIsLoading(false);
  };

  const FetchPalletList = async () => {
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
      const data = await res.json();
      toast({
        title: `เกิดข้อผิดพลาด รหัส: ${res.status}!`,
        description: data.message,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const obj = await res.json();
      // console.dir(obj.data);
      setOrderPallet(obj.data);
    }
  };

  const confirmUpdateDetail = async (obj) => {
    // setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("revise_id", "Q");
    urlencoded.append("order_id", obj.order_id);
    urlencoded.append("pono", obj.pono);
    urlencoded.append("ledger_id", obj.ledger_id);
    urlencoded.append("order_plan_id", obj.order_plan_id);
    urlencoded.append("order_ctn", obj.order_ctn);
    urlencoded.append("total_on_pallet", obj.total_on_pallet);

    console.log(urlencoded);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/detail/${obj.id}`,
      requestOptions
    );

    if (!res.ok) {
      const data = await res.json();
      toast({
        title: `เกิดข้อผิดพลาด รหัส: ${res.status}!`,
        description: data.message,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        duration: 3000,
        status: "success",
        position: "top",
        isClosable: true,
      });
      FetchOrderDetail();
    }
    // setIsLoading(false);
  };

  const confirmDeleteDetail = async (obj) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/detail/${obj.id}`,
      requestOptions
    );

    if (res.status === 404) {
      toast({
        title: `ไม่พบข้อมูลที่ต้องการลบ!`,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        duration: 3000,
        status: "success",
        position: "top",
        isClosable: true,
      });
      FetchOrderDetail();
    }
  };

  const confirmAddNewItem = async (obj) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("pono", obj.pono);
    urlencoded.append("part_no", obj.partno);
    urlencoded.append("order_balqty", obj.qty);
    urlencoded.append("order_ctn", obj.ctn);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/detail?order_id=${id}`,
      requestOptions
    );

    if (!res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        duration: 3000,
        status: "success",
        position: "top",
        isClosable: true,
      });
      FetchOrderDetail();
    }
  };

  const confirmDeleteShippingLabel = (id, status) => {
    console.log(`Delete id: ${id} status: ${status}`);
  };

  const confirmPrintLabel = async (obj, status) => {
    if (status) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var urlencoded = new URLSearchParams();
      urlencoded.append("invoice_no", `${ReInvoice(data)}/${obj.seq}`);
      urlencoded.append("order_no", obj.doc.order_detail.pono);
      urlencoded.append("part_no", obj.part_no);
      urlencoded.append("qty", obj.doc.order_detail.orderplan.bistdp);
      urlencoded.append("cust_code", obj.doc.order_detail.orderplan.bishpc);
      urlencoded.append("cust_name", obj.doc.order_detail.orderplan.bisafn);
      urlencoded.append("pallet_no", obj.pallet_no);
      urlencoded.append("print_date", ReDate(obj.last_updated));
      urlencoded.append("bar_code", obj.seq_no);
      urlencoded.append("is_print", "0");
      // console.dir(urlencoded);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };
      const res = await fetch(
        `${process.env.API_HOST}/order/label`,
        requestOptions
      );

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: data.message,
          duration: 3000,
          status: "error",
          position: "top",
          isClosable: true,
        });
      }

      if (res.ok) {
        const data = await res.json();
        toast({
          title: data.message,
          duration: 3000,
          status: "success",
          position: "top",
          isClosable: true,
        });
        // FetchPalletList();
      }
    }
  };

  const confirmPrintLabelAll = () => {
    console.dir("select all");
  };

  const confirmSync = async (id, status) => {
    console.log(`Confirm sync id: ${id} status: ${status}`);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/order/detail/${id}`,
      requestOptions
    );
    if (!res.ok) {
      const data = await res.json();
      toast({
        title: `เกิดข้อผิดพลาด ${data.message}!`,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }

    if (res.ok) {
      const data = await res.json();
      toast({
        title: `${data.message}!`,
        duration: 2500,
        status: "success",
        position: "top",
        isClosable: true,
        onCloseComplete: () => {
          setIsEdit(!isEdit);
          FetchOrder();
        },
      });
    }
  };

  const confirmAddPartToPallet = async (obj) => {
    console.dir(obj);
    // FetchOrderDetail();
  };

  useEffect(() => {
    if (id) {
      FetchOrder();
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
                  <span>Filter on {ReDate(data?.etd_date)}</span>
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
            </div>
          </div>
          {/* /End replace */}
          <section className="mt-4">
            {isLoading ? (
              <SkeletonLoading />
            ) : data ? (
              <Tabs isLazy align="end" variant="enclosed">
                <TabList>
                  <Tab>
                    <span className="text-sm">รายละเอียด</span>
                  </Tab>
                  <Tab>
                    <span className="text-sm">รายการสินค้า</span>
                  </Tab>
                  <Tab>
                    <span className="text-sm">รายการพาเลท</span>
                  </Tab>
                  <Tab>
                    <span className="text-sm">รายลาเบล</span>
                  </Tab>
                </TabList>
                <TabPanels>
                  confirmPrintLabelAll
                  <TabPanel>
                    <OrderInformation
                      data={data}
                      isEdit={isEdit}
                      confirmSync={confirmSync}
                    />
                  </TabPanel>
                  <TabPanel>
                    <OrderDetail
                      data={orderDetail}
                      palletData={orderPallet}
                      delData={confirmDeleteDetail}
                      updateData={confirmUpdateDetail}
                      addNewItem={confirmAddNewItem}
                      addPartToPallet={confirmAddPartToPallet}
                    />
                  </TabPanel>
                  <TabPanel>
                    <OrderPallet
                      data={orderPallet}
                      reloadData={FetchPalletList}
                    />
                  </TabPanel>
                  <TabPanel>
                    <OrderLabel
                      data={orderPallet}
                      confirmDelete={confirmDeleteShippingLabel}
                      confirmPrintLabel={confirmPrintLabel}
                      PrintLabelAll={confirmPrintLabelAll}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <SkeletonLoading />
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default OrderDetailPage;
