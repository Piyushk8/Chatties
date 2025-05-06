import { PlayCircleIcon } from "lucide-react";
import React from "react";

const transformImage = (url = "", width = 200) => {
  return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
};

const RenderContent = ({ mediaType, url }) => {
  switch (mediaType) {
    case "video":
      return (
        <div className="relative flex justify-center items-center">
          <video
            // preload="none"
            width="160"
            className=" rounded-lg w-fit max-w-[300px] shadow-sm object-cover"
            src={url}
          />
          <PlayCircleIcon className="absolute size-8 text-primary hover:scale-110 hover:animate-pulse hover:after:scale-90"/>
        </div>
      );

    case "image":
      return (
        <img
          width="150"
          height="100"
          style={{ objectFit: "cover" }}
          className="rounded-lg shadow-sm"
          src={transformImage(url)}
          alt="attachment"
        />
      );

    case "audio":
      return (
        <audio
          src={url}
          preload="auto"
          className="rounded-md max-w-[300px] w-fit mt-1"
        />
      );

    default:
      return (
        <div className="flex items-center justify-center">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-[#075E54] text-white px-4 py-2 rounded-full text-sm hover:bg-[#0a7669] transition"
          >
            📎 Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              // Stub for onChange handler — replace this with your own
              console.log(e.target.files[0]);
            }}
          />
        </div>
      );
  }
};

export default RenderContent;
