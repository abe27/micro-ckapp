import { NavBar } from "../../components";
import { useSession } from "next-auth/react";

const ReceiveSupplierPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar user={session?.user} title='Receive Supplier Control' description='จัดการข้อมูลการรับสินค้า Supplier' />
    </>
  );
};

export default ReceiveSupplierPage;
