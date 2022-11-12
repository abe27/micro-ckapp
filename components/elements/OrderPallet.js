import { NavBar, ModalAddNewPallet, AlertDialogQuestion } from "../index";
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

const OrderPallet = ({ data, reloadData }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

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
      reloadData();
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
        reloadData();
      }
    }
  };

  return (
    <>
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
            <th>
              <span className="flex justify-end">
                <ModalAddNewPallet
                  lastPalletNo={data?.length}
                  onCommitData={AddNewPallet}
                />
              </span>
            </th>
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
                    {`${i.pallet_prefix}${("000" + i.pallet_no).slice(-3)}`}
                  </Link>
                </td>
                <td>{i.pallet_type.type}</td>
                <td>{i.pallet_type.pallet_size_width}</td>
                <td>{i.pallet_type.pallet_size_length}</td>
                <td>{i.pallet_type.pallet_size_hight}</td>
                <td>
                  {i.pallet_detail === null ? `0` : i.pallet_detail?.length}
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
                        <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                      </svg>
                    </span>
                    <AlertDialogQuestion
                      id={i.id}
                      title={`ลบ ${i.pallet_prefix}${(
                        "000" + i.pallet_no
                      ).slice(-3)}`}
                      description={`คุณต้องการที่จะลบ ${`${i.pallet_prefix}${(
                        "000" + i.pallet_no
                      ).slice(-3)}`} นี้ใช่หรือไม่?`}
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
    </>
  );
};

export default OrderPallet;
