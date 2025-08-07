import { useGetMeQuery } from "@/redux/features/auth/authApi";
import Link from "next/link";
import UserBox from "./_components/UserBox";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="my-7">
        <UserBox />
      </div>
      <div className="flex gap-4">
        <Link href={"/login"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Login
          </button>
        </Link>
        <Link href={"/register"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
