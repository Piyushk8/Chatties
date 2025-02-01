import React, { useEffect, useState } from "react";
import { Info, Bell, Lock, Star } from "lucide-react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import moment from "moment";

const ChatDetailsSidebar = ({
  chat,
  group,
  isGroup = false,
  isOpen,
  onClose,
}) => {
  const groupDetails = group?.groupDetails;
  const groupMembers = group?.groupMembers || [];
  const [currentMembers, setCurrentMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const name = chat?.members[0]?.user?.name || groupDetails?.groupname;
  const avatarImage =
    chat?.members[0]?.user?.avatar?.url || groupDetails?.groupImage || "";

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // // Update current members based on debounced query
  // Update current members based on debounced query
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

  const renderInfoTab = () => (
    <div className="space-y-4 p-4 flex-1">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 bg-card h-24 rounded-full">
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="text-white text-2xl">
            {name[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2 bg-muted w-full min-h-60 p-2 rounded-2xl">
        <div className="flex items-center flex-1 space-x-3">
          <Info className="text-muted-foreground" />
          <label className="text-primary text-lg w-fit">Name</label>
          <p className="bg-secondary rounded-2xl p-2">{name}</p>
        </div>

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
            <div className="flex items-center flex-1 space-x-3">
              Common Groups
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2">Media goes here</div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Bell className="text-muted-foreground" />
          <span>Mute Notifications</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Lock className="text-muted-foreground" />
          <span>Disappearing Messages</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Star className="text-muted-foreground" />
          <span>Pin Chat</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
    </div>
  );

  const memberListTab = () => (
    <div className="flex-col h-full w-full overflow-hidden p-3 justify-center items-center">
      <div className="text-center text-primary text-xl font-bold">Members</div>
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-input mb-2"
        placeholder="Search..."
      />
      <div className="bg-muted space-y-3 p-1 h-full overflow-y-auto w-full">
        {currentMembers?.length === 0 ? (
          "no members"
        ) : (
          <>
            {currentMembers?.map(({ user }, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.avatar?.url} />
                  <AvatarFallback className="bg-card">
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="w-1/2 truncate break-words">{user?.name}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

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
            {activeTab === "settings" && renderSettingsTab()}
            {activeTab === "members" && memberListTab()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatDetailsSidebar;
