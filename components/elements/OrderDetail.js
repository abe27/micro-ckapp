import { Tooltip } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";

const ReDateTime = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
    -2
  )}`;
};

const OrderDetail = ({ data }) => {
  useEffect(() => {
    if (data) {
      console.dir(data.order_detail);
    }
  }, [data]);
  return (
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th></th>
          <th>Po</th>
          <th>Part</th>
          <th></th>
          <th>qty</th>
          <th>ctn</th>
          <th>revise</th>
          <th colSpan={2}>
            <div className="flex items-end justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                เพิ่มข้อมูลใหม่
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.order_detail.map((i, x) => (
          <tr key={i.id} className="hover">
            <th>{x + 1}</th>
            <td>{i.pono}</td>
            <td>{i.ledger.part.title}</td>
            <td>{i.ledger.part.description}</td>
            <td>{i.orderplan.balqty.toLocaleString()}</td>
            <td>
              {i.orderplan.balqty > 0
                ? (i.orderplan.balqty / i.orderplan.bistdp).toLocaleString()
                : `0`}
            </td>
            <td>{i.orderplan.reasoncd}</td>
            <td>{ReDateTime(i.orderplan.updtime)}</td>
            <td>
              <div className="flex justify-end">
                <Tooltip label={`แก้ไขข้อมูล ${i.ledger.part.title}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-pencil text-orange-500 hover:cursor-pointer"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                    <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                  </svg>
                </Tooltip>
                <Tooltip label={`ลบข้อมูล ${i.ledger.part.title}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-trash text-rose-600 hover:cursor-pointer"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="4" y1="7" x2="20" y2="7"></line>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                  </svg>
                </Tooltip>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderDetail;
