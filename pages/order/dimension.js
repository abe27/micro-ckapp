import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  CloudIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const DimensionPage = () => {
  const router = new useRouter()
  const { id } = router.query;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <NavBar
        user={session?.user}
        title="แสดงข้อมูล Dimension"
        description="แสดงข้อมูลในพาเลท"
      />
      <section>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <strong className="text-gray-900 tfont-bold">
                เลขที่เอกสาร: XXXXXX
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
                  <span>Filter on invoiceNo</span>
                </div>
              </div>
            </div>
            <div className="flex mt-5 lg:mt-0 lg:ml-4">
              <span className="hidden ml-3 sm:block">n</span>
              <span className="hidden ml-3 sm:block">
                <Link
                  href={`/order/dimension?id=${id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PrinterIcon
                      className="w-5 h-5 mr-2 -ml-1"
                      aria-hidden="true"
                    />
                    Dimension
                  </button>
                </Link>
              </span>
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        </div>
      </section>
    </>
  );
};

export default DimensionPage;
