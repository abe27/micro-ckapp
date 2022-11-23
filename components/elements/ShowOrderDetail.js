import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import {
  GenerateInvoice,
  ReDate,
  ReDateTime,
  SumCtn,
} from "../../hooks/greeter";

const ShowOrderDetail = ({ data, x, showAll = false ,filterCustomer='-',filterWhs='-'}) => {
  useEffect(() => {
    console.log(`Customer: ${filterCustomer} Whs: ${filterWhs}`)
  }, [filterCustomer,filterWhs])
  return (
    <>
      {!showAll ? (
        <tr className="hover hover:cursor-pointer" key={data.id}>
          <th>
            <Link
              href={`/order/plan?id=${data.id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {x + 1}
            </Link>
          </th>
          <td>
            <span
              className={
                data?.order_detail[0].orderplan.whs.title === "DOM"
                  ? `text-teal-600`
                  : data?.order_detail[0].orderplan.whs.title === "NESC"
                  ? "text-rose-600"
                  : data?.order_detail[0].orderplan.whs.title === "ICAM"
                  ? "text-violet-600"
                  : "text-blue-600"
              }
            >
              {data?.order_detail[0].orderplan.whs.title}
            </span>
          </td>
          <td>{ReDate(data.etd_date)}</td>
          <td>
            <span
              className={
                data.shipment.title === "A"
                  ? `text-rose-700`
                  : data.shipment.title === "T"
                  ? "text-violet-600"
                  : `text-gray-600`
              }
            >
              {data.shipment.description}
            </span>
          </td>
          <td>{data.consignee.affcode.title}</td>
          <td>
            <Tooltip
              label={`${data.consignee.customer.title}-${data.consignee.customer.description}`}
            >
              {data.consignee.customer.description}
            </Tooltip>
          </td>
          <td>
            <span
              className={
                data.commercial.title === "N" ? `text-rose-700` : `text-gray-600`
              }
            >
              {data.commercial.title}
            </span>
          </td>
          <td>
            <Link href={`/order/plan?id=${data.id}`}>
              <span
                className={data.is_invoice ? `text-rose-600` : `text-gray-600`}
              >
                <Tooltip
                  label={data.is_invoice ? `ยืนยันแล้ว` : `ยังไม่ได้ทำ Invoice`}
                >
                  {data.is_invoice ? GenerateInvoice(data) : "-"}
                </Tooltip>
              </span>
            </Link>
          </td>
          <td>{data.order_detail.length}</td>
          <td>{SumCtn(data.order_detail)}</td>
          <td>{ReDateTime(data.updated_at)}</td>
          <td>
            {data.is_invoice ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600 icon icon-tabler icon-tabler-check"
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
                <path d="M5 12l5 5l10 -10"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-x text-rose-700"
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </td>
        </tr>
      ) : (
        data.is_invoice && (
          <tr className="hover hover:cursor-pointer" key={data.id}>
            <th>
              <Link
                href={`/order/plan?id=${data.id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {x + 1}
              </Link>
            </th>
            <td>
              <span
                className={
                  data?.order_detail[0].orderplan.whs.title === "DOM"
                    ? `text-teal-600`
                    : data?.order_detail[0].orderplan.whs.title === "NESC"
                    ? "text-rose-600"
                    : data?.order_detail[0].orderplan.whs.title === "ICAM"
                    ? "text-violet-600"
                    : "text-blue-600"
                }
              >
                {data?.order_detail[0].orderplan.whs.title}
              </span>
            </td>
            <td>{ReDate(data.etd_date)}</td>
            <td>
              <span
                className={
                  data.shipment.title === "A"
                    ? `text-rose-700`
                    : data.shipment.title === "T"
                    ? "text-violet-600"
                    : `text-gray-600`
                }
              >
                {data.shipment.description}
              </span>
            </td>
            <td>{data.consignee.affcode.title}</td>
            <td>
              <Tooltip
                label={`${data.consignee.customer.title}-${data.consignee.customer.description}`}
              >
                {data.consignee.customer.description}
              </Tooltip>
            </td>
            <td>
              <span
                className={
                  data.commercial.title === "N" ? `text-rose-700` : `text-gray-600`
                }
              >
                {data.commercial.title}
              </span>
            </td>
            <td>
              <Link href={`/order/plan?id=${data.id}`}>
                <span
                  className={data.is_invoice ? `text-rose-600` : `text-gray-600`}
                >
                  <Tooltip
                    label={data.is_invoice ? `ยืนยันแล้ว` : `ยังไม่ได้ทำ Invoice`}
                  >
                    {data.is_invoice ? GenerateInvoice(data) : "-"}
                  </Tooltip>
                </span>
              </Link>
            </td>
            <td>{data.order_detail.length}</td>
            <td>{SumCtn(data.order_detail)}</td>
            <td>{ReDateTime(data.updated_at)}</td>
            <td>
              {data.is_invoice ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600 icon icon-tabler icon-tabler-check"
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
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x text-rose-700"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </td>
          </tr>
        )
      )}
    </>
  );
};

export default ShowOrderDetail;
