const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const GenerateInvoice = (i) => {
  if (i) {
    let prefix = "NO";
    if (i.commercial.title != "N") {
      prefix = i.consignee.prefix;
    }
    return `${i.consignee.factory.inv_prefix}${prefix}${i.etd_date.substring(
      3,
      4
    )}${("0000" + i.running_seq).slice(-4)}${i.shipment.title}`;
  }
  return "-";
};

const SumCtn = (obj) => {
  let ctn = 0;
  obj.map((i) => {
    ctn += i.order_ctn;
  });
  return ctn.toLocaleString();
};

const SumOrderDetailCtn = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map(i => {
      ctn += i.total_on_pallet
    })
  }
  return ctn
}

const SumOrderDetailBalQty = (obj) => {
  let ctn = 0;
  if (obj) {
    obj.map(i => {
      if (i.total_on_pallet > 0) {
        ctn += i.orderplan.balqty;
      }
    });
  }
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

const ReEtdDate = (txt) => {
  let d = new Date(txt);
  return `${(
    "0" + d.getDate()
  ).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
};

const ReplaceHashtag = (txt) => {
  return txt.replace("#", "%23");
};

const SummaryCtn = (obj) => {
  let x = 0
  obj.map(i => {
    x += i.ctn
  })
  return x.toLocaleString()
}

const SummaryReceiveCtn = (obj) => {
  let x = 0
  obj.map(i => {
    x += i.plan_ctn
  })
  return x.toLocaleString()
}

const SummaryReceiveQty = (obj) => {
  let x = 0
  obj.map(i => {
    x += i.plan_qty
  })
  return x.toLocaleString()
}

export {
  classNames,
  GenerateInvoice,
  SumCtn,
  SumOrderDetailCtn,
  SumOrderDetailBalQty,
  ReDate,
  ReEtdDate,
  ReDateTime,
  ReplaceHashtag,
  SummaryCtn,
  SummaryReceiveQty,
  SummaryReceiveCtn,
};
