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
import { NavBar } from "../../components";

const IndexPage = () => {
  const toast = useToast();
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
      });
    }

    if (res.ok) {
      const data = await res.json();
      console.dir(data);
    }
  };

  useEffect(() => {
    if (vendor !== undefined && session?.user) {
      FetchData();
    }
  }, [session?.user, vendor]);
  return (
    <>
      <NavBar title={`แสดงข้อมูล History`} description={`แสดงรายละเอียดข้อมูลประวัติการซิงค์ Plan`} user={session?.user} />
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                เลขที่เอกสาร:
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
        </div>
        <section className="mt-4"></section>
        {/* /End replace */}
      </main>
    </>
  );
};

export default IndexPage;
