import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/reducers/api";
import {
  AudioLinesIcon,
  FilesIcon,
  UserCircleIcon,
  VideoIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FileMenu = memo(({ fileMenuRef, chatId, groupId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const top = fileMenuRef.pageY - 180;
  const left = fileMenuRef.pageX - 180;

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu());

  const selectImage = () => {
    if (imageRef.current) {
      imageRef.current.click();
    } else {
      console.error("imageRef is not correctly bound");
    }
  };
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;

    if (files.length > 5)
      return toast({
        variant: "destructive",
        title: "Error",
        description: `You can only send 5 ${key} at a time`,
      });

    dispatch(setUploadingLoader(true));

    toast({
      title: "Sending Files",
      description: `Sending ${key}...`,
    });
    closeFileMenu();

    try {
      const IsGroup = groupId ? true : false;
      const myForm = new FormData();

      myForm.append(chatId ? "chatId" : "groupId", groupId || chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments({ data: myForm, IsGroup: IsGroup });
      if (res.data)
        toast({
          title: "Success",
          description: `${key} sent successfully`,
        });
      else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to send ${key}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <div
      style={{ position: "fixed", top: `${top}px`, left: `${left}px` }}
      class="z-50 w-48 rounded-l-lg text-card-foreground bg-card border border-separate rounded-lg"
    >
      <div>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/gif"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Images")}
          ref={imageRef}
        />
        <button
          onClick={selectImage}
          type="button"
          class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10 hover:bg-secondary"
        >
          <div>
            <UserCircleIcon size={15} className="mr-3" />
          </div>
          image
        </button>
      </div>
      <div>
        <button
          onClick={selectAudio}
          type="button"
          class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10 hover:bg-secondary"
        >
          <div>
            <AudioLinesIcon size={15} className="mr-3" />
          </div>
          Audio
        </button>
        <input
          type="file"
          multiple
          accept="audio/mpeg, audio/wav"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Audios")}
          ref={audioRef}
        />
      </div>

      <div>
        <button
          onClick={selectVideo}
          type="button"
          class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10 hover:bg-secondary "
        >
          <div>
            <VideoIcon size={15} className="mr-3" />
          </div>
          video
        </button>
        <input
          type="file"
          multiple
          accept="video/mp4, video/webm, video/ogg"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Videos")}
          ref={videoRef}
        />
      </div>
      <div>
        <button
          onClick={selectFile}
          type="button"
          class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10 hover:bg-secondary"
        >
          <div>
            <FilesIcon size={15} className="mr-3" />
          </div>
          Documents
        </button>
        <input
          type="file"
          multiple
          accept="*"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Files")}
          ref={fileRef}
        />
      </div>
    </div>
  );
});

export default FileMenu;
