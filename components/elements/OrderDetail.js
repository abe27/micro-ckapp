import { useEffect, useState } from "react";
import ModalOrderPart from "./ModalOrderPart";
import ConfirmDialog from "./ConfirmDeleteItemDialog";
import ModalAddNewItem from "./ModalAddNewItem";
import AddPartToPallet from "./AddPartToPallet";
import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";

const ReDateTime = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
    -2
  )}`;
};

const SumCtn = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map((i) => {
      ctn += i.orderplan.balqty / i.orderplan.bistdp;
    });
  }
  return ctn.toLocaleString();
};

const SumSetPalletCtn = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map((i) => {
      if (i.total_on_pallet > 0) {
        ctn += i.total_on_pallet;
      }
    });
  }
  return ctn.toLocaleString();
};

const SumQty = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map((i) => {
      ctn += i.orderplan.balqty;
    });
  }
  return ctn.toLocaleString();
};

const OrderDetail = ({
  data,
  palletData = [],
  delData,
  updateData,
  addNewItem,
  addPartToPallet,
}) => {
  return (
    <table className="table w-full table-compact">
      <thead>
        <tr>
          <th></th>
          <th>เลขที่เอกสาร</th>
          <th>
            <div className="flex">สินค้า</div>
          </th>
          <th>
            <div className="flex">รายละเอียด</div>
          </th>
          <th>
            <div className="flex justify-end">จำนวน</div>
          </th>
          <th>
            <div className="flex justify-end">ต่อหน่วย</div>
          </th>
          <th>
            <div className="flex justify-end">ทำพาเลท</div>
          </th>
          <th>การแก้ไข</th>
          <th colSpan={2}>
            <div className="flex items-end justify-end">
              <ModalAddNewItem addData={addNewItem} />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map(
          (i, x) =>
            i.orderplan.balqty > 0 && (
              <tr
                key={i.id}
                className={i.is_matched ? `hover` : `hover text-violet-500`}
              >
                <th>{x + 1}</th>
                <td>
                  <Tooltip label="คลิกที่นี้เพิ่มเข้าดูข้อมูลเพิ่มเติม">
                    <Link
                      href={`/order/history?vendor=${i.orderplan.vendor}&tagrp=${i.orderplan.tagrp}&pono=${i.orderplan.pono}&part_no=${i.orderplan.part_no}&bishpc=${i.orderplan.bishpc}&biac=${i.orderplan.biac}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="text-blue-600">{i.pono}</span>
                    </Link>
                  </Tooltip>
                </td>
                <td>{i.ledger.part.title}</td>
                <td>{i.ledger.part.description}</td>
                <td>
                  <div className="flex justify-end text-orange-600">
                    {(i.order_ctn * i.orderplan.bistdp).toLocaleString()}
                  </div>
                </td>
                <td>
                  {i.order_ctn > 0 ? (
                    <AddPartToPallet
                      id={i.id}
                      data={palletData}
                      isMatched={i.total_on_pallet !== i.order_ctn}
                      ctn={i.order_ctn}
                      pallet={i.total_on_pallet}
                      confirmAddData={addPartToPallet}
                    />
                  ) : (
                    <div className={`flex justify-end hover:cursor-pointer`}>
                      0
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex justify-end">
                    {i.total_on_pallet > 0 ? (
                      i.total_on_pallet.toLocaleString()
                    ) : (
                      <span>
                        0
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <Tooltip label={i.orderplan.revise_order.description}>
                    <span className="hover:cursor-pointer hover:bg-violet-600 hover:text-gray-100">
                      {i.orderplan.reasoncd}
                    </span>
                  </Tooltip>
                </td>
                <td>
                  <div className="flex justify-end">
                    {ReDateTime(i.updated_at)}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end space-x-4">
                    <ModalOrderPart data={i} onCommitData={updateData} />
                    <ConfirmDialog data={i} onCommitData={delData} />
                  </div>
                </td>
              </tr>
            )
        )}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={4}>
            <div className="flex justify-center">ผลรวม</div>
          </th>
          <th>
            <div className="flex justify-end">{SumQty(data)}</div>
          </th>
          <th>
            <div className="flex justify-end">{SumCtn(data)}</div>
          </th>
          <th>
            <div className="flex justify-end">{SumSetPalletCtn(data)}</div>
          </th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  );
};

export default OrderDetail;
