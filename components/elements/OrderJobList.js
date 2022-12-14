import QRCode from "react-qr-code";
import {
  SumOrderDetailBalQty, SumOrderDetailCtn
} from "../../hooks/greeter";

const OrderJobList = ({data}) => {
  return (
    <>
      <section>
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
                      <span className="text-lg uppercase">{data.invNo}</span>
                    </p>
                    <p className="">
                      Shipment:{` `}
                      <span className="uppercase">{data.shipmentType}</span>
                    </p>
                  </div>
                  <div className="flex justify-start mt-4 space-x-10">
                    <p className="">
                      ShipFrom:{` `}
                      <span className="uppercase">{data.shipFrom}</span>
                    </p>
                    <p className="">
                      ShipTo:{` `}
                      <span className="uppercase">{data.shipTo}</span>
                    </p>
                    <p className="">
                      Etd Date:{` `}QRCode
                      <span className="uppercase">{data.etd}</span>
                    </p>
                  </div>
                  <div className="flex justify-start mt-4 space-x-10">
                    <p className="">
                      Factory:{` `}
                      <span className="uppercase">{data.factory}</span>
                    </p>
                    <p className="">
                      GroupBy:{` `}
                      <span className="uppercase">{data.orderGroup}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex justify-center">
                  {data.refNo && (
                    <QRCode
                      size={256}
                      style={{
                        height: "80px",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      viewBox={`0 0 256 256`}
                      value={data.refNo}
                      title={data.refNo}
                    />
                  )}
                </div>
                <div className="flex justify-center">
                  Ref:{` `}
                  <span className="indent-2">{data.refNo}</span>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-2">
            <div className="overflow-x-auto">
              <table className="table w-full table-compact border-amber-800">
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
                  {data?.doc &&
                    data?.doc.map((i, x) => (
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
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3}>
                      <div className="flex justify-end">Total:</div>
                    </th>
                    <th>
                      <div className="flex justify-end">
                        {SumOrderDetailBalQty(data.doc)}
                      </div>
                    </th>
                    <th>
                      <div className="flex justify-end">
                        {SumOrderDetailCtn(data.doc)}
                      </div>
                    </th>
                    <th colSpan={5}></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default OrderJobList;
