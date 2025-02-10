import React, {
  Fragment,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import appLayout from "../Layout/appLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGroupDetailsQuery,
  useGetGroupMessagesQuery,
  useGetMessagesQuery,
} from "../../redux/reducers/api";
import MessageComponent from "../shared/messageComponent";
import { useInfiniteScrollTop } from "../../hooks/hook";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  IS_TYPING,
  STOP_TYPING,
  REFETECH_CHATS,
  NEW_GROUP_MESSAGE,
  MARK_GROUP_MESSAGES_READ,
} from "../../constant/event";
import { useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsChatDetailsBarOpen,
  setIsFileMenu,
  setUserTyping,
} from "../../redux/reducers/misc";
import ChatHeader from "../Layout/ChatHeader";
import { Loader2, Paperclip, SendIcon } from "lucide-react";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import FileMenu from "../specific/FileMenu";
import { removeUnreadChat } from "@/redux/reducers/chat";
import ScrollBottomButton from "../shared/ScrollToBottom";
const ChatDetailsSidebar = lazy(() => import("../specific/ProfileSideBar"));

const GroupPage = ({ groupId, user }) => {
  const { socket } = getSocket();
  const dispatch = useDispatch();
  const nav = useNavigate("/");
  console.log(groupId);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [meTyping, setMeTyping] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const typingTimeout = useRef(null);
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  const bottomRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dragCounter = useRef(0);

  const { userTyping, isFileMenu, isChatDetailsBarOpen } = useSelector(
    (state) => state.misc
  );
  const {
    data: groupDetails,
    refetch: refetchGroupDetails,
    isError: groupDetailsIsError,
    isLoading: groupDetailsLoading,
  } = useGroupDetailsQuery({ id: groupId });
  const members = groupDetails?.groupMembers?.map((member) => member?.userId);

  useEffect(() => {
    if (!groupDetails && !groupDetailsLoading) {
      console.log(groupDetails, groupDetailsLoading);
      nav("/");
    }
    if (groupDetailsIsError && !groupDetailsLoading) {
      // console.log(groupDetails);
      nav("/");
    }
  }, [groupDetails]);

  const {
    data,
    isLoading,
    isSuccess: messageSuccess,
    isError,
    error,
    refetch: refetchMessages,
  } = useGetGroupMessagesQuery({
    page,
    id: groupId,
  });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    data?.totalMessages,
    page,
    setPage,
    data?.messages
  );
  const errorHandler = () => {
    // error handling page logic
  };

  // DropZoneHandlers

  //! all handlers
  const handleFileUpload = (files) => {
    const file = files[0];
    // Implement file upload logic here
    console.log(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // to emit message to server

    socket.emit(NEW_GROUP_MESSAGE, { groupId, members, message });
    setMessage("");
  };

  const messageOnChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);

    if (!meTyping) {
      socket.emit("", { members, groupId, userId: user?.id });
      setMeTyping(true);
    }
    if (typingTimeout) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("", { members, groupId });
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

  //! Event listener handlers
  const isTypingListener = useCallback(
    (data) => {
      if (data.groupId !== groupId) return;
      console.log(data, "is typing");
      dispatch(setUserTyping(true));
    },
    [groupId]
  );

  const stopTypingListener = useCallback(
    ({ data }) => {
      if (data.groupId !== groupId) return;
      console.log(data, "stopped");
      dispatch(setUserTyping(false));
    },
    [groupId]
  );

  const newMessagesListener = useCallback(
    (data) => {
      if (data.groupId !== groupId) return;
      // Safely update messages state
      setMessages((prevMessages) => [...prevMessages, data?.message || data]);
    },
    [groupId]
  );

  const alertListener = useCallback(
    (content) => {
      if (data.groupId !== groupId) return;
      const messageForAlert = {
        content,
        sender: {
          _id: "csefwfkjfnksfnkwfks",
          name: "Admin",
        },
        groupId,
        createdAt: new Date().toISOString(),
      };
    },
    [groupId]
  );

  const refetchGroupDetailsListener = useCallback(() => {
    console.log("here");
    refetchGroupDetails();
    if (!groupDetails) nav("/");
  }, [groupId, refetchGroupDetails]);

  const eventHandlers = {
    [REFETECH_CHATS]: refetchGroupDetailsListener,
    [NEW_GROUP_MESSAGE]: newMessagesListener,
    [IS_TYPING]: isTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Reset all message-related states explicitly
    setPage(1); // Reset to first page
    setMessages([]); // Clear current messages
    setOldMessages([]); // Clear old messages

    // Trigger fresh data fetching
    refetchMessages();
    refetchGroupDetails();
  }, [groupId]);


  useEffect(() => {
    socket.emit(
      MARK_GROUP_MESSAGES_READ,
      { groupId, userId: user?.id },
      (response) => {
        if (!!response.success) dispatch(removeUnreadChat(groupId));
      }
    );
  }, [messages]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin " />
        </div>
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
          className="relative h-full w-full flex-col flex-1"
        >
          {!groupDetailsLoading && (
            <ChatHeader group={groupDetails?.groupDetails} />
          )}
          <DotPattern
            className={cn(
              "absolute",
              "[mask-image:radial-gradient(250px_circle_at_center,gray,transparent)]" // Increased dot pattern size
            )}
          />
          <div className="flex flex-col justify-between border-box flex-1 h-[calc(100%-3.7rem)]">
            {/* chat area */}
            <div
              ref={containerRef}
              className={`px-2 overflow-y-scroll flex flex-col scrollbar-none pl-1 pr-2 md:pr-8 ${
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
                    />
                  );
                })}
              <div ref={bottomRef} className="h-[0px] hidden w-0 z-50"></div>
              <ScrollBottomButton
                containerRef={containerRef}
                messages={[...oldMessages, ...messages]}
              />
              {isFileMenu && (
                <FileMenu groupId={groupId} fileMenuRef={fileMenuRef} />
              )}
            </div>

            {/* send message area */}
            <div className="w-full bg-card border border-separate">
              <form
                onSubmit={submitHandler}
                className="flex flex-col justify-center h-full w-full"
              >
                <div className="flex gap-1 py-5 px-6 relative items-center justify-around w-full">
                  <div
                    className="p-1 flex gap-1 w-full items-center relative"
                    ref={fileMenuRef}
                  >
                    <input
                      type="text"
                      placeholder="send..."
                      className="border-primary-foreground text-slate-700 bg-gray-200 rounded-xl h-10 w-[90%]"
                      onChange={messageOnChange}
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
                      onClick={submitHandler}
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
      {!groupDetailsIsError && !groupDetailsLoading && (
        <ChatDetailsSidebar
          group={groupDetails}
          isGroup={true}
          isOpen={isChatDetailsBarOpen}
          onClose={() => dispatch(setIsChatDetailsBarOpen())}
        />
      )}
    </>
  );
};

export default appLayout()(GroupPage);
