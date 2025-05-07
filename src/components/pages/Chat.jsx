import React, {
  Fragment,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import appLayout from "../Layout/appLayout";
import { useNavigate } from "react-router-dom";
import {
  useChatDetailsQuery,
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
  MARK_MESSAGES_READ,
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
import { Loader2, Paperclip, SendIcon, X } from "lucide-react";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import FileMenu from "../specific/FileMenu";
import { removeUnreadChat } from "@/redux/reducers/chat";
import ScrollBottomButton from "../shared/ScrollToBottom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MediaUploadDialog from "../specific/MediaUploadDialog";

const ChatDetailsSidebar = lazy(() => import("../specific/ProfileSideBar"));

const Chat = ({ chatId, user }) => {
  const { socket } = getSocket();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [page, setpage] = useState(1);

  const [filesToUpload, setFilesToUpload] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [MeTyping, setMeTyping] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const typingtimeOut = useRef(null);
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  const bottomRef = useRef(null);
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
    if (!chatDetails && !chatDetailsLoading) {
      nav("/");
    }
    if (chatDetailsIsError && !chatDetailsLoading) {
      nav("/");
    }
  }, [chatDetails, chatDetailsLoading, chatDetailsIsError, nav]);

  const {
    data,
    isLoading,
    isSuccess: messageSuccess,
    isError,
    error,
    refetch: refetchMessages,
  } = useGetMessagesQuery({
    page,
    id: chatId,
  });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    data?.totalMessages,
    page,
    setpage,
    data?.messages,
    false // Ascending order from server
  );

  const handleFileUpload = (files) => {
    const ArrayFiles = Array.from(files);
    const newPreviews = ArrayFiles.map((file) => {
      const type = file.type.split("/")[0];
      const url = URL.createObjectURL(file);
      return {
        file, // the actual File object
        url,
        type,
        name: file.name,
      };
    });

    setFilesToUpload(newPreviews);
    console.log(filesToUpload);
    
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
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
    if (typingtimeOut.current) clearTimeout(typingtimeOut.current);
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

  const isTypingListener = useCallback(
    ({ data }) => {
      if (data.chatId !== chatId) return;
      dispatch(setUserTyping(true));
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    ({ data }) => {
      if (data.chatId !== chatId) return;
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
      if (content.chatId !== chatId) return;
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
    refetchChatDetails();
    if (!chatDetails) nav("/");
  }, [chatId, refetchChatDetails, nav]);

  const eventHandlers = {
    [REFETECH_CHATS]: refetchChatDetailsListener,
    [NEW_MESSAGE]: newMessagesListener,
    [IS_TYPING]: isTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);

  useEffect(() => {
    if (containerRef.current) {
      const event = new Event("scroll");
      containerRef.current.dispatchEvent(event);
    }
  }, [messages]);

  useEffect(() => {
    setpage(1);
    setMessages([]);
    setOldMessages([]);
    refetchMessages();
    refetchChatDetails();
  }, [chatId, refetchMessages, refetchChatDetails, setOldMessages]);

  useEffect(() => {
    socket.emit(
      MARK_MESSAGES_READ,
      { chatId, userId: user?.id },
      (response) => {
        if (response.success) dispatch(removeUnreadChat(chatId));
      }
    );
  }, [messages, chatId, user?.id, dispatch, socket]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, oldMessages]);

  useEffect(() => {
    console.log("Messages:", {
      oldMessages: oldMessages.map((m) => ({
        id: m.id,
        createdAt: m.createdAt,
      })),
      messages: messages.map((m) => ({ id: m.id, createdAt: m.createdAt })),
    });
  }, [oldMessages, messages]);

  const handleDiscardFilefromFiles = (indexToRemove) => {
    console.log("before", filesToUpload);
    setFilesToUpload((prev) =>
      prev?.filter((i, index) => index !== indexToRemove)
    );
    if (filesToUpload.length === 0) setFilesToUpload(0);
    console.log("after", filesToUpload);
  };

  const handleAddFiles = (files) => {
    if (files.length === 0) return;
    setFilesToUpload((prev) => {
      const newFiles = Array.isArray(files) ? files : [files];
      return prev ? [...prev, ...newFiles] : newFiles;
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            dragCounter.current += 1;
            if (dragCounter.current === 1) {
              setDraggedOver(true);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            dragCounter.current -= 1;
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
          {!chatDetailsLoading && (
            <ChatHeader user={chatDetails?.members[0]?.user} />
          )}
          <DotPattern
            className={cn(
              "absolute",
              "[mask-image:radial-gradient(250px_circle_at_center,gray,transparent)]"
            )}
          />
          <div className="relative flex flex-col justify-between border-box flex-1 h-[calc(100%-3.7rem)]">
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
                oldMessages?.map((message, index) => (
                  <MessageComponent key={index} user={user} message={message} />
                ))}
              {messageSuccess &&
                messages?.map((message, index) => (
                  <MessageComponent key={index} user={user} message={message} />
                ))}
              <div ref={bottomRef} className="h-[0px] hidden w-0 z-50"></div>
              <ScrollBottomButton
                containerRef={containerRef}
                messages={[...oldMessages, ...messages]}
              />
              {isFileMenu && (
                <FileMenu chatId={chatId} fileMenuRef={fileMenuRef} />
              )}
              {/* mediaPReview */}
              {filesToUpload && (
                <MediaUploadDialog
                  filesToUpload={filesToUpload}
                  onClose={() => setFilesToUpload(null)}
                  chatId={chatId}
                  onAddFiles={handleAddFiles}
                  onDiscard={handleDiscardFilefromFiles}
                />
              )}
            </div>
            <div className="w-full bg-card border border-separate">
              <form
                onSubmit={SubmitHandler}
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
                      onChange={MessageOnChange}
                      value={message}
                    />
                    <div className="mr-1" onClick={openFileMenu}>
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