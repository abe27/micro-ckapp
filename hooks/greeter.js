const GenerateInvoice = (i) => {
  // console.dir(i);
  let prefix = "NO";
  if (i.commercial.title != "N") {
    prefix = i.consignee.prefix;
  }
  return `${i.consignee.factory.inv_prefix}${prefix}${i.etd_date.substring(
    3,
    4
  )}${("0000" + i.running_seq).slice(-4)}${i.shipment.title}`;
};

const SumCtn = (obj) => {
  let ctn = 0;
  obj.map((i) => {
    ctn += i.order_ctn;
  });
  return ctn.toLocaleString();
};

const ReDate = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)}`;
};

const ReDateTime = (txt) => {
  let d = new Date(txt);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
    "0" + d.getDate()
  ).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(
    -2
  )}`;
};

export { GenerateInvoice, SumCtn, ReDate, ReDateTime };