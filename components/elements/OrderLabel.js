import {
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
  InputGroup,
  InputRightElement,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SkeletonLoading from "./SkeletonLoading";
import AlertDialogQuestion from "./AlertDialogQuestion";
import AlertDialogPrintShippingLabel from "./AlertDialogPrintShippingLabel";
import { CheckIcon, PrinterIcon } from "@heroicons/react/20/solid";

const ReDateTime = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
    -2
  )}`;
};

const OrderLabel = ({ data, confirmDelete, confirmPrintLabel }) => {
  const [fticketData, setFTicketData] = useState(null);
  const [filterPart, setFilterPart] = useState(null);
  const [sortList, setSortList] = useState(fticketData);

  const sortData = () => {
    console.dir(filterPart);
    return sortList.filter((x) => x.part_no.includes(filterPart));
  };

  const filterData = (e) => {
    setFilterPart(e.target.value);
    let doc = sortData();
    setSortList(doc);
  };

  useEffect(() => {
    if (data) {
      let doc = [];
      data.map((i) => {
        let pl_no = `${i.pallet_prefix}${("000" + i.pallet_no).slice(-3)}`;
        i.pallet_detail.map((j) => {
          let d = new Date(j.created_at);
          let y = d.getFullYear().toString().substring(3, 4);
          let obj = {
            shipping_id: j.id,
            pallet_no: pl_no,
            seq_no: `${j.order_detail.ledger.factory.label_prefix}${y}${(
              "00000000" + j.seq_no
            ).slice(-8)}`,
            part_no: j.order_detail.ledger.part.title,
            part_name: j.order_detail.ledger.part.description,
            checked: true,
            last_updated: j.updated_at,
            doc: j,
          };
          //   console.dir(j);
          doc.push(obj);
        });
      });

      setFTicketData(doc);
      setSortList(doc);
    }
  }, [data]);
  return (
    <>
      {fticketData ? (
        <>
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-warning"
                    />
                  </th>
                  <th>เลขที่ shipping no</th>
                  <th>
                    <Popover>
                      <PopoverTrigger>
                        <section className="flex space-x-2 hover:cursor-pointer">
                          <span>สินค้า</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-filter"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            stroke-width="2"
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
                            <path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5"></path>
                          </svg>
                        </section>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>กรองข้อมูลสินค้า!</PopoverHeader>
                        <PopoverBody>
                          <InputGroup>
                            <Input
                              placeholder="ระบุสินค้า"
                              defaultValue={filterPart}
                              onChange={filterData}
                            />
                            <InputRightElement
                              children={
                                <CheckIcon
                                  onClick={() => setFilterPart("")}
                                  className="-ml-1 mr-2 h-5 w-5 text-green-600 hover:cursor-pointer"
                                />
                              }
                            />
                          </InputGroup>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </th>
                  <th></th>
                  <th>เลขที่พาเลท</th>
                  <th></th>
                  <th>
                    <span className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                      >
                        <PrinterIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        ปริ้นลาเบลทั้งหมด
                      </button>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortList ? (
                  sortList.map((i, x) => (
                    <tr className="hover" key={i.shipping_id}>
                      <th>{x + 1}</th>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-warning"
                        />
                      </td>
                      <td>{i.seq_no}</td>
                      <td>{i.part_no}</td>
                      <td>{i.part_name}</td>
                      <td>{i.pallet_no}</td>
                      <td>{ReDateTime(i.last_updated)}</td>
                      <td>
                        <div className="flex space-x-4 justify-end">
                          <Tooltip label={`ลบ ${i.seq_no} นี้`}>
                            <AlertDialogPrintShippingLabel
                              id={i.shipping_id}
                              title={`ปริ้นลาเบล ${i.seq_no}`}
                              description={`คุณต้องการที่จะปริ้นลาเบล ${i.seq_no} นี้ใช่หรือไม่?`}
                              onCommit={confirmPrintLabel}
                            />
                          </Tooltip>
                          <Tooltip label={`ลบ ${i.seq_no} นี้`}>
                            <AlertDialogQuestion
                              id={i.shipping_id}
                              title={`ลบ ${i.seq_no} นี้`}
                              description={`คุณต้องการที่จะลบ ${i.seq_no} นี้ใช่หรือไม่?`}
                              onCommit={confirmDelete}
                            />
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
          {/* {fticketData?.length > 30 && (
            <div className="mt-4 flex justify-center">
              <div className="btn-group">
                <button className="btn btn-sm">1</button>
                <button className="btn btn-sm btn-active">2</button>
                <button className="btn btn-sm">3</button>
                <button className="btn btn-sm">4</button>
              </div>
            </div>
          )} */}
        </>
      ) : (
        <SkeletonLoading />
      )}
    </>
  );
};

export default OrderLabel;
