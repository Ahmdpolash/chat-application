import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tag-type";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/message/send",
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, body) => [
        { type: tagTypes.chat, id: body.receiver }, 
      ],
    }),

    getMessages: builder.query({
      query: (userId) => ({
        url: `/message/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: tagTypes.chat, id: userId },
      ],
    }),
  }),
});

export const { useSendMessageMutation, useGetMessagesQuery } = chatApi;
