import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/users",
      }),
    }),
    getSingleUser: builder.query({
      query: (userId: string) => ({
        url: `/auth/users/${userId}`,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery } = userApi;
