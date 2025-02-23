import axios from "axios";
import { ContextMenuItem } from "../ui/context-menu";
import { server } from "@/constant/config";
import { toast } from "sonner";

export const ContextMenuRender = ({ groupId, userGroupMembership, Member }) => {
  console.log(userGroupMembership, Member, groupId);

  const handleKickMember = async () => {
    try {
        const res= await axios.post(
            `${server}/api/v1/group/${groupId}/kick`,
            { userToBeKicked: Member.user.id },
            {
              withCredentials: true,
            }
          );
          console.log(res)
        } catch (error) {
            console.log(error)
            toast("some error occured")
    }
  };

  switch (userGroupMembership.role) {
    case "superadmin":
      return (
        <>
          <ContextMenuItem>View Profile</ContextMenuItem>
          <ContextMenuItem>Message</ContextMenuItem>
          <ContextMenuItem onClick={handleKickMember}>
            Remove from Group
          </ContextMenuItem>
        </>
      );

    case "admin":
      if (Member.role === "superadmin") {
        return (
          <>
            <ContextMenuItem>View Profile</ContextMenuItem>
            <ContextMenuItem>Message</ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                toast("Cannot remove creator of group.", {
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                });
              }}
            >
              Remove from Group
            </ContextMenuItem>
          </>
        );
      }
      return (
        <>
          <ContextMenuItem>View Profile</ContextMenuItem>
          <ContextMenuItem>Message</ContextMenuItem>
          <ContextMenuItem onClick={handleKickMember}>
            Remove from Group
          </ContextMenuItem>
        </>
      );

    case "member":
      return (
        <>
          <ContextMenuItem>View Profile</ContextMenuItem>
          <ContextMenuItem>Message</ContextMenuItem>
        </>
      );

    default:
      return (
        <>
          {" "}
          <ContextMenuItem>View Profile</ContextMenuItem>
          <ContextMenuItem>Message</ContextMenuItem>
        </>
      );
  }
};
