import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../shared/Avatar";
import { toast } from "sonner";
import { useJoinGroupMutation } from "@/redux/reducers/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { setIsSearch } from "@/redux/reducers/misc";
import { useDispatch } from "react-redux";
import JoinGroupInfoDialog from "./JoinGroupInfoDialog";

const GroupItem = ({ group, index }) => {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();
  const [showDialog, setShowDialog] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch()

  const handleCheckGroup = async () => {
    try {
      const groupData = await joinGroup({ groupId: group.id ,check:true}).unwrap();

      if (groupData.isMember) {
        // If user is already in the group, redirect to group chat
         dispatch(setIsSearch(false));
        nav(`/group/${group.id}`);
      } else {
        // Show join group dialog
        setShowDialog(true);
      }
    } catch (err) {
      toast.error("Failed to check group membership");
    }
  };

  const handleJoinGroup = async () => {
    try {
        console.log('clicked')
      const toastId = toast.loading("Joining group...");
      const groupData = await joinGroup({ groupId: group.id, join: true }).unwrap();
      if (groupData.success) {
        toast.success("Joined successfully!", { id: toastId });
        nav(`/group/${group.id}`);
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to join group");
    } finally {
      setShowDialog(false);
      dispatch(setIsSearch(false))
    }
  };

  return (
    <>
      <Link>
        <li
          key={index}
          onClick={handleCheckGroup}
          className={`bg-card p-0.5 hover:bg-secondary cursor-pointer`}
        >
          <div className="flex border bg-card border-primary-foreground border-b-2 p-4 justify-start">
            <div className="mr-6">
              <Avatar avatar={group.avatar || group?.groupImage} />
            </div>
            <div className="sm:text-lg sm:text-card-foreground font-semibold overflow-x-auto text-ellipsis md:text-lg">
              {group.name || group?.groupname}
            </div>
          </div>
        </li>
      </Link>

      {/* Join Group Dialog */}
      {
        showDialog && <JoinGroupInfoDialog groupInfo={group} handleJoinGroup={handleJoinGroup} open={showDialog} onOpenChange={setShowDialog}/> 
      }
     
    </>
  );
};

export default GroupItem;
