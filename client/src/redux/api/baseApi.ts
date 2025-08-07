import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-type";

export const baseApi = createApi({
  reducerPath: "baseApi",
  
  tagTypes: tagTypesList,
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
  }),
  endpoints: () => ({}),
});
