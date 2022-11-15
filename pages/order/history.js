import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/router";

const IndexPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  // Get Variable
  const { vendor, tagrp, pono, part_no, bishpc, biac } = router.query;

  const FetchData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    console.dir(
      `${process.env.API_HOST}/order/plan?vendor=${vendor}&tagrp=${tagrp}&pono=${pono}&part_no=${part_no}&bishpc=${bishpc}&biac=${biac}`
    );
    const res = await fetch(
      `${process.env.API_HOST}/order/plan?vendor=${vendor}&tagrp=${tagrp}&pono=${pono}&part_no=${part_no}&bishpc=${bishpc}&biac=${biac}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data);
    }
  };

  useEffect(() => {
    FetchData();
  }, [session?.user]);
  return (
    <>
      <NavBar title={``} description={``} user={session?.user} />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <strong className="tfont-bold text-gray-900">
                เลขที่เอกสาร:
              </strong>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <BriefcaseIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/archive`}>Archive</Link>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CloudIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href={`/order/edi`}>Remote EDI</Link>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:cursor-pointer"
                    aria-hidden="true"
                  />
                  <span>Filter on</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={FetchData}
                >
                  {isLoading ? (
                    <Spinner size={`sm`} />
                  ) : (
                    <ArrowPathIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  โหลดใหม่
                </button>
              </span>
            </div>
          </div>
        </div>
        <section className="mt-4"></section>
        {/* /End replace */}
      </main>
    </>
  );
};

export default IndexPage;
