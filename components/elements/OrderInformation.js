/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckBadgeIcon, FolderPlusIcon } from "@heroicons/react/20/solid";
import ConfirmSyncData from "./ConfirmSyncData";
import { GenerateInvoice, ReDate } from "../../hooks/greeter";

const OrderInformation = ({ data, isEdit = true, confirmSync }) => {
  const { data: session } = useSession();
  const [etd, setEtd] = useState("");
  const [shipmentid, setShipmentId] = useState("");
  const [pcid, setPcId] = useState("");
  const [commercialid, setCommercialId] = useState("");
  const [zone_id, setZone] = useState("");
  const [affcode, setAffCode] = useState("");
  const [custcode, setCustCode] = useState("");
  const [country, setCountry] = useState("");
  const [invoiceno, setInvoiceNo] = useState("");
  const [zonecode, setZoneCode] = useState("");
  const [bioat, setBioat] = useState(0);
  const [loading_area, setLoadingArea] = useState("");
  const [order_title, setOrderTitle] = useState("");
  const [privilege, setPrivilege] = useState("");
  const [carrier_code, setCarrierCode] = useState("");

  const [shipment, setShipment] = useState(null);
  const [pc, setPc] = useState(null);
  const [commercial, setCommercial] = useState(null);
  const [zoneid, setZoneId] = useState(null);

  const getHeader = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);
    return myHeaders;
  };

  const fetchShipment = async () => {
    var requestOptions = {
      method: "GET",
      headers: getHeader(),
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/shipment`, requestOptions);
    if (res.ok) {
      const obj = await res.json();
      setShipment(obj.data);
    }
  };

  const fetchPc = async () => {
    var requestOptions = {
      method: "GET",
      headers: getHeader(),
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/pc`, requestOptions);
    if (res.ok) {
      const obj = await res.json();
      setPc(obj.data);
    }
  };

  const fetchCommercial = async () => {
    var requestOptions = {
      method: "GET",
      headers: getHeader(),
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/commercial`,
      requestOptions
    );
    if (res.ok) {
      const obj = await res.json();
      setCommercial(obj.data);
    }
  };

  const fetchOrderZone = async () => {
    var requestOptions = {
      method: "GET",
      headers: getHeader(),
      redirect: "follow",
    };

    let host = `${process.env.API_HOST}/order/zone?factory=${session?.user.Factory}`;
    if (session?.user.Factory === "-") {
      host = `${process.env.API_HOST}/order/zone`;
    }

    const res = await fetch(host, requestOptions);
    if (res.ok) {
      const obj = await res.json();
      setZoneId(obj.data);
    }
  };

  useEffect(() => {
    if (session != undefined) {
      fetchShipment();
      fetchPc();
      fetchCommercial();
      fetchOrderZone();
      if (data) {
        // Set Data to Variable
        // console.dir(data);
        setEtd(ReDate(data.etd_date));
        setShipmentId(data.shipment_id);
        setPcId(data.pc_id);
        setCommercialId(data.commercial_id);
        setZone(data.order_detail[0].orderplan.whs.id);
        setAffCode(data.consignee.affcode.title);
        setCustCode(data.consignee.customer.title);
        setCountry(data.consignee.customer.description);
        setInvoiceNo(GenerateInvoice(data));
        setZoneCode(data.zone_code);
        setBioat(data.bioat);
        setLoadingArea(data.loading_area);
        setOrderTitle("000");
        setPrivilege(data.privilege);
        setCarrierCode(data.carrier_code);
      }
    }
  }, [data]);

  return (
    <>
      <div>
        <div className="overflow-hidden">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="etddate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Etd Date.
                </label>
                <input
                  type="date"
                  name="etddate"
                  id="etddate"
                  autoComplete="etd date"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={etd}
                />
              </div>
              <div className="col">
                <label
                  htmlFor="shipment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shipment
                </label>
                <select
                  id="shipment"
                  name="shipment"
                  autoComplete="shipment"
                  disabled={isEdit}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={shipmentid}
                  onChange={(e) => setShipmentId(e.target.value)}
                >
                  {shipment &&
                    shipment.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.description}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col">
                <label
                  htmlFor="pc"
                  className="block text-sm font-medium text-gray-700"
                >
                  PC
                </label>
                <select
                  id="pc"
                  name="pc"
                  autoComplete="pc"
                  disabled={isEdit}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={pcid}
                  onChange={(e) => setPcId(e.target.value)}
                >
                  {pc &&
                    pc.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.description}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col">
                <label
                  htmlFor="commercial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Commercial
                </label>
                <select
                  id="commercial"
                  name="commercial"
                  autoComplete="commercial"
                  disabled={isEdit}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={commercialid}
                  onChange={(e) => setCommercialId(e.target.value)}
                >
                  {commercial &&
                    commercial.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.description}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col" />
              {/* deteail */}
              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label
                  htmlFor="affcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Affcode
                </label>
                <input
                  type="text"
                  name="affcode"
                  id="affcode"
                  autoComplete="affcode"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={affcode}
                  onChange={(e) => setAffCode(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="custcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Custcode
                </label>
                <input
                  type="text"
                  name="custcode"
                  id="custcode"
                  autoComplete="custcode"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={custcode}
                  onChange={(e) => setCustCode(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  autoComplete="country"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="col">
                <label
                  htmlFor="invno"
                  className="block text-sm font-medium text-gray-700"
                >
                  Invoice No.
                </label>
                <input
                  type="text"
                  name="invno"
                  id="invno"
                  autoComplete="invno"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={invoiceno}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>

              <div className="col">
                <label
                  htmlFor="zonecode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zone Code
                </label>
                <input
                  type="text"
                  name="zonecode"
                  id="zonecode"
                  autoComplete="zonecode"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={zonecode}
                  onChange={(e) => setZoneCode(e.target.value)}
                />
              </div>

              <div className="col">
                <label
                  htmlFor="bioat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bioat
                </label>
                <input
                  type="number"
                  name="bioat"
                  id="bioat"
                  autoComplete="bioat"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={bioat}
                  onChange={(e) => setBioat(e.target.value)}
                />
              </div>

              <div className="col">
                <label
                  htmlFor="zoneid"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Zone
                </label>
                <select
                  id="zoneid"
                  name="zoneid"
                  autoComplete="zoneid"
                  disabled={isEdit}
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={zone_id}
                  onChange={(e) => setZone(e.target.value)}
                >
                  {zoneid &&
                    zoneid.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.description}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-3" />

              <div className="col-span-6">
                <label
                  htmlFor="loading_area"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loading Area
                </label>
                <input
                  type="text"
                  name="loading_area"
                  id="loading_area"
                  autoComplete="loading_area"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={loading_area}
                  onChange={(e) => setLoadingArea(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label
                  htmlFor="order_title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="city"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={order_title}
                  onChange={(e) => setOrderTitle(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="order_privilege"
                  className="block text-sm font-medium text-gray-700"
                >
                  Privilege
                </label>
                <input
                  type="text"
                  name="order_privilege"
                  id="order_privilege"
                  autoComplete="order_privilege"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={privilege}
                  onChange={(e) => setPrivilege(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="carrier_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Carrier Code
                </label>
                <input
                  type="text"
                  name="carrier_code"
                  id="carrier_code"
                  autoComplete="carrier_code"
                  disabled={isEdit}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={carrier_code}
                  onChange={(e) => setCarrierCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 space-x-4 text-right bg-gray-50 sm:px-6">
            <ConfirmSyncData
              id={data?.id}
              labe={`ยืนยันรายการนี้`}
              description={`คุณต้องการที่จะยืนยันรายการนี้ใช่หรือไม่!`}
              isEdit={isEdit}
              onCommitData={confirmSync}
            />
            <button
              type="submit"
              disabled={isEdit}
              className={
                isEdit
                  ? `inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm`
                  : `inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`
              }
            >
              <FolderPlusIcon
                className="w-5 h-5 mr-2 -ml-1"
                aria-hidden="true"
              />
              บันทึกข้อมูล
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderInformation;
