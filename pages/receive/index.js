import { ConfirmReSync, NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { Spinner, useToast } from "@chakra-ui/react";
import {
  ArrowPathIcon,
  CheckIcon,
  FunnelIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { ReDate, ReDateTime, SummaryReceiveQty } from "../../hooks/greeter";
import Link from "next/link";

const ReceiveIndexPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [receive, setReceive] = useState([]);
  const [txtPartFilter, setTxtPartFilter] = useState("");
  const [txtWhs, setTxtWhs] = useState("กรองข้อมูล CK-1");
  const [filterWhs, setFilterWhs] = useState("C");

  const SearchByDate = () => {};

  const selectWhs = (e) => {
    setFilterWhs(e.target.value);
  };

  const FetchData = async () => {
    setIsLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let host = `${process.env.API_HOST}/receive/ent?is_sync=true`;
    if (txtPartFilter) {
      host = `${process.env.API_HOST}/receive/ent?is_sync=true&etd=${txtPartFilter}`;
    }

    // console.log(host)
    const res = await fetch(host, requestOptions);
    if (res.ok) {
      const response = await res.json();
      // console.dir(response.data);
      setReceive(response.data);
      setIsLoading(false);
    }
  };

  const confirmReSync = (obj) => {
    console.dir(obj)
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
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txtPartFilter]);

  return (
    <>
      <NavBar
        user={session?.user}
        title="Receive Control"
        description="จัดการข้อมูลการรับสินค้ารายวัน"
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <nav className="flex justify-start flex-1 min-w-0">
            <section className="font-bold text-gray-900">
              <div className="form-control">
                <div className="input-group input-group-sm">
                  <input
                    type="date"
                    placeholder="ระบุวันที่"
                    className="input input-bordered input-sm"
                    defaultValue={txtPartFilter}
                    onChange={(e) => setTxtPartFilter(e.target.value)}
                  />
                  <button
                    className="btn btn-square btn-sm"
                    onClick={SearchByDate}
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
                  defaultValue={filterWhs}
                  onChange={selectWhs}
                >
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
                <th>เลขที่เอกสาร</th>
                <th>วดป.</th>
                <th>จำนวน</th>
                <th>รับแล้ว</th>
                <th>ทำพาเลท</th>
                <th>คงเหลือ</th>
                <th>
                  <div className="flex justify-center">
                    <span>สถานะ</span>
                  </div>
                </th>
                <th>
                  <div className="flex justify-end">
                    <div>อัพเดทล่าสุด</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {receive?.map((i, x) => (
                <tr key={i.id} className="hover">
                  <th>{(x + 1).toLocaleString()}</th>
                  <td>
                    <span
                      className={
                        i.receive_type.whs.title !== "DOM"
                          ? "text-rose-500"
                          : "text-blue-400"
                      }
                    >
                      {i.receive_type.whs.title}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/receive/detail?receive_id=${i.id}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {i.transfer_out_no}
                    </Link>
                  </td>
                  <td>{ReDate(i.receive_date)}</td>
                  <td>{i.plan_ctn.toLocaleString()}</td>
                  <td>{i.receive_ctn.toLocaleString()}</td>
                  <td>0</td>
                  <td>0</td>
                  <td>
                    {" "}
                    <div className="flex justify-center">
                      <ConfirmReSync isSync={i.is_sync} refNo={i.transfer_out_no} ConfirmReSync={confirmReSync}/>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end space-x-4">
                      <div>{ReDateTime(i.updated_at)}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>คลัง</th>
                <th>เลขที่เอกสาร</th>
                <th>วดป.</th>
                <th>จำนวน</th>
                <th>รับแล้ว</th>
                <th>ทำพาเลท</th>
                <th>คงเหลือ</th>
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

export default ReceiveIndexPage;
