import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FolderPlusIcon } from "@heroicons/react/20/solid";

const reDate = (txt) => {
  var d = new Date(txt);
  var dateStr =
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2);
  return dateStr;
};

const reInvoice = (i) => {
  // console.dir(i);
  let pref = i.consignee.factory.inv_prefix;
  if (i.commercial.prefix != "-") {
    pref = "NO";
  }
  return `${pref}${i.consignee.prefix}${i.etd_date.substring(3, 4)}${(
    "0000" + i.running_seq
  ).slice(-4)}${i.shipment.title}`;
};

const OrderInformation = ({ data, isEdit = true }) => {
  const toast = useToast();
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
    //   .then((response) => response.json())
    //   .then((result) => setShipment(result.data))
    //   .catch((error) => console.log("error", error));
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

    //   .then((response) => response.json())
    //   .then((result) => setCommercial(result.data))
    //   .catch((error) => console.log("error", error));
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
        setEtd(reDate(data.etd_date));
        setShipmentId(data.shipment_id);
        setPcId(data.pc_id);
        setCommercialId(data.commercial_id);
        setZone(data.order_detail[0].orderplan.whs.id);
        setAffCode(data.consignee.affcode.title);
        setCustCode(data.consignee.customer.title);
        setCountry(data.consignee.customer.description);
        setInvoiceNo(reInvoice(data));
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
          <div className="bg-white px-4 py-5 sm:p-6">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={carrier_code}
                  onChange={(e) => setCarrierCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
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
                className="-ml-1 mr-2 h-5 w-5"
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
