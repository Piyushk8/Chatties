import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
//import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon,  VideoFile as VideoFileIcon} from '@mui/icons-material';
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/reducers/api";
import {
  AudioLinesIcon,
  FilesIcon,
  UserCircleIcon,
  VideoIcon,
} from "lucide-react";

const FileMenu = memo(({ fileMenuRef, chatId ,groupId}) => {
  const { isFileMenu } = useSelector((state) => state.misc);

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
      imageRef.current.click(); // Ensure the ref is correct and clicking is working
    } else {
      console.error("imageRef is not correctly bound");
    }
  };
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    console.log(files);
    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append(chatId ? "chatId":"groupId", groupId || chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments({data:myForm,IsGroup:true});
      console.log(res.error)
      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

      // Fetching Here
    } catch (error) {
      toast.error(error, { id: toastId });
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
          class="relative inline-flex  items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10  hover:bg-secondary"
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
          class="relative inline-flex  items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10  hover:bg-secondary"
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
          class="relative inline-flex  items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10  hover:bg-secondary "
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
          onClick={selectVideo}
          type="button" class="relative inline-flex  items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:text-card-foreground focus:z-10  hover:bg-secondary">
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
