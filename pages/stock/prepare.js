import { Spinner, Tooltip, useToast } from "@chakra-ui/react";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon, FunnelIcon, XCircleIcon
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NavBar } from "../../components";
import { ReDateTime } from "../../hooks/greeter";

const StockPage = () => {
  const toast = useToast()
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [txtPartFilter, setTxtPartFilter] = useState("");
  const [txtWhs, setTxtWhs] = useState("กรองข้อมูล CK-1");
  const [filterWhs, setFilterWhs] = useState("C");

  const FetchData = async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let host = `${process.env.API_HOST}/stock/shelve/S-XXX?tag=${filterWhs}`;
    if (txtPartFilter !== "") {
      host = `${process.env.API_HOST}/stock/serial_no/${txtPartFilter}`;
    }
    // console.log(txtPartFilter)
    // console.log(host);
    const res = await fetch(host, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.dir(data.data);
      setStocks(data.data);
      setTxtPartFilter("");
      setIsLoading(false);
    }
  };

  const selectWhs = (e) => {
    setFilterWhs(e.target.value);
  };

  const SearchSerialNo = () => {
    if (txtPartFilter.length > 6) {
      FetchData()
    } else {
      toast({
        title: `กรุณาระบุ Serial No ใหม่ครับ!`,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    setTxtWhs("กรองข้อมูล CK-1");
    if (filterWhs !== "D") {
      setTxtWhs("กรองข้อมูล CK-2");
    }
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWhs]);

  useEffect(() => {
    if (session?.user) {
      FetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);
  return (
    <>
      <NavBar
        user={session?.user}
        title="ข้อมูลการจัดเตรียม"
        description="จัดการข้อมูลการจัดเตรียม"
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <nav className="flex justify-start flex-1 min-w-0">
            <section className="font-bold text-gray-900">
              <div className="form-control">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="ระบุเลขที่ Serial No"
                    className="input input-bordered input-sm"
                    value={txtPartFilter}
                    onChange={(e) => setTxtPartFilter(e.target.value)}
                  />
                  <button className="btn btn-square btn-sm" onClick={SearchSerialNo}>
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
                  </button>
                </div>
              </div>
            </section>
          </nav>
          <nav className="flex mt-5 lg:mt-0 lg:ml-4">
            <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                >
                  <FunnelIcon
                    className="w-4 h-4 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  {txtWhs}
                </button>
              </span>
              <div
                tabIndex={0}
                className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
              >
                <select
                  className="w-full max-w-xs select select-info"
                  onChange={selectWhs}
                >
                  <option disabled selected>
                    เลือกคลังสินค้า
                  </option>
                  <option value={`D`}>CK-1</option>
                  <option value={`C`}>CK-2</option>
                </select>
              </div>
            </div>
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
                <th></th>
                <th></th>
                <th>จำนวน</th>
                <th>ชั้น</th>
                <th>พาเลท</th>
                <th>อัพเดทล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {stocks &&
                stocks.map((i) => (
                  <tr key={i.id} className="hover hover:text-sky-600">
                    <th>{i.id.toLocaleString()}</th>
                    <td>
                      {i.tagrp === "D" ? (
                        <span className="text-rose-600">DOM</span>
                      ) : (
                        <span className="text-blue-500">COM</span>
                      )}
                    </td>
                    <td>{i.part_no}</td>
                    <td>{i.part_name}</td>
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
                      <div className="flex justify-end space-x-4">
                        <div>{ReDateTime(i.updated_at)}</div>
                        <div className="flex justify-end space-x-2">
                          <span className="hover:cursor-pointer">
                            <Tooltip label={`ดึงยอดรายการ ${i.serial_no} นี้!`}>
                              <ArrowUturnLeftIcon
                                className="w-5 h-5 mr-2 -ml-1 text-green-500"
                                aria-hidden="true"
                              />
                            </Tooltip>
                          </span>
                          <span className="hover:cursor-pointer">
                            <Tooltip label={`ตัดยอดรายการ ${i.serial_no} นี้!`}>
                              <XCircleIcon
                                className="w-5 h-5 mr-2 -ml-1 text-rose-500"
                                aria-hidden="true"
                              />
                            </Tooltip>
                          </span>
                        </div>
                      </div>
                    </td>
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
                <th>อัพเดทล่าสุด</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default StockPage;
