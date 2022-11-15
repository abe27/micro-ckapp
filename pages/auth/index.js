import Head from "next/head";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clearAllSessionStorage } from "../../hooks/session";

const AuthPage = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.set("username", data.get("username"));
    data.set("password", data.get("password"));
    // console.dir(`USERNAME: ${data.get('username')} PASSWORD: ${data.get('password')}`)
    const res = await signIn("credentials", {
      redirect: false,
      username: data.get("username"),
      password: data.get("password"),
    });

    if (!res.ok) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: res.error,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    toast({
      title: `สวัสดี ${data.get("username")}`,
      description: `ยินดีต้อนรับเข้าสู่ระบบ ${process.env.APP_NAME}.`,
      status: "success",
      duration: 9000,
      isClosable: true,
      position: "top",
      onCloseComplete: () => router.push("/"),
    });
  };

  useEffect(() => {
    clearAllSessionStorage();
  }, []);
  return (
    <>
      <Head>
        <title>{`เข้าใช้งานระบบ ${process.env.APP_NAME}`}</title>
        <meta
          name="description"
          content={`เข้าใช้งานระบบ ${process.env.APP_NAME}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/member/register">
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {`เข้าใช้งานระบบ ${process.env.APP_NAME}`}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              หรือ{" "}
              <Link href="/">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  ทดสอบเข้าใช้งานด้วยระบบ Guest
                </span>
              </Link>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">ชื่อผู้ใช้งาน</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Emp Code"
                  className="input input-bordered w-full block"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">รหัสผ่าน</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Type here"
                  className="input input-bordered w-full block"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Alt label</span>
                  <span className="label-text-alt">Alt label</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  จดจำข้อมูลนี้ไว้
                </label>
              </div>

              <div className="text-sm">
                <Link href="/member/forget">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    คุณลืมรหัสผ่านใช่ไหม
                  </span>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative btn w-full bg-indigo-600 gap-2 hover:bg-indigo-300"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
