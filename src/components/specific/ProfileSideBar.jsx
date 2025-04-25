import React, { memo, useEffect, useState } from "react";
import { Info, Bell, Lock, Star, MoreVertical } from "lucide-react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import moment from "moment";
import axios from "axios";
import { CLIENT_URL, server } from "@/constant/config";
import { getFileType } from "@/lib/utils";
import MediaPreview from "./MediaPreview";
import { setIsMediaPreview } from "@/redux/reducers/misc";
import { useDispatch, useSelector } from "react-redux";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ContextMenuRender } from "./ContextMenuRender";
import InviteLinkCopy from "./CopyLink";

const ChatDetailsSidebar = ({
  chat,
  group,
  isGroup = false,
  isOpen,
  onClose,
}) => {
  const groupDetails = group?.groupDetails;
  const userGroupMembership = group?.userGroupMembership[0];
  const groupMembers = group?.groupMembers || [];
  const [currentMembers, setCurrentMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [attachments, setAttachments] = useState([]); // Moved state to the top
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const { IsMediaPreview } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const name = chat?.members[0]?.user?.name || groupDetails?.groupname;
  const avatarImage =
    chat?.members[0]?.user?.avatar?.url || groupDetails?.groupImage || "";

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Update current members based on search query
  useEffect(() => {
    if (isGroup) {
      if (debouncedQuery.trim() === "") {
        setCurrentMembers(groupMembers);
      } else {
        const searchTerm = debouncedQuery.trim().toLowerCase();
        const filteredUsers = groupMembers.filter(
          (user) =>
            user?.user?.name?.toLowerCase().includes(searchTerm) ||
            user?.user?.username?.toLowerCase().includes(searchTerm) ||
            user?.user?.email?.toLowerCase().includes(searchTerm)
        );
        setCurrentMembers(filteredUsers);
      }
    }
  }, [debouncedQuery, groupMembers, isGroup]);

  // Fetch attachments when media tab is opened
  useEffect(() => {
    if (
      activeTab === "media" &&
      (chat?.members[0]?.chatId || groupDetails?.id)
    ) {
      const fetchAttachments = async () => {
        try {
          const response = await axios.get(
            `${server}/api/v1/${isGroup ? "group" : "chat"}/attachments/${
              isGroup ? groupDetails?.id : chat?.members[0]?.chatId
            }`,
            { withCredentials: true }
          );
          setAttachments(response.data?.attachments);
        } catch (error) {
          console.error("Error fetching attachments:", error);
        }
      };
      fetchAttachments();
    }
  }, [activeTab, chat?.members?.chatId]); // Runs when tab changes or chatId updates

  const renderInfoTab = () => (
    <div className="space-y-4 p-4 flex-1">
      <div className="flex flex-col items-center">
        <Avatar
          onClick={() => {
            if (!avatarImage) return;
            setPreviewType("image");
            setPreviewUrl(avatarImage);
            dispatch(setIsMediaPreview(true));
          }}
          className="w-24 bg-card h-24 rounded-full"
        >
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="text-white text-2xl">
            {name[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2 bg-muted w-full min-h-60 p-2 rounded-2xl">
       {/* InviteLink */}
        {isGroup && (
          <>
            <div className="flex items-center flex-1 space-x-3">
              <Info className="text-muted-foreground" />
              <label className="text-primary text-lg w-fit">Name</label>
              <p className="bg-secondary rounded-2xl p-2">{name}</p>
            </div>
            <div className="">
              share this link to invite friends
              <InviteLinkCopy groupId={groupDetails?.id} />
            </div>
          </>
        )}
{/* Common Groups. */}
        {!isGroup && (
          <>
            <div className="flex items-center flex-1 space-x-3">
              <Info className="text-muted-foreground" />
              <label className="text-primary text-lg w-fit">
                {isGroup ? "Created" : "Joined"}
              </label>
              <p className="bg-secondary rounded-2xl p-2">
                {moment(
                  isGroup
                    ? groupDetails?.createdAt
                    : chat?.members[0]?.user?.createdAt
                ).fromNow() || "No description"}
              </p>
            </div>
            <div className="flex text-center items-center flex-1 space-x-3">
              Common Groups
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderMediaTab = () => {
    return (
      <div className="p-4">
        {attachments.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {attachments.map(({ attachment }, index) => {
              const fileType = getFileType(attachment[0]);
              if (fileType === "image") {
                return (
                  <div
                    key={index}
                    className="rounded-lg h-28 w-28 overflow-hidden"
                    onClick={() => {
                      setPreviewType("image");
                      setPreviewUrl(attachment[0]);
                      dispatch(setIsMediaPreview(true));
                    }}
                  >
                    <img
                      src={attachment[0]}
                      alt="Attachment"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                );
              }
              if (fileType === "video") {
                return (
                  <div
                    key={index}
                    className="rounded-lg h-28 w-28 overflow-hidden"
                    onClick={() => {
                      setPreviewType("video");
                      setPreviewUrl(attachment[0]);
                      dispatch(setIsMediaPreview(true));
                    }}
                  >
                    <video
                      // height={100}
                      // width={100}
                      src={attachment[0]}
                      alt="Attachment"
                      autoPlay
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                );
              }
            })}
            {/* {attachments.map(({ attachment }, index) => {
              const fileType = getFileType()
              return(
              <div key={index} className="rounded-lg h-28 w-28 overflow-hidden">
                {
                }
              </div>
            )})} */}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No media available
          </p>
        )}
      </div>
    );
  };
  const renderMembers = () => {
    return (
      <div className="p-4">
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        {currentMembers.length > 0 ? (
          <ul>
            {currentMembers.map((member) => (
              <ContextMenu key={member.user.id}>
                <ContextMenuTrigger>
                  <li className="flex items-center p-2 my-2 bg-muted rounded-lg">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage
                        src={member.user.avatar?.url || "/default-avatar.png"}
                      />
                      <AvatarFallback>
                        {member.user.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex justify-between w-full">
                      <div>
                        <p className="text-primary font-medium">
                          {member.user.name || "Unknown"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          @{member.user.username || "unknown"}
                        </p>
                      </div>
                      <div
                        className={`${
                          member.role === "member"
                            ? "text-card-foreground"
                            : "text-primary"
                        } text-sm font-mono`}
                      >
                        {member.role === "superadmin" || member.role === "admin"
                          ? "admin"
                          : "member"}
                      </div>
                    </div>
                  </li>
                </ContextMenuTrigger>

                {/* ContextMenuContent must be inside ContextMenu */}
                <ContextMenuContent>
                  <ContextMenuRender
                    userGroupMembership={userGroupMembership}
                    Member={member}
                    groupId={groupDetails.id}
                  />
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No members found</p>
        )}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("info")}
                className={`${
                  activeTab === "info"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Info
              </button>
              {isGroup && (
                <button
                  onClick={() => setActiveTab("members")}
                  className={`${
                    activeTab === "members"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Members
                </button>
              )}
              <button
                onClick={() => setActiveTab("media")}
                className={`${
                  activeTab === "media"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`${
                  activeTab === "settings"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Settings
              </button>
            </div>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto">
            {activeTab === "info" && renderInfoTab()}
            {activeTab === "media" && renderMediaTab()}
            {activeTab === "members" && renderMembers()}
          </div>
        </div>
        {IsMediaPreview && (
          <MediaPreview url={previewUrl} mediaType={previewType} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default memo(ChatDetailsSidebar);
