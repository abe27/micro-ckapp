import { NavBar } from "../../components";
import { useSession } from "next-auth/react";

const StockCheckPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar user={session?.user} title="ผลการนับสินค้า" description="จัดการข้อมูลการนับสินค้า" />
    </>
  );
};

export default StockCheckPage;
