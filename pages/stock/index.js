import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  PencilIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ReDateTime } from "../../hooks/greeter";

const StockPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [txtPartFilter, setTxtPartFilter] = useState("");

  const FetchData = async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let host = `${process.env.API_HOST}/stock?tag=C`
    if (txtPartFilter !== "") {
      host = `${process.env.API_HOST}/stock?part_no=${txtPartFilter}&tag=C`
    }
    console.log(host)
    const res = await fetch(host,requestOptions);

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data);
      setStocks(data.data);
      setTxtPartFilter("")
      setIsLoading(false);
    }
  };

  useEffect(()=> {
    if (session?.user) {
      FetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user])
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
                  <button
                    className="btn btn-square btn-sm"
                    onClick={FetchData}
                  >
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
                    <th>{i.id}</th>
                    <td>
                      <Link
                        href={`/stock/detail?part_no=${i.part_no}&tag=${i.tagrp}`}
                      >
                        {i.part_no}
                      </Link>
                    </td>
                    <td>{i.part_name}</td>
                    <td>{i.lot_no}</td>
                    <td>{i.line_no}</td>
                    <td>{i.revise_no}</td>
                    <td>{(i.qty * i.ctn).toLocaleString()}</td>
                    <td>{i.ctn.toLocaleString()}</td>
                    <td>{i.shelve}</td>
                    <td>{i.pallet_no}</td>
                    <td>{ReDateTime(i.updated_at)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
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
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default StockPage;
