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
import { GenerateInvoice, ReDate } from "../../hooks/greeter";

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

  const confirmDeleteShippingLabel = async (obj, status) => {
    if (status) {
      console.dir(obj)
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
      var urlencoded = new URLSearchParams();
      urlencoded.append("order_shipping_id", obj.shipping_id)
      urlencoded.append("order_detail_id", obj.doc.order_detail.id);
      urlencoded.append("order_plan_id", obj.doc.order_detail.orderplan.id);
      urlencoded.append("order_etd", `${obj.etd_tap}T00:00:00.000Z`);
      urlencoded.append("order_ctn", obj.doc.order_detail.order_ctn - 1)
      urlencoded.append("ctn", 1);
  
      console.dir(urlencoded)
  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };
  
      const res = await fetch(`${process.env.API_HOST}/order/short`, requestOptions)
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
        FetchOrderDetail()
        FetchPalletList();
      }
    }
  };

  const confirmPrintLabel = async (obj, status) => {
    if (status) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);
      myHeaders.append("Content-Type", "application/json");

      let body = [];
      obj.map((i) => {
        body.push({
          invoice_no: `${GenerateInvoice(data)}/${i.seq}`,
          order_no: i.doc.order_detail.pono,
          part_no: i.part_no,
          qty: i.doc.order_detail.orderplan.bistdp,
          cust_code: i.doc.order_detail.orderplan.bishpc,
          cust_name: i.doc.order_detail.orderplan.bisafn,
          pallet_no: i.pallet_no,
          print_date: ReDate(i.last_updated),
          bar_code: i.seq_no,
          is_print: 0,
        });
      });

      // console.dir(body);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
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
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("pallet_id", obj.palletId);
    urlencoded.append("part_id", obj.partId);
    urlencoded.append("seq", obj.total);

    console.dir(urlencoded);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/invoice/shipping_label`,
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
      });
      FetchOrderDetail();
      FetchPalletList();
    }
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
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                เลขที่เอกสาร: {GenerateInvoice(data)}
              </strong>
              <div className="flex flex-col mt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <BriefcaseIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/archive`}>Archive</Link>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <CloudIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/edi`}>Remote EDI</Link>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                    aria-hidden="true"
                  />
                  <span>Filter on {ReDate(data?.etd_date)}</span>
                </div>
              </div>
            </div>
            <div className="flex mt-5 lg:mt-0 lg:ml-4">
              <span className="hidden ml-3 sm:block">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <PencilIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  {isEdit ? `ปิดแก้ไข` : `เปิดแก้ไข`}
                </button>
              </span>
              <span className="hidden ml-3 sm:block">
                <Link
                  href={`/order/joblist?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PrinterIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    JobList
                  </button>
                </Link>
              </span>
              <span className="hidden ml-3 sm:block">
                <Link
                  href={`/order/pallet?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <PrinterIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    Dimension
                  </button>
                </Link>
              </span>

              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => FetchOrder()}
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
