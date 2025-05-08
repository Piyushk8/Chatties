import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/helper";
import {
  useJoinGroupMutation,
  useGroupDetailsQuery,
} from "@/redux/reducers/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const InviteLinkJoinDialog = ({ open, onOpenChange, groupId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [joinGroup, { isLoading: isJoining }] = useJoinGroupMutation();

  // Fetch group details using RTK Query
  const {
    data,
    error,
    isLoading: isFetching,
  } = useGroupDetailsQuery({ id: groupId }, { skip: !groupId });

  const groupInfo = {
    groupName: data?.groupDetails?.groupname || "Unknown",
    groupCreated: data?.groupDetails?.createdAt
      ? timeAgo(data?.groupDetails?.createdAt)
      : "",
    id: data?.groupDetails?.id || "",
  };

  const handleJoinGroup = async () => {
    try {
      const groupData = await joinGroup({
        groupId,
        invite: true,
        check: false,
      }).unwrap(); toast({
        title: "Success",
        description: groupData.isMember
          ? "Already a member"
          : "Joined successfully",
      });
      setTimeout(() => navigate(`/group/${groupId}`), 500); // Delay navigation
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to join group",
      });
    } finally {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Fetch group details failed:", error);
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {error ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {error?.data?.message || "Failed to fetch group details"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Group</DialogTitle>
            <DialogDescription>
              Join "{groupInfo.groupName}" now.
            </DialogDescription>
          </DialogHeader>

          {isFetching ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-10 h-10" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {groupInfo.groupName.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-lg font-semibold">{groupInfo.groupName}</div>
              <div className="text-sm text-gray-500">
                Created: {groupInfo.groupCreated || "Unknown"}
              </div>
              <Button
                onClick={handleJoinGroup}
                disabled={isJoining || isFetching}
              >
                {isJoining ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Join"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default InviteLinkJoinDialog;
