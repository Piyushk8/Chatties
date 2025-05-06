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

const MessageComponent = ({ user, message, group }) => {
  const [mediaActive, setMediaActive] = useState(false);
  const { sender, content, attachment = [], createdAt } = message;
  const sameSender = sender?.id === user?.id;
  const timeAgo = moment(createdAt).fromNow();
  console.log(mediaActive);
  const handleMediaActiveClose = () => {
    setMediaActive(false);
    console.log("here");
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
            className={`p-3 rounded-lg     my-0.5 md:mt-2  flex flex-col  min-h-11 h-fit ${
              (sameSender
                ? `text-primary-foreground bg-primary`
                : `bg-secondary text-secondary-foreground`)
            }`}
          >
            {content ? <div>{content}</div> : ""}
            <div className="">
              {attachment?.length > 0 &&
                attachment?.map((attachment, index) => {
                  const url = attachment;
                  const mediaType = fileFormat(url);
                  console.log(attachment,mediaType)
                  // console.log(RenderContent(url,file));
                  return (
                    <>
                      <div key={index} onClick={() => setMediaActive(true)}>
                        {/* <a
                        href=""
                        target="_blank"
                        download
                        style={{ color: "black" }}
                      > */}
                        {RenderContent({ url, mediaType })}
                        {/* </a> */}
                      </div>
                      {mediaActive && (
                        <VideoPopup
                          mediaSrc={url}
                          MediaType={mediaType}
                          onClose={handleMediaActiveClose}
                        ></VideoPopup>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </ContextMenuTrigger>

        {/* ContextMenuContent must be inside ContextMenu */}
        <ContextMenuContent>
          <ContextMenuItem>Forward Message</ContextMenuItem>
          <ContextMenuItem>Edit Message</ContextMenuItem>
          <ContextMenuItem>Delete for me</ContextMenuItem>
          <ContextMenuItem>Delete for everyone</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="self-end w-full h-fit text-[8px] p-0 text-[#B0B0B0] ${sameSender?`text-white bg-orange-500`:`bg-slate-200`}">
        {sameSender ? ` ${timeAgo}` : `${timeAgo}`}
      </div>
    </div>
  );
};

export default MessageComponent;
