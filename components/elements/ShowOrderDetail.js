import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import {
  GenerateInvoice,
  ReDate,
  SumCtn,
  ReDateTime,
} from "../../hooks/greeter";

const ShowOrderDetail = ({ i, x, showAll = false }) => {
  return (
    <>
      {showAll ? (
        <tr className="hover hover:cursor-pointer" key={i.id}>
          <th>
            <Link
              href={`/order/plan?id=${i.id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {x + 1}
            </Link>
          </th>
          <td>
            <span
              className={
                i.order_detail[0].orderplan.whs.title === "DOM"
                  ? `text-teal-600`
                  : i.order_detail[0].orderplan.whs.title === "NESC"
                  ? "text-rose-600"
                  : i.order_detail[0].orderplan.whs.title === "ICAM"
                  ? "text-violet-600"
                  : "text-blue-600"
              }
            >
              {i.order_detail[0].orderplan.whs.title}
            </span>
          </td>
          <td>{ReDate(i.etd_date)}</td>
          <td>
            <span
              className={
                i.shipment.title === "A"
                  ? `text-rose-700`
                  : i.shipment.title === "T"
                  ? "text-violet-600"
                  : `text-gray-600`
              }
            >
              {i.shipment.description}
            </span>
          </td>
          <td>{i.consignee.affcode.title}</td>
          <td>
            <Tooltip
              label={`${i.consignee.customer.title}-${i.consignee.customer.description}`}
            >
              {i.consignee.customer.description}
            </Tooltip>
          </td>
          <td>
            <span
              className={
                i.commercial.title === "N" ? `text-rose-700` : `text-gray-600`
              }
            >
              {i.commercial.title}
            </span>
          </td>
          <td>
            <Link href={`/order/plan?id=${i.id}`}>
              <span
                className={i.is_invoice ? `text-rose-600` : `text-gray-600`}
              >
                <Tooltip
                  label={i.is_invoice ? `ยืนยันแล้ว` : `ยังไม่ได้ทำ Invoice`}
                >
                  {i.is_invoice ? GenerateInvoice(i) : "-"}
                </Tooltip>
              </span>
            </Link>
          </td>
          <td>{i.order_detail.length}</td>
          <td>{SumCtn(i.order_detail)}</td>
          <td>{ReDateTime(i.updated_at)}</td>
          <td>
            {i.is_invoice ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-check text-green-600"
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
        i.is_invoice && (
          <tr className="hover hover:cursor-pointer" key={i.id}>
            <th>
              <Link
                href={`/order/plan?id=${i.id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {x + 1}
              </Link>
            </th>
            <td>
              <span
                className={
                  i.order_detail[0].orderplan.whs.title === "DOM"
                    ? `text-teal-600`
                    : i.order_detail[0].orderplan.whs.title === "NESC"
                    ? "text-rose-600"
                    : i.order_detail[0].orderplan.whs.title === "ICAM"
                    ? "text-violet-600"
                    : "text-blue-600"
                }
              >
                {i.order_detail[0].orderplan.whs.title}
              </span>
            </td>
            <td>{ReDate(i.etd_date)}</td>
            <td>
              <span
                className={
                  i.shipment.title === "A"
                    ? `text-rose-700`
                    : i.shipment.title === "T"
                    ? "text-violet-600"
                    : `text-gray-600`
                }
              >
                {i.shipment.description}
              </span>
            </td>
            <td>{i.consignee.affcode.title}</td>
            <td>
              <Tooltip
                label={`${i.consignee.customer.title}-${i.consignee.customer.description}`}
              >
                {i.consignee.customer.description}
              </Tooltip>
            </td>
            <td>
              <span
                className={
                  i.commercial.title === "N" ? `text-rose-700` : `text-gray-600`
                }
              >
                {i.commercial.title}
              </span>
            </td>
            <td>
              <Link href={`/order/plan?id=${i.id}`}>
                <span
                  className={i.is_invoice ? `text-rose-600` : `text-gray-600`}
                >
                  <Tooltip
                    label={i.is_invoice ? `ยืนยันแล้ว` : `ยังไม่ได้ทำ Invoice`}
                  >
                    {i.is_invoice ? GenerateInvoice(i) : "-"}
                  </Tooltip>
                </span>
              </Link>
            </td>
            <td>{i.order_detail.length}</td>
            <td>{SumCtn(i.order_detail)}</td>
            <td>{ReDateTime(i.updated_at)}</td>
            <td>
              {i.is_invoice ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-check text-green-600"
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
