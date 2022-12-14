import { ModalAddNewPallet, AlertDialogQuestion } from "../index";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import Link from "next/link";

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
  const toast = useToast();
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

    if (!res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        duration: 3000,
        status: "error",
        position: "top",
        is,
      });
    }

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

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: data.message,
          duration: 3000,
          status: "error",
          position: "top",
          is,
        });
      }

      if (res.ok) {
        reloadData();
      }
    }
  };

  return (
    <>
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th></th>
            <th>??????????????????</th>
            <th>??????????????????</th>
            <th>???????????????</th>
            <th>?????????</th>
            <th>?????????</th>
            <th>???????????????/???????????????</th>
            <th>????????????</th>
            <th>???????????????</th>
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
                        className="text-green-600 icon icon-tabler icon-tabler-pencil"
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
                    {/* <AlertDialogQuestion
                      id={i.id}
                      title={`?????? ${i.pallet_prefix}${(
                        "000" + i.pallet_no
                      ).slice(-3)}`}
                      description={`??????????????????????????????????????????????????? ${`${i.pallet_prefix}${(
                        "000" + i.pallet_no
                      ).slice(-3)}`} ????????????????????????????????????????`}
                      onCommit={DeletePallet}
                    /> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash text-rose-600"
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
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={6}>
              <div className="flex justify-center">???????????????</div>
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
