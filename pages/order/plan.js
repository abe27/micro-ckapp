import { NavBar } from "../../components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const OrderDetailPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  return (
    <>
      <NavBar
        user={session?.user}
        title={`Show Order Details ${id}`}
        description={`แสดงข้อมูล Order Details`}
      />
    </>
  );
};

export default OrderDetailPage;
