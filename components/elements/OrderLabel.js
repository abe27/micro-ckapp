import { PrinterIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { ReDateTime } from "../../hooks/greeter";
import AlertDialogPrintShippingLabel from "./AlertDialogPrintShippingLabel";
import AlertConfirmShort from "./AlertConfirmShort";
import SelectPrintShipping from "./SelectPrintShipping";
import SkeletonLoading from "./SkeletonLoading";

const OrderLabel = ({ data, confirmDelete, confirmPrintLabel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fticketData, setFTicketData] = useState(null);
  const [sortList, setSortList] = useState(fticketData);
  const [slAll, setSlAll] = useState(false);
  const [selectLabelId, setSelectLabelId] = useState(null);
  const [partList, setPartList] = useState(null);
  const [partId, setPartId] = useState(null);

  const selectShipping = (e) => {
    setSortList((prevState) => {
      const newItems = [...prevState];
      newItems[e.target.id].is_checked = e.target.checked;
      return newItems;
    });
  };

  const confirmPrintLabelAll = () => {
    let slData = [];
    sortList.map((i) => {
      if (i.is_checked) {
        slData.push(i);
      }
    });
    confirmPrintLabel(slData, true);
  };

  const selectAllLabel = (e) => {
    // console.dir(e.target.checked);
    setSlAll(e.target.checked);
    setSortList((prevState) => {
      const items = [...prevState];
      items.map((i) => (i.is_checked = e.target.checked));
      return items;
    });
  };

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      let parts = ["-"];
      let doc = [];
      let x = 1;
      data.map((i) => {
        console.dir(i)
        if (i.pallet_detail) {
          let pl_no = `${i.pallet_prefix}${("000" + i.pallet_no).slice(-3)}`;
          i.pallet_detail.map((j) => {
            let d = new Date(j.created_at);
            let y = d.getFullYear().toString().substring(3, 4);
            // console.dir(j)
            let obj = {
              seq: x,
              shipping_id: j.id,
              pallet_no: pl_no,
              seq_no: `${j.order_detail.ledger.factory.label_prefix}${y}${(
                "00000000" + j.seq_no
              ).slice(-8)}`,
              part_no: j.order_detail.ledger.part.title,
              part_name: j.order_detail.ledger.part.description,
              is_checked: false,
              last_updated: j.updated_at,
              doc: j,
            };
            if (parts.indexOf(j.order_detail.ledger.part.title) < 0) {
              parts.push(j.order_detail.ledger.part.title);
            }
            //   console.dir(j);
            doc.push(obj);
            x++;
          });
        }
      });
      parts.sort();
      setPartList(parts);
      setFTicketData(doc);
      setSortList(doc);
      setIsLoading(false);
    }
  }, [data]);
  return (
    <>
      {!isLoading ? (
        <>
          <table className="table w-full table-compact">
            <thead>
              <tr>
                <th>{selectLabelId}</th>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-warning"
                    defaultValue={slAll}
                    onChange={selectAllLabel}
                  />
                </th>
                <th>เลขที่ shipping no</th>
                <th>สินค้า</th>
                <th></th>
                <th>เลขที่ PO</th>
                <th>เลขที่พาเลท</th>
                {/* <th></th> */}
                <th>
                  <span className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                      onClick={confirmPrintLabelAll}
                    >
                      <PrinterIcon
                        className="w-5 h-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      ปริ้นลาเบล
                    </button>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortList ? (
                sortList?.map((i, x) => (
                  <tr className="hover" key={i.shipping_id}>
                    <th>{x + 1}</th>
                    <td>
                      <SelectPrintShipping
                        id={x}
                        isChecked={i.is_checked}
                        selectShipping={selectShipping}
                      />
                    </td>
                    <td>{i.seq_no}</td>
                    <td>{i.part_no}</td>
                    <td>{i.part_name}</td>
                    <td>{i.doc.order_detail.pono}</td>
                    <td>{i.pallet_no}</td>
                    {/* <td>{ReDateTime(i.last_updated)}</td> */}
                    <td>
                      <div className="flex justify-end space-x-4">
                        <AlertDialogPrintShippingLabel
                          seq={x + 1}
                          data={i}
                          title={`ปริ้นลาเบล ${i.seq_no}`}
                          description={`คุณต้องการที่จะปริ้นลาเบล ${i.seq_no} นี้ใช่หรือไม่?`}
                          onCommit={confirmPrintLabel}
                        />
                        <AlertConfirmShort
                          data={i}
                          onCommit={confirmDelete}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <SkeletonLoading />
      )}
    </>
  );
};

export default OrderLabel;
