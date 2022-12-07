import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReDateTime } from "../../hooks/greeter";

const ReceiveDetailPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { receive_id } = router.query;
  const [receiveDetail, setReceiveDetail] = useState([]);

  const FetchData = async () => {
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
      console.dir(res.data);
      setReceiveDetail(res.data);
    }
  };

  useEffect(() => {
    if (receive_id !== undefined) {
      FetchData();
    }
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
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default ReceiveDetailPage;
