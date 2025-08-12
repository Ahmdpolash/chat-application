import { ModeToggle } from "@/components/Toggle";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hook";

import { Edit, Search } from "lucide-react";
import SidebarSkeleton from "./SidebarSkeleton";
import {
  useGetMeQuery,
  useLogOutMutation,
} from "@/redux/features/auth/authApi";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ChatSidebar = ({ selectedUser, setSelectedUser }: any) => {
  const [logOut, { isSuccess }] = useLogOutMutation();
  const { data: user }: any = useGetMeQuery({});
  const userInfo = user?.data;
  const { data, isLoading } = useGetAllUsersQuery({});

  const handleLogout = () => {
    logOut({});
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logout successful!");
      window.location.href = "/login";
    }
  }, [logOut, isSuccess]);

  return (
    <>
      {/* Top Sticky Section */}
      <div className="sticky top-0 z-10  px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22.5px] font-medium dark:text-white text-slate-800 font-sans">
            Chats
          </h1>
          <div className="flex items-center gap-3">
            <Edit
              onClick={() => handleLogout()}
              size={21}
              className="cursor-pointer"
            />
            {/* <BsThreeDots size={24} className="cursor-pointer" /> */}
            <ModeToggle />
          </div>
        </div>

        {/* Search input */}
        <div className="relative pb-3">
          <input
            type="text"
            placeholder="Search chats"
            className="border dark:bg-[#101521] bg-[#E6EBF5] dark:border-gray-400 border-gray-300 rounded-md px-10 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-white dark:ring-0"
          />
          <Search
            className="absolute left-3 top-[10px] dark:text-white text-gray-500"
            size={22}
          />
        </div>

        {/* Active user avatars */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto">
          {/* Example avatar */}
          <div className="relative cursor-pointer">
            {data?.data?.map((item: any, idx: number) => (
              <div key={idx}>
                <img
                  src={
                    item?.avatar
                      ? item?.avatar
                      : "https://img.freepik.com/free-photo/cheerful-young-man-posing-isolated-grey_171337-10579.jpg"
                  }
                  alt="avatar"
                  className="w-[48px] h-[48px] rounded-full object-cover"
                />
                <div
                  className={`w-[10px] h-[10px] rounded-full  absolute bottom-0 right-0 ${
                    item?.isOnline ? "bg-green-400" : "bg-gray-50/50"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent title */}
        <h3 className="dark:text-white text-slate-700 text-[18px] font-[400] mt-2">
          {/* Recent */}
          Message
        </h3>
      </div>

      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {isLoading && <SidebarSkeleton />}

        <div className="flex flex-col ">
          {data?.data?.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setSelectedUser(item?._id)}
              className={`flex items-center justify-between dark:hover:bg-[#1f2634] hover:bg-[#E6EBF5] px-3 py-3 rounded-lg cursor-pointer ${
                selectedUser === item?._id && "bg-gray-200 dark:bg-[#1f2634]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative ">
                  <img
                    src={
                      item?.avatar
                        ? item?.avatar
                        : "https://img.freepik.com/free-photo/cheerful-young-man-posing-isolated-grey_171337-10579.jpg"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover "
                  />
                  <div
                    className={`w-[10px] h-[10px] rounded-full  absolute bottom-0 right-0 ${
                      item?.isOnline ? "bg-green-400" : ""
                    }`}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium dark:text-slate-200 text-slate-800">
                    {item?.userName}
                  </h4>
                  <p className="text-[16px] dark:text-slate-400 text-slate-500 font-normal">
                    hey! there I'm available
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center flex-col space-y-1">
                <div className="text-sm text-slate-400">02:50 PM</div>
                <div className="rounded-full bg-[#f66b6b] dark:bg-[#f16c6c] text-white w-5 h-5 text-xs flex items-center justify-center mx-auto">
                  2
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
