import { setIsMediaPreview } from "@/redux/reducers/misc";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const MediaPreview = ({ url, mediaType}) => {
    const dispatch = useDispatch()
    return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={() =>dispatch(setIsMediaPreview(false))}
        className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full"
      >
        ✕
      </button>
      {mediaType === "video" ? (
        <video controls src={url} className="max-w-full max-h-full object-contain transition-transform duration-300"/>
      ) : (
        <img
          src={url}
          alt="Preview"
          className="max-w-full max-h-full object-contain transition-transform duration-300"
        />
      )}
    </div>
  );
};

export default MediaPreview;
