import { NavBar, SelectPrintShipping } from "../../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  CogIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { ReDateTime } from "../../../hooks/greeter";

const PalletDetailPage = () => {
  const toast = new useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  // Variable
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const selectShipping = (e) => {
    setData((prevState) => {
      const newItems = [...prevState];
      newItems[e.target.id].is_checked = e.target.checked;
      return newItems;
    });
  };

  const selectAllLabel = (e) => {
    setIsChecked(e.target.checked);
    setData((prevState) => {
      const items = [...prevState];
      items.map((i) => (i.is_checked = e.target.checked));
      return items;
    });
  };

  const FetchPalletDetail = async () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // console.dir(`${process.env.API_HOST}/order/pallet/${id}`)

    const res = await fetch(
      `${process.env.API_HOST}/order/pallet/${id}`,
      requestOptions
    );

    if (!res.ok) {
      const data = await res.json();
      toast({
        title: data.message,
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }

    if (res.ok) {
      const resData = await res.json();
      console.dir(resData.data);
      // setPrefixFticket(data.data.order.consignee.factory.label_prefix);
      let doc = [];
      let pl_no = `${resData.data.pallet_prefix}${(
        "000" + resData.data.pallet_no
      ).slice(-3)}`;
      resData.data.pallet_detail.map((j, x) => {
        let d = new Date(j.created_at);
        let y = d.getFullYear().toString().substring(3, 4);
        // console.dir(j)
        let obj = {
          seq: x,
          shipping_id: j.id,
          pallet_no: pl_no,
          seq_no: `${j.order_detail.ledger.factory.label_prefix}${y}${(
            "00000000" + j.seq_no
          ).slice(-8)}`,
          part_no: j.order_detail.ledger.part.title,
          part_name: j.order_detail.ledger.part.description,
          is_checked: false,
          last_updated: j.updated_at,
          doc: j,
        };
        // if (parts.indexOf(j.order_detail.ledger.part.title) < 0) {
        //   parts.push(j.order_detail.ledger.part.title);
        // }
        //   console.dir(j);
        doc.push(obj);
      });
      console.dir(doc);
      setData(doc);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      FetchPalletDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      <NavBar
        user={session?.user}
        title={`Show Pallet Detail ${id}`}
        description={`แสดงข้อมูล Pallet Detail`}
      />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                เลขที่เอกสาร: xxxx
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
              {/* <span className="hidden ml-3 sm:block">
                <Link
                  href={`/order/joblist?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <BriefcaseIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    JobList
                  </button>
                </Link>
              </span>
              <span className="hidden ml-3 sm:block">
                <Link
                  href={`/order/pallet?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <CogIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    ตั้งค่าพาเลท
                  </button>
                </Link>
              </span> */}

              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => FetchPalletDetail()}
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
          {/* /End replace */}
          <div className="mt-4 overflow-x-auto">
            <table className="table w-full table-compact">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-warning checkbox-xs"
                      defaultValue={isChecked}
                      onChange={selectAllLabel}
                    />
                  </th>
                  <th>เลขที่</th>
                  <th>สินค้า</th>
                  <th></th>
                  <th>เลขที่พาเลท</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.map((i, x) => (
                    <tr key={i.id}>
                      <th>
                        {/* <input
                          type="checkbox"
                          className="checkbox checkbox-warning checkbox-sm"
                        /> */}
                        <SelectPrintShipping
                          id={x}
                          isChecked={i.is_checked}
                          selectShipping={selectShipping}
                        />
                      </th>
                      <td>{i.seq_no}</td>
                      <td>{i.part_no}</td>
                      <td>{i.part_name}</td>
                      <td>{i.pallet_no}</td>
                      <td>{ReDateTime(i.last_updated)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default PalletDetailPage;
