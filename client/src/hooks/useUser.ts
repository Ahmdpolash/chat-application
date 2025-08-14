'use client '

import { useGetMeQuery } from "@/redux/features/auth/authApi";

// get user
export const useUser = () => {
  const { data } = useGetMeQuery({});

  const user = data?.data;
  return { user };
};
