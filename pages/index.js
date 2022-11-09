import { NavBar } from "../components";
import { useSession } from "next-auth/react";

const IndexPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar user={session?.user} />
    </>
  );
};

export default IndexPage;
