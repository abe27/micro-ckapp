import { NavBar } from "../../components";
import { useSession } from "next-auth/react";

const ReceiveIndexPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar user={session?.user} title='Receive Control' description='จัดการข้อมูลการรับสินค้ารายวัน' />
    </>
  );
};

export default ReceiveIndexPage;
