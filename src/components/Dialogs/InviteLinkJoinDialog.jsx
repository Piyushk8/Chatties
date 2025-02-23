import React, { useEffect, useState, useTransition, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import axios from "axios";
import { server } from "@/constant/config";
import { Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/helper";
import { toast } from "sonner";
import { useJoinGroupMutation } from "@/redux/reducers/api";
import { useNavigate } from "react-router-dom";

const InviteLinkJoinDialog = ({ open, onOpenChange, groupId }) => {
  const [groupInfo, setGroupInfo] = useState({
    groupName: "",
    groupCreated: "",
    id: "",
  });
  const [joinGroup, { isLoading }] = useJoinGroupMutation();
  const [Error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const nav = useNavigate()

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;

    startTransition(async () => {
      try {
        const res = await axios.get(
          `${server}/api/v1/group/search?groupId=${groupId}`,
          { withCredentials: true }
        );
        if (res?.data?.response?.success === false)
          setError("Invalid Group Link");
        setGroupInfo({
          groupName: res.data.group?.groupname || "Unknown",
          groupCreated: timeAgo(res.data.group?.createdAt) || "",
          id: res.data.id || "",
        });
      } catch (error) {
        console.error("Failed to fetch group info:", error);
      }
    });
  }, [groupId]);
  const handleJoinGroup = async () => {
    try {
      const toastId = toast.loading("Joining group...");
      const groupData = await joinGroup({
        groupId: groupId,
        invite:true,
        join: true,
      }).unwrap();
      console.log(groupData)
      if (groupData.success && !groupData?.isMember) {
        console.log("here1")
        toast.success("Joined successfully!");
        nav(`/group/${group.id}`);
    } 
    if(groupData.success && groupData.isMember){
        console.log("here")
          toast.success("Already a member");
          nav(`/group/${group.id}`);
      }
      
      else {
        toast.error("Something went wrong");
      }
      
    } catch (err) {
      toast.error("Failed to join group");
    } finally {
        onOpenChange(false)
    }
  };
  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {Error ? (
        "InValid or Expired Group Link"
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Group</DialogTitle>
            <DialogDescription>
              Join "{groupInfo.groupName}" now.
            </DialogDescription>
          </DialogHeader>

          {isPending ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-10 h-10" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {groupInfo.groupName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-lg font-semibold">{groupInfo.groupName}</div>
              <div className="text-sm text-gray-500">
                Created: {groupInfo.groupCreated || "Unknown"}
              </div>
              <Button onClick={handleJoinGroup}>Join</Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default InviteLinkJoinDialog;
