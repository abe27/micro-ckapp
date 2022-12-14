import { Spinner } from "@chakra-ui/react";
import {
    ArrowPathIcon,
    CheckCircleIcon, XCircleIcon
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBar } from "../../components";
import { ReDateTime } from "../../hooks/greeter";

const CartonPage = () => {
  const router = useRouter();
  const { part_no, tag } = router.query;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [txtLotNo, setTxtLotNo] = useState("");

  const FetchData = async () => {
    if (part_no !== undefined) {
      setIsLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      let host = `${process.env.API_HOST}/stock/stock_detail?part_no=${part_no}&tag=${tag}`;
      // console.log(host);
      const res = await fetch(host, requestOptions);

      if (res.ok) {
        const data = await res.json();
        console.dir(data.data);
        setStocks(data.data);
        setTxtLotNo("");
        setIsLoading(false);
      }

      if (!res.ok) {
        console.dir(res)
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part_no]);
  return (
    <>
      <NavBar
        user={session?.user}
        title={`แสดงรายละเอียด ${part_no}`}
        description="จัดการข้อมูลรายละเอียดของสินค้า"
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <nav className="flex justify-start flex-1 min-w-0">
            <section className="font-bold text-gray-900">
              <div className="form-control">
                <div className="input-group input-group-sm">
                  {/* <input
                    type="text"
                    placeholder="ระบุเลขที่ LotNo"
                    className="input input-bordered input-sm"
                    value={txtLotNo}
                    onChange={(e) => setTxtLotNo(e.target.value)}
                  />
                  <button className="btn btn-square btn-sm" onClick={FetchData}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button> */}
                </div>
              </div>
            </section>
          </nav>
          <nav className="flex mt-5 lg:mt-0 lg:ml-4">
            <span className="sm:ml-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => FetchData()}
              >
                {isLoading ? (
                  <Spinner size={`sm`} />
                ) : (
                  <ArrowPathIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                )}
                โหลดใหม่
              </button>
            </span>
          </nav>
        </div>
        <div className="divider" />
        <div className="mt-4 overflow-x-auto">
          <table className="table w-full table-compact">
            <thead>
              <tr>
                <th></th>
                <th>คลัง</th>
                <th>สินค้า</th>
                <th></th>
                <th>Serial No.</th>
                <th>เลขที่ LotNo.</th>
                <th>Line No</th>
                <th>Revise No.</th>
                <th>จำนวน</th>
                <th>ชั้น</th>
                <th>พาเลท</th>
                <th>สถานะ</th>
                <th>อัพเดทล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {stocks &&
                stocks.map((i, x) => (
                  <tr key={i.serial_no} className="hover hover:text-sky-600">
                    <th>{(x + 1).toLocaleString()}</th>
                    <td>
                      {i.tagrp === "D" ? (
                        <span className="text-rose-600">DOM</span>
                      ) : (
                        <span className="text-blue-500">COM</span>
                      )}
                    </td>
                    <td>{i.partno}</td>
                    <td>{i.partname}</td>
                    <td>{i.serial_no}</td>
                    <td>{i.lot_no}</td>
                    <td>
                      <span className="text-blue-600">{i.line_no}</span>
                    </td>
                    <td>
                      <span className="text-rose-600">{i.revise_no}</span>
                    </td>
                    <td>
                      <span className="text-orange-600">
                        {i.qty.toLocaleString()}
                      </span>
                    </td>
                    <td>{i.shelve}</td>
                    <td>{i.pallet_no}</td>
                    <td>
                      {i.checked_flg ? (
                        <CheckCircleIcon
                          className="w-5 h-5 mr-2 -ml-1 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircleIcon
                          className="w-5 h-5 mr-2 -ml-1 text-rose-500"
                          aria-hidden="true"
                        />
                      )}
                    </td>
                    <td>{ReDateTime(i.last_update)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>คลัง</th>
                <th>สินค้า</th>
                <th></th>
                <th>Serial No.</th>
                <th>เลขที่ LotNo.</th>
                <th></th>
                <th></th>
                <th>จำนวน</th>
                <th>ชั้น</th>
                <th>พาเลท</th>
                <th>สถานะ</th>
                <th>อัพเดทล่าสุด</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default CartonPage;
