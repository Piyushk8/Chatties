import React, { lazy, useCallback, useEffect, useRef, useState } from "react";
import appLayout from "../Layout/appLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChatDetailsQuery,
  useGetMessagesQuery,
} from "../../redux/reducers/api";
import MessageComponent from "../shared/messageComponent";
import { useInfiniteScrollTop } from "../../hooks/hook";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  IS_TYPING,
  STOP_TYPING,
  REFETECH_CHATS,
} from "../../constant/event";
import { useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsChatDetailsBarOpen,
  setIsFileMenu,
  setUserTyping,
} from "../../redux/reducers/misc";
import Header from "../Layout/Header";
import { Paperclip, SendIcon } from "lucide-react";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import FileMenu from "../specific/FileMenu";
// import ChatDetailsSidebar from "../specific/ProfileSideBar";
// const FileMenu = lazy(() => import("../specific/FileMenu"));
const ChatDetailsSidebar = lazy(() => import("../specific/ProfileSideBar"));
const Chat = ({ chatId, user }) => {
  const { socket } = getSocket();
  const dispatch = useDispatch();
  const nav = useNavigate("/");

  const [page, setpage] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [MeTyping, setMeTyping] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const typingtimeOut = useRef(null);
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  const bottomRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dragCounter = useRef(0);

  const { userTyping, isFileMenu, isChatDetailsBarOpen } = useSelector(
    (state) => state.misc
  );
  const {
    data: chatDetails,
    refetch: refetchChatDetails,
    isError: chatDetailsIsError,
    isLoading: chatDetailsLoading,
  } = useChatDetailsQuery({ id: chatId });
  const members = chatDetails?.members.map((member) => member?.userId);

  useEffect(() => {
    if (!chatDetails && !isLoading) {
      console.log(chatDetails, isLoading);
      nav("/");
    }
    if (chatDetailsIsError && !isLoading) {
      console.log(chatDetails);
      nav("/");
    }
  }, [chatDetails]);

  const {
    data,
    isLoading,
    isSuccess: messageSuccess,
    isError,
    error,
  } = useGetMessagesQuery({
    page,
    id: chatId,
  });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    data?.totalMessages,
    page,
    setpage,
    data?.messages
  );

  const errorhandler = () => {
    //error handling page logic
  };

  //DropZoneHandlers

  //!all handlers
  const handleFileUpload = (files) => {
    const file = files[0];
    // Implement your file upload logic here
    console.log(file);
  };



  const SubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    //to emit message to server

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  const MessageOnChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);

    if (!MeTyping) {
      socket.emit(IS_TYPING, { members, chatId, userId: user?.id });
      setMeTyping(true);
    }
    if (typingtimeOut) clearTimeout(typingtimeOut.current);
    typingtimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setMeTyping(false);
    }, 1500);
  };
  const openFileMenu = useCallback(
    (e) => {
      (fileMenuRef.pageX = e.pageX), (fileMenuRef.pageY = e.pageY);
      dispatch(setIsFileMenu());
    },
    [dispatch]
  );

  //!Event listner handlers
  const isTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // setUsertyping(true)
      console.log(data, "istyping");

      dispatch(setUserTyping(true));
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    ({ data }) => {
      if (data.chatId !== chatId) return;
      // setUsertyping(false)
      console.log(data, "stooped");
      dispatch(setUserTyping(false));
    },
    [chatId]
  );

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // Safely update messages state
      setMessages((prevMessages) => [...prevMessages, data?.message || data]);
    },
    [chatId]
  );

  const AlertListener = useCallback(
    (content) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content,
        sender: {
          _id: "csefwfkjfnksfnkwfks",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
    },
    [chatId]
  );

  const refetchChatDetailsListener = useCallback(() => {
    console.log("heree");
    refetchChatDetails();
    if (!chatDetails) nav("/");
    console.log(chatDetails);
  }, [chatId, refetchChatDetails]);

  const eventHandlers = {
    [ALERT]: AlertListener,
    [REFETECH_CHATS]: refetchChatDetailsListener,
    [NEW_MESSAGE]: newMessagesListener,
    [IS_TYPING]: isTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault(); // Necessary to allow dropping
            console.log("entered");
            dragCounter.current += 1; // Increment counter
            if (dragCounter.current === 1) {
              setDraggedOver(true);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault(); // Necessary to allow dropping
           }}
          onDragLeave={(e) => {
            e.preventDefault();
            dragCounter.current -= 1; // Increment counter
            if (dragCounter.current === 0) {
              setDraggedOver(false);
            }
           }}
          onDrop={(e) => {
            e.preventDefault();
            setDraggedOver(false);
            dragCounter.current = 0;

            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleFileUpload(files);
            }
          }}
          className="z-0 relative h-full w-full"
        >
          {!chatDetailsLoading && (
            <Header user={chatDetails?.members[0]?.user} />
          )}
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(250px_circle_at_center,gray,transparent)]" // Increased dot pattern size
            )}
          />
          <div
            className={`flex flex-col justify-between border-box  flex-1 h-[calc(100%-4rem)]`}
          >
            {/* chat area */}

            <div
              ref={containerRef}
              className={`relative overflow-y-scroll flex flex-col scrollbar-thin scrollbar-track-primary-foreground p-2 pl-1 pr-2 md:pr-8 ${
                draggedOver ? "border-primary border-dashed border-2" : ""
              }`}
            >
              {draggedOver && (
                <div className="absolute top-0 left-0 w-full h-full z-50 bg-black/70 text-white text-3xl font-bold flex justify-center items-center">
                  Drop file here
                </div>
              )}
              {messageSuccess &&
                oldMessages?.map((message, index) => {
                  return (
                    <MessageComponent
                      key={index}
                      user={user}
                      message={message}
                    />
                  );
                })}
              {messageSuccess &&
                messages?.map((message, index) => {
                  return (
                    <MessageComponent
                      key={index}
                      user={user}
                      message={message}
                    ></MessageComponent>
                  );
                })}
              <div ref={bottomRef}> </div>
              {isFileMenu && (
                <FileMenu chatId={chatId} fileMenuRef={fileMenuRef} />
              )}
            </div>

            {/* send message area */}
            <div className=" w-full bg-card border border-separate">
              <form
                onSubmit={SubmitHandler}
                className="flex flex-col justify-center h-full w-full"
              >
                <div className="flex gap-1 py-5 px-6 relative items-center justify-around w-full ">
                  <div
                    className="p-1 flex gap-1 w-full items-center relative"
                    ref={fileMenuRef}
                  >
                    <input
                      type="text"
                      placeholder="send..."
                      className="border-primary-foreground bg-gray-200 rounded-xl  h-10 w-[90%]"
                      onChange={MessageOnChange}
                      value={message}
                    />
                    <div
                      className="mr-1"
                      ref={fileMenuRef}
                      onClick={openFileMenu}
                    >
                      <Paperclip
                        size={28}
                        className="bg-primary-foreground rounded-2xl hover:bg-secondary p-1 text-primary"
                      />
                    </div>
                    <div
                      onClick={SubmitHandler}
                      className="bg-primary-foreground rounded-2xl hover:bg-secondary"
                    >
                      <SendIcon className="text-primary" size={20} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {!chatDetailsIsError && !chatDetailsLoading && (
        <ChatDetailsSidebar
          chat={chatDetails}
          isOpen={isChatDetailsBarOpen}
          onClose={() => dispatch(setIsChatDetailsBarOpen())}
        />
      )}
    </>
  );
};

export default appLayout()(Chat);
