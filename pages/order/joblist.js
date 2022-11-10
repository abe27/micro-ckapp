import Head from "next/head";
import { useRouter } from "next/router";

const JobListPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>Print JobOrder {id}</title>
        <meta name="description" content={id} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default JobListPage;
