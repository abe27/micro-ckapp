import { Spinner, useToast } from "@chakra-ui/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBar, SkeletonLoading } from "../../components";
import { ReDate, ReDateTime, ReplaceHashtag } from "../../hooks/greeter";

const IndexPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { asPath } = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  // Get Variable
  const { vendor } = router.query;

  const FetchData = async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const hash = asPath.split("?")[1]; // error=unauthorized_client&error_code=401error_description=Something+went+wrong
    const parsedHash = new URLSearchParams(hash);
    const vendor = parsedHash.get("vendor");
    const tagrp = parsedHash.get("tagrp");
    const pono = ReplaceHashtag(parsedHash.get("pono"));
    const part_no = parsedHash.get("part_no");
    const bishpc = parsedHash.get("bishpc");
    const biac = parsedHash.get("biac");

    // console.dir(
    //   `${process.env.API_HOST}/order/plan?vendor=${vendor}&tagrp=${tagrp}&pono=${pono}&part_no=${part_no}&bishpc=${bishpc}&biac=${biac}`
    // );
    const res = await fetch(
      `${process.env.API_HOST}/order/plan?vendor=${vendor}&tagrp=${tagrp}&pono=${pono}&part_no=${part_no}&bishpc=${bishpc}&biac=${biac}`,
      requestOptions
    );

    if (!res.ok) {
      const data = await res.json();
      toast({
        title: `${data.message}!`,
        duration: 3000,
        status: "error",
        position: "top",
        isClosable: true,
        onCloseComplete: () => setIsLoading(false),
      });
    }

    if (res.ok) {
      const data = await res.json();
      setHistoryData(data.data);
      console.dir(data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vendor !== undefined && session?.user) {
      FetchData();
    }
  }, [session?.user, vendor]);
  return (
    <>
      <NavBar
        title={`แสดงข้อมูล History`}
        description={`แสดงรายละเอียดข้อมูลประวัติการซิงค์ Plan`}
        user={session?.user}
      />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                แสดงประวัติการแก้ไขข้อมูล
              </strong>
              <div className="flex flex-col mt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <BriefcaseIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/archive`}>Archive</Link>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <CloudIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/edi`}>Remote EDI</Link>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                    aria-hidden="true"
                  />
                  <span>Filter on</span>
                </div>
              </div>
            </div>
            <div className="flex mt-5 lg:mt-0 lg:ml-4">
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={FetchData}
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
            </div>
          </div>
          <section className="mt-4">
            {isLoading ? (
              <SkeletonLoading />
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full table-compact">
                  <thead>
                    <tr>
                      <th></th>
                      <th>วดป.</th>
                      <th>ขนส่ง</th>
                      <th>เลขที่ PO</th>
                      <th>สินค้า</th>
                      <th></th>
                      <th>
                        <div className="flex justify-end">จำนวน</div>
                      </th>
                      <th>
                        <div className="flex justify-end">ชิ้น/กล่อง</div>
                      </th>
                      <th>แก้ไข</th>
                      <th>นำเข้าระบบเมื่อ</th>
                      <th>อัพเดทล่าสุด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData?.map((i, x) => (
                      <tr key={i.id}>
                        <th>{x + 1}</th>
                        <td>{ReDate(i.etd_tap)}</td>
                        <td>{i.shipment.description}</td>
                        <td>{i.pono}</td>
                        <td>{i.part_no}</td>
                        <td>{i.part_name}</td>
                        <th>
                          <div className="flex justify-end text-orange-700 text-bold">
                            {i.balqty.toLocaleString()}
                          </div>
                        </th>
                        <td>
                          <div className="flex justify-end text-green-700 text-bold">
                            {(i.balqty / i.bistdp).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <span className="text-rose-800">{i.reasoncd}</span>
                        </td>
                        <td>{ReDateTime(i.updtime)}</td>
                        <td>{ReDateTime(i.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        {/* /End replace */}
      </main>
    </>
  );
};

export default IndexPage;
