import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateChatMutation } from "../../redux/reducers/api";
import Avatar from "../shared/Avatar";

import { useToast } from "@/hooks/use-toast";

const InputFieldItem = ({ option, index, selected }) => {
  const [createChat, { isLoading, isError, isSuccess }] =
    useCreateChatMutation();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateChat = async () => {
    try {
      toast({
        title: "Creating Chat",
        description: "Please wait...",
      });
      const chatData = await createChat({ userId: option.id }).unwrap();
      if (chatData.exists) {
        return navigate(`/chat/${chatData.chatId}`);
      } else if (chatData.exists === false) {
        setCreating(true);
        if (chatData.chatId) {
          navigate(`/chat/${chatData.chatId}`);
          toast({
            title: "Success",
            description: "Chat created successfully",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong",
          });
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Link>
      <li
        key={index}
        onClick={handleCreateChat}
        className={`bg-card p-0.5 hover:bg-secondary cursor-pointer`}
      >
        <div className="flex border bg-card border-primary-foreground border-b-2 p-4 justify-start">
          <div className="mr-6">
            <Avatar avatar={option.avatar || option?.groupImage} />
          </div>
          <div className="sm:text-lg sm:text-card-foreground font-semibold overflow-x-auto text-ellipsis md:text-lg">
            {option.name || option?.groupname}
          </div>
        </div>
        {/* {isError && <p className="text-red-500">Failed to create chat.</p>}
                {isSuccess && <p className="text-green-500">Chat created successfully!</p>} */}
      </li>
    </Link>
  );
};

export default InputFieldItem;
