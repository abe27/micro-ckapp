import { Spinner, useToast } from "@chakra-ui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import ReactDOMServer from "react-dom/server";
import QRCode from "react-qr-code";
import { OrderJobList } from "../../components";
import TestGeneratePDF from "../../components/elements/TestGeneratePDF";
import {
  GenerateInvoice,
  ReEtdDate,
  SumOrderDetailBalQty,
  SumOrderDetailCtn,
} from "../../hooks/greeter";

const JobListPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [invNo, setInvNo] = useState(null);
  const [shipmentType, setShipmentType] = useState(null);
  const [shipFrom, setShipFrom] = useState(null);
  const [shipTo, setShipTo] = useState(null);
  const [etd, setEtd] = useState(null);
  const [factory, setFactory] = useState(null);
  const [orderGroup, setOrderGroup] = useState(null);
  const [refNo, setRefNo] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const FetchData = async () => {
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
    // if (!res.ok) {
    //   const data = await res.json();
    //   toast({
    //     title: `เกิดข้อผิดพลาด!`,
    //     duration: 3000,
    //     status: "error",
    //     position: "top",
    //     isClosable: true,
    //   });
    // }

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data);
      setOrderDetail(data.data);
      let obj = data.data[0];
      let inv = GenerateInvoice(obj.order);
      setInvNo(inv);
      setRefNo(inv);
      setShipmentType(obj.order.shipment.description);
      setShipFrom(obj.order.consignee.affcode.title);
      setShipTo(obj.order.consignee.customer.description);
      setEtd(ReEtdDate(obj.order.etd_date));
      setFactory(obj.order.consignee.factory.title);
      setOrderGroup(obj.orderplan.order_groups);
    }
  };

  const GeneratePDF = () => {
    // const doc = new jsPDF({
    //   orientation: "p",
    //   unit: "mm",
    //   format: "a4",
    //   putOnlyUsedFonts: true,
    // });
    // // autoTable(doc, {
    // //   theme: "striped",
    // //   StyleDef: { halign: "center" },
    // //   html: "#data",
    // // });
    // doc.html(<span>TestGeneratePDF</span>);
    // doc.save("table.pdf");

    let element = <TestGeneratePDF />;
    const doc = new jsPDF("p", "pt", "letter");
    doc.html(ReactDOMServer.renderToString(element), {
      callback: function (doc) {
        doc.save('sample.pdf');
      }
    });
  };

  useEffect(() => {
    if (id !== undefined) {
      FetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session?.user]);

  return (
    <>
      <Head>
        <title>Print JobOrder {id}</title>
        <meta name="description" content={id} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="pdfPage">
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <section>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex justify-center col-span-4">
                <p className="uppercase">Job Order List</p>
              </div>
              <div className="flex col-span-3 space-x-8">
                <div className="grid grid-flow-row auto-rows-max">
                  <div className="flex justify-start space-x-10">
                    <p className="">
                      Invoice No.:{` `}
                      <span className="text-lg uppercase">{invNo}</span>
                    </p>
                    <p className="">
                      Shipment:{` `}
                      <span className="uppercase">{shipmentType}</span>
                    </p>
                  </div>
                  <div className="flex justify-start mt-4 space-x-10">
                    <p className="">
                      ShipFrom:{` `}
                      <span className="uppercase">{shipFrom}</span>
                    </p>
                    <p className="">
                      ShipTo:{` `}
                      <span className="uppercase">{shipTo}</span>
                    </p>
                    <p className="">
                      Etd Date:{` `}
                      <span className="uppercase">{etd}</span>
                    </p>
                  </div>
                  <div className="flex justify-start mt-4 space-x-10">
                    <p className="">
                      Factory:{` `}
                      <span className="uppercase">{factory}</span>
                    </p>
                    <p className="">
                      GroupBy:{` `}
                      <span className="uppercase">{orderGroup}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex justify-center">
                  {refNo && (
                    <QRCode
                      size={256}
                      style={{
                        height: "80px",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      viewBox={`0 0 256 256`}
                      value={refNo}
                      title={refNo}
                    />
                  )}
                </div>
                <div className="flex justify-center">
                  Ref:{` `}
                  <span className="indent-2">{refNo}</span>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-2">
            <div className="overflow-x-auto">
              <table id="data" className="table w-full table-compact">
                <thead>
                  <tr>
                    <th colSpan={6}>
                      <div className="flex justify-center">Order Detail</div>
                    </th>
                    <th colSpan={4}>
                      <div className="justify-center flext">
                        Stock(Last Fifo)
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>PartNo.</th>
                    <th>Order No.</th>
                    <th>
                      <div className="flex justify-end">Qty.</div>
                    </th>
                    <th>
                      <div className="flex justify-end">Ctn.</div>
                    </th>
                    <th>LotNo.</th>
                    <th>Location</th>
                    <th>PalletNo</th>
                    <th>Ctn.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail &&
                    orderDetail.map(
                      (i, x) =>
                        i.total_on_pallet > 0 && (
                          <tr key={i.id}>
                            <th>{x + 1}</th>
                            <td>{i.orderplan.part_no}</td>
                            <td>{i.pono}</td>
                            <td>
                              <div className="flex justify-end">
                                {i.orderplan.balqty.toLocaleString()}
                              </div>
                            </td>
                            <td>
                              <div className="flex justify-end">
                                {i.order_ctn.toLocaleString()}
                              </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        )
                    )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3}>
                      <div className="flex justify-end">Total:</div>
                      <a href="javascript:genPDF()">Download PDF</a>  
                    </th>
                    <th>
                      <div className="flex justify-end">
                        {SumOrderDetailBalQty(orderDetail)}
                      </div>
                    </th>
                    <th>
                      <div className="flex justify-end">
                        {SumOrderDetailCtn(orderDetail)}
                      </div>
                    </th>
                    <th colSpan={5}>
                      <div className="flex justify-end">
                        {isLoading ? (
                          <Spinner color="red.500" />
                        ) : (
                          // <button
                          //   className="btn btn-sm"
                          //   onClick={() => window.print()}
                          // >
                          //   ปริ้นเอกสาร
                          // </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => GeneratePDF()}
                          >
                            ปริ้นเอกสาร
                          </button>
                        )}
                      </div>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default JobListPage;
