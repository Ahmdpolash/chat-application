"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";

const UserBox = () => {
  const { data } = useGetMeQuery({});

  console.log("User data:", data);

  return <div>{data?.data?.userName}</div>;
};

export default UserBox;
