
import {createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {server} from "../../constant/config.js"


const api = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/`}),
    tagTypes:["Chats","user", "message"],

    endpoints:(builder) =>({
        myChats:builder.query({
            query:()=>({url:"chat/my" , 
                credentials:"include"
            }),
            provideTags:["Chats"],
            keepUnusedDataFor:0
        }),
        searchUser:builder.query({
            query:(name)=>({url:`user/search?name=${name}`,
                credentials:"include"
            }),
            providesTags:["user"]
        }),
        

        chatDetails:builder.query({
            query:({id})=>{
                let url = `chat/${id}`
                return{url,
                credentials:"include"}
            },
            providesTags:["Chat"],
        }),
        getMessages:builder.query({
            query:({id,page})=>({
                url:`chat/message/${id}?page=${page}`,
                credentials:"include",
            }),
            keepUnusedDataFor: 0,
            providesTags:["message"],
        }),
        sendAttachments:builder.mutation({
            query:(data)=>({
                url:`chat/message`,
                method:"post",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["user"]
        }),
       createChat:builder.mutation({
            query:({userId})=>({
                url:`chat/new`,
                method:"POST",
                credentials:"include",
                body:{userId}
            }),
            invalidatesTags:["chat"],
        }),
        deleteChat:builder.mutation({
            query:({id})=>({
                url:`chat/${id}`,
                method:"DELETE",
                credentials:"include",
            }),
            invalidatesTags:["chat"]
        }),
        leaveGroup:builder.mutation({
            query:({id})=>({
                url:`chat/leave/${id}`,
                method:"DELETE",
                credentials:"include",
            }),
            invalidatesTags:["chat"]
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
    })
})
export default api
export const  {useCreateChatMutation,useChatDetailsQuery,useGetMessagesQuery,useMyChatsQuery} = api;