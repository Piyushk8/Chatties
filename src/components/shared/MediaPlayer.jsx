import { useEffect } from "react";

export default function VideoPopup({ mediaSrc, onClose, MediaType }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const sharedContainerClass =
    "fixed inset-0 z-50 bg-black flex items-center justify-center";

  const closeButtonClass =
    "absolute top-5 right-5 text-white text-3xl hover:scale-110 transition-transform z-50";

  const mediaWrapperClass =
    "relative max-w-full max-h-full w-[90%] h-[90%] flex items-center justify-center";

  const mediaClass =
    "max-h-full max-w-full rounded-lg shadow-md object-contain";

  switch (MediaType) {
    case "image":
      return (
        <div className={sharedContainerClass}>
          <div className={mediaWrapperClass}>
            <button onClick={onClose} className={closeButtonClass}>
              ✕
            </button>
            <img className={mediaClass} src={mediaSrc} alt="preview" />
          </div>
        </div>
      );
    case "video":
      return (
        <div className={sharedContainerClass}>
          <div className={mediaWrapperClass}>
            <button onClick={onClose} className={closeButtonClass}>
              ✕
            </button>
            <video
              controls
              autoPlay
              className={mediaClass}
              src={mediaSrc}
            />
          </div>
        </div>
      );
    case "audio":
      return (
        <div className={sharedContainerClass}>
          <div className="relative max-w-md w-full px-4 py-6 bg-black rounded-lg">
            <button onClick={onClose} className={closeButtonClass}>
              ✕
            </button>
            <audio
              controls
              autoPlay
              className="w-full mt-6 rounded-md"
              src={mediaSrc}
            />
          </div>
        </div>
      );
  }
}
