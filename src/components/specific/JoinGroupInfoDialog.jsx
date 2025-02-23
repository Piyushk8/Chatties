import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const JoinGroupInfoDialog = ({
  groupInfo,
  open,
  onOpenChange,
  handleJoinGroup,
}) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center">Join Group</DialogTitle>
          <DialogDescription className="text-center">
            click the join button to join the group
          </DialogDescription>
        </DialogHeader>
        <div className="flex font-mono space-y-2 flex-col justify-center items-center">
          <Avatar className="w-20 h-20 rounded-full">
            <AvatarImage></AvatarImage>
            <AvatarFallback className="text-2xl">
              {groupInfo.groupname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="text-2xl">{groupInfo?.groupname}</div>
            <div>{"GroupInfo"}</div>
            <div className="text-primary">{groupInfo.groupType} group</div>
          </div>
          <Button className="text-mono mt-2" onClick={handleJoinGroup}>
            {groupInfo.groupType === "private" ? "Request to join" : "Join"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupInfoDialog;
