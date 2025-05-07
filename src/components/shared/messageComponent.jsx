import React, { useState } from "react";
import { fileFormat } from "../../lib/feature";
import RenderContent from "./RenderComponent";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import VideoPopup from "./MediaPlayer";
import { timeAgo } from "@/lib/helper";

const MessageComponent = ({ user, message, group }) => {
  const [mediaActive, setMediaActive] = useState({ url: "", mediaType: "" } || null);
  const { sender, content, attachment = [], createdAt } = message;
  const sameSender = sender?.id === user?.id;
  const time = timeAgo(createdAt);
  
  const handleMediaActiveClose = () => {
    setMediaActive(null);
  };

  return (
    <div
      style={{
        marginBottom: "2px",
        maxWidth: "50%",
        alignSelf: sameSender ? "flex-end" : "flex-start",
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`rounded-lg my-0.5 md:mt-2 flex flex-col min-h-11 h-fit ${
              sameSender
                ? `text-primary-foreground bg-primary`
                : `bg-secondary text-secondary-foreground`
            }`}
          >
            {content ? <div className="p-3">{content}</div> : ""}
            
            {attachment?.length > 0 && (
              <div className={`${attachment.length > 0 && !content ? "" : "mt-1"}`}>
                {attachment?.map((attachment, index) => {
                  const url = attachment;
                  const mediaType = fileFormat(url);
                  return (
                    <React.Fragment key={index}>
                      <div
                        className="w-full max-w-xs my-1 mx-auto cursor-pointer"
                        onClick={() => setMediaActive({ url: url, mediaType: mediaType })}
                      >
                        <RenderContent url={url} mediaType={mediaType} sameSender={sameSender} />
                      </div>
                      {mediaActive && (
                        <VideoPopup
                          mediaSrc={mediaActive.url}
                          MediaType={mediaActive.mediaType}
                          onClose={handleMediaActiveClose}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            
            <div className="text-[10px] px-2 py-1 text-right opacity-70">
              {time}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem>Forward Message</ContextMenuItem>
          <ContextMenuItem>Edit Message</ContextMenuItem>
          <ContextMenuItem>Delete for me</ContextMenuItem>
          <ContextMenuItem>Delete for everyone</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default MessageComponent;