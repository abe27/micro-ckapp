import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ReceiveDetailPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { receive_id } = router.query;


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
                <th>สินค้า</th>
                <th></th>
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
              <tr>
                <th>1</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
              <th></th>
                <th>สินค้า</th>
                <th></th>
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
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
};

export default ReceiveDetailPage;
