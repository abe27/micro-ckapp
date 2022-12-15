import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ReDateTime,SummaryReceiveCtn,SummaryReceiveQty } from "../../hooks/greeter";
import { Spinner } from "@chakra-ui/react";
import { ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/react/20/solid";

const ReceiveDetailPage = () => {
  const fileUploadExcel = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { receive_id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [receiveDetail, setReceiveDetail] = useState([]);
  const [txtPartFilter, setTxtPartFilter] = useState(null);

  const FetchData = async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const r = await fetch(
      `${process.env.API_HOST}/receive/ent/${receive_id}`,
      requestOptions
    );
    if (r.ok) {
      const res = await r.json();
      // console.dir(res.data);
      setReceiveDetail(res.data);
      setIsLoading(false);
    }

    if (!r.ok) {
      setIsLoading(false);
    }
  };

  const UploadReceiveExcel = (e) => {
    console.dir(e.target.files[0]);
  };

  const ClickUploadReceiveExcel = () => fileUploadExcel.current.click();

  useEffect(() => {
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receive_id]);

  return (
    <>
      <NavBar
        user={session?.user}
        title={`Receive Detail ${receive_id}`}
        description={`จัดการข้อมูลการรับสินค้า Receive ID: ${receive_id}`}
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
            <span className="sm:ml-3">
              <input
                type="file"
                className="file-input file-input-bordered file-input-warning w-full max-w-xs invisible"
                accept=".xls,xlsx"
                ref={fileUploadExcel}
                onChange={UploadReceiveExcel}
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                onClick={() => ClickUploadReceiveExcel()}
              >
                {isLoading ? (
                  <Spinner size={`sm`} />
                ) : (
                  <ArrowUpTrayIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                )}
                อัพโหลด
              </button>
            </span>
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
                <th colSpan={2}>สินค้า</th>
                <th colSpan={2}>จำนวน</th>
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
              {receiveDetail?.receive_detail?.map((i, x) => (
                <tr key={i.id}>
                  <th>{(x + 1).toLocaleString()}</th>
                  <td>{i.ledger.part.title}</td>
                  <td>{i.ledger.part.description}</td>
                  <td className="text-blue-600 bg-gray-100">
                    {i.plan_qty.toLocaleString()}
                  </td>
                  <td className="text-yellow-600 bg-gray-100">
                    {i.plan_ctn.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex justify-center">
                      <span
                        className={
                          i.receive_carton.length <= 0
                            ? "text-violet-500"
                            : "text-green-500"
                        }
                      >
                        {i.receive_carton.length.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td>-</td>
                  <td>
                    {i.plan_ctn - i.receive_carton.length > 0 ? (
                      <span className="text-rose-600">
                        {(
                          i.plan_ctn - i.receive_carton.length
                        ).toLocaleString()}
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{i.is_active}</td>
                  <td>
                    <div className="flex justify-end">
                      <span>{ReDateTime(i.updated_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th colSpan={2}>สินค้า</th>
                <th></th>
                <th></th>
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
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default ReceiveDetailPage;
