import { Spinner, useToast } from "@chakra-ui/react";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBar } from "../../components";
import { ReDateTime, SummaryCtn } from "../../hooks/greeter";

const StockPage = () => {
  const router = useRouter();
  const toast = useToast();
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

    let host = `${process.env.API_HOST}/stock/data?tag=${filterWhs}`;
    if (txtPartFilter !== "") {
      host = `${process.env.API_HOST}/stock/data?part_no=${txtPartFilter}&tag=${filterWhs}`;
    }
    // console.log(host);
    const res = await fetch(host, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.dir(data.data);
      setStocks(data.data);
      setTxtPartFilter("");
      setIsLoading(false);
    }

    if (!res.ok) {
      // console.dir(res.statusText);
      toast({
        title: res.statusText,
        status: "error",
        isClosable: true,
        duration: 2500,
        position: "top",
        onCloseComplete: () => {
          if (res.status === 401) {
            router.push("/auth");
          }
        },
      });
      setIsLoading(false);
    }
  };

  const selectWhs = (e) => {
    console.dir(e.target.value);
    setFilterWhs(e.target.value);
  };

  useEffect(() => {
    setTxtWhs("กรุณาเลือก Whs");
    if (filterWhs === "D") {
      setTxtWhs("กรองข้อมูล CK-1");
    } else if (filterWhs === "C") {
      setTxtWhs("กรองข้อมูล CK-2");
    }
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWhs]);

  useEffect(() => {
    if (session?.user.WhsDescription !== undefined) {
      setFilterWhs(session?.user.WhsDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);
  return (
    <>
      <NavBar
        user={session?.user}
        title="คลังสินค้า"
        description="จัดการข้อมูลคลังสินค้า"
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <nav className="flex justify-start flex-1 min-w-0">
            <section className="font-bold text-gray-900">
              <div className="form-control">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="ระบุเลขที่สินค้า"
                    className="input input-bordered input-sm"
                    value={txtPartFilter}
                    onChange={(e) => setTxtPartFilter(e.target.value)}
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
                  </button>
                </div>
              </div>
            </section>
          </nav>
          <nav className="flex mt-5 lg:mt-0 lg:ml-4">
            {session?.user.isAdmin ? (
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
                    value={filterWhs}
                    onChange={selectWhs}
                  >
                    <option value={`-`}>-</option>
                    <option value={`D`}>CK-1</option>
                    <option value={`C`}>CK-2</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <span className="sm:ml-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                  >
                    {txtWhs}
                  </button>
                </span>
              </div>
            )}
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
                <th>เลขที่ LotNo.</th>
                <th></th>
                <th></th>
                <th>จำนวน</th>
                <th>กล่อง</th>
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
                    <td>
                      <Link
                        href={`/stock/detail?part_no=${i.part_no}&tag=${i.tagrp}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {i.part_no}
                      </Link>
                    </td>
                    <td>{i.part_name}</td>
                    <td>{i.lot_no}</td>
                    <td>
                      <span className="text-blue-600">{i.line_no}</span>
                    </td>
                    <td>
                      <span className="text-rose-600">{i.revise_no}</span>
                    </td>
                    <td>
                      <span className="text-orange-600">
                        {(i.qty * i.ctn).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="text-green-600">
                        {i.ctn.toLocaleString()}
                      </span>
                    </td>
                    <td>{i.shelve}</td>
                    <td>{i.pallet_no}</td>
                    <td>{ReDateTime(i.updated_at)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={8}>ผลรวม</th>
                <th>{stocks && SummaryCtn(stocks)}</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default StockPage;
