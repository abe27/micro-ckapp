import { useEffect, useState } from "react";
import ModalOrderPart from "./ModalOrderPart";
import ConfirmDialog from "./ConfirmDeleteItemDialog";
import ModalAddNewItem from "./ModalAddNewItem";
import { Tooltip } from "@chakra-ui/react";

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

const SumQty = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map((i) => {
      ctn += i.orderplan.balqty;
    });
  }
  return ctn.toLocaleString();
};

const OrderDetail = ({ data }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const onCommitData = (obj) => {
    let order = [];
    if (obj) {
      orderDetail.map((i) => {
        if (i.id === obj.id) {
          i = obj;
        }
        order.push(i);
      });
      // console.dir(obj.id);
    }
    setOrderDetail(order);
  };

  const onCommitDeleteData = (obj) => {
    let order = [];
    if (obj) {
      orderDetail.map((i) => {
        if (i.id !== obj.id) {
          order.push(i);
        }
      });
      // console.dir(obj.id);
      setOrderDetail(order);
    }
  };

  useEffect(() => {
    if (data) {
      console.dir(data.order_detail);
      setOrderDetail(data.order_detail);
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
              <ModalAddNewItem />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {orderDetail?.map((i, x) => (
          <tr
            key={i.id}
            className={i.is_matched ? `hover` : `hover text-rose-500`}
          >
            <th>{x + 1}</th>
            <td>{i.pono}</td>
            <td>{i.ledger.part.title}</td>
            <td>{i.ledger.part.description}</td>
            <td>
              <div className="flex justify-end">
                {i.orderplan.balqty.toLocaleString()}
              </div>
            </td>
            <td>
              <div className="flex justify-end">
                {i.orderplan.balqty > 0
                  ? (i.orderplan.balqty / i.orderplan.bistdp).toLocaleString()
                  : `0`}
              </div>
            </td>
            <td>
              <Tooltip label={i.orderplan.revise_order.description}>
                <span className="hover:cursor-pointer">
                  {i.orderplan.reasoncd}
                </span>
              </Tooltip>
            </td>
            <td>
              <div className="flex justify-end">
                {ReDateTime(i.orderplan.updtime)}
              </div>
            </td>
            <td>
              <div className="flex justify-end space-x-4">
                <ModalOrderPart data={i} onCommitData={onCommitData} />
                <ConfirmDialog data={i} onCommitData={onCommitDeleteData} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={4}>
            <div className="flex justify-center">Summary</div>
          </th>
          <th>
            <div className="flex justify-end">{SumQty(orderDetail)}</div>
          </th>
          <th>
            <div className="flex justify-end">{SumCtn(orderDetail)}</div>
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
