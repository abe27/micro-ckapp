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
import { useState } from "react";

const StockPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <NavBar
        user={session?.user}
        title="คลังสินค้า"
        description="จัดการข้อมูลคลังสินค้า"
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <nav className="flex-1 min-w-0">
            <strong className="text-gray-900 tfont-bold">
              <div className="form-control">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="ระบุเลขที่สินค้า"
                    className="input input-bordered input-sm"
                  />
                  <button className="btn btn-square btn-sm">
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
            </strong>
            {/* <div className="flex flex-col mt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
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
                <span>Filter on </span>
              </div>
            </div> */}
          </nav>
          <nav className="flex mt-5 lg:mt-0 lg:ml-4">
            {session?.user.isAdmin ? (
              <span className="hidden ml-3 sm:block">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm font-small hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PencilIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  ปิดแก้ไข
                </button>
              </span>
            ) : (
              <></>
            )}
            <span className="hidden ml-3 sm:block">
              <Link
                href={`/order/joblist?id=`}
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
                  JobList
                </button>
              </Link>
            </span>
            <span className="hidden ml-3 sm:block">
              <Link
                href={`/order/pallet?id=`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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
                onClick={() => FetchOrder()}
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
      </section>
    </>
  );
};

export default StockPage;
