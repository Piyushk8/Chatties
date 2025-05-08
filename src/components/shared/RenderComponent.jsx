import { PlayCircleIcon } from "lucide-react";
import React from "react";

const transformImage = (url = "", width = 200) => {
  return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
};

const RenderContent = ({ mediaType, url, sameSender }) => {
  switch (mediaType) {
    case "video":
      return (
        <div className={`p-2 relative w-full h-[95%] max-w-xs rounded-lg ${sameSender ? 'bg-opacity-90 bg-white/10' : 'bg-white/5'} flex items-center justify-center`}>
          <video
            className="rounded-lg w-full h-full object-contain hover:autoplay"
            src={url}
            autoPlay="focus"
          />
          <PlayCircleIcon className="absolute size-10 text-white opacity-85 hover:scale-110 transition" />
        </div>
      );

    case "image":
      return (
        <div className={`p-1 rounded-lg ${sameSender ? 'bg-opacity-90 bg-white/10' : 'bg-white/5'}`}>
          <img
            width="100%"
            height="auto"
            className="rounded-lg object-cover max-w-xs"
            src={transformImage(url)}
            alt="attachment"
          />
        </div>
      );

    case "audio":
      return (
        <div className={`p-2 rounded-lg ${sameSender ? 'bg-opacity-90 bg-white/10' : 'bg-white/5'}`}>
          <audio
            src={url}
            preload="auto"
            controls
            className="rounded-md max-w-xs w-full"
          />
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center p-2">
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
              // console.log(e.target.files[0]);
            }}
          />
        </div>
      );
  }
};

export default RenderContent;