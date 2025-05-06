import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constant/config.js";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chats", "user", "message", "groups"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({ url: "chat/my", credentials: "include" }),
      provideTags: ["Chats"],
      keepUnusedDataFor: 0,
    }),
    myGroups: builder.query({
      query: () => ({ url: "group/my", credentials: "include" }),
      provideTags: ["groups"],
      keepUnusedDataFor: 0,
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    chatDetails: builder.query({
      query: ({ id }) => {
        let url = `chat/${id}`;
        return { url, credentials: "include" };
      },
      keepUnusedDataFor: 0,
      providesTags: ["Chats"],
    }),
    groupDetails: builder.query({
      query: ({ id }) => {
        let url = `group/${id}`;
        return { url, credentials: "include" };
      },
      keepUnusedDataFor: 0,
      providesTags: ["groups"],
    }),
    getMessages: builder.query({
      query: ({ id, page }) => ({
        url: `chat/message/${id}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["message"],
    }),
    getGroupMessages: builder.query({
      query: ({ id, page }) => ({
        url: `group/messages/${id}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["message"],
    }),
    sendAttachments: builder.mutation({
      query: ({ data, IsGroup }) =>
        IsGroup
          ? {
              url: `group/attachment`,
              method: "post",
              credentials: "include",
              body: data,
            }
          : {
              url: `chat/message`,
              method: "post",
              credentials: "include",
              body: data,
            },
      invalidatesTags: [],
    }),
    createChat: builder.mutation({
      query: ({ userId }) => ({
        url: `chat/new`,
        method: "POST",
        credentials: "include",
        body: { userId },
      }),
      invalidatesTags: ["Chats"],
    }),
    deleteChat: builder.mutation({
      query: ({ id }) => ({
        url: `chat/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chats"],
    }),
    leaveGroup: builder.mutation({
      query: ({ id }) => ({
        url: `group/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["groups"],
    }),
    // renameUser:builder.mutation({
    //     query:({newName})=>({
    //         url:`user/rename`,
    //         method:"put",
    //         credentials:'include',
    //         body:{newName}
    //     }),
    //     invalidatesTags:["user"]

    // })
    joinGroup: builder.mutation({
      query: ({ groupId ,invite,check}) => ({
        url: `/group/join/${groupId}`,
        method: "POST",
        body:{check,invite},
        credentials: "include",
      }),
    }),
  }),
});

export default api;
export const {
  useLazyMyGroupsQuery,
  useJoinGroupMutation,
  useGetGroupMessagesQuery,
  useLeaveGroupMutation,
  useGroupDetailsQuery,
  useCreateChatMutation,
  useChatDetailsQuery,
  useMyGroupsQuery,
  useGetMessagesQuery,
  useMyChatsQuery,
  useDeleteChatMutation,
  useSendAttachmentsMutation,
} = api;
