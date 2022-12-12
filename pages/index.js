import { NavBar } from "../components";
import { useSession } from "next-auth/react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";

const IndexPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar
        user={session?.user}
        title={`ยินดีต้อนรับเข้าสู่ระบบ ${process.env.APP_NAME}`}
        description={`ระบบบริหารจัดการคลังสินค้า`}
      />
      <section className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-10">
          <div className="shadow stats">
            <div className="stat">
              <div className="stat-title">Total Page Views</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="shadow stats">
            <div className="stat">
              <div className="stat-title">Total Page Views</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="shadow stats">
            <div className="stat">
              <div className="stat-title">Total Page Views</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="shadow stats">
            <div className="stat">
              <div className="stat-title">Total Page Views</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IndexPage;
