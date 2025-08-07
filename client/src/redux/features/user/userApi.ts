import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/users",
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
