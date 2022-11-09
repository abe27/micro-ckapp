import { NavBar } from "../../components";
import { useSession } from "next-auth/react";

const InvoicePage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar
        user={session?.user}
        title={`Invoice Plan Control`}
        description={`จัดการข้อมูล Invoice`}
      />
    </>
  );
};

export default InvoicePage;
