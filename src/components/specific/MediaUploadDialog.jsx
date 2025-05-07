import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Send,
  X,
  FileText,
  Music,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useSendAttachmentsMutation } from "../../redux/reducers/api";
import { useDispatch } from "react-redux";
import { setUploadingLoader } from "../../redux/reducers/misc";
import { toast } from "sonner";

// Custom toast animations and styling
const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
};

// Custom toast component with motion
const CustomToast = ({ icon, title, description, className }) => (
  <motion.div
    variants={toastVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`flex items-start p-4 rounded-lg shadow-lg ${
      className || "bg-white"
    }`}
  >
    <div className="flex-shrink-0 mr-3">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: icon === Loader2 ? 360 : 0 }}
        transition={{
          repeat: icon === Loader2 ? Infinity : 0,
          duration: 1,
          ease: "linear",
        }}
      >
        {React.createElement(icon, { className: "w-6 h-6" })}
      </motion.div>
    </div>
    <div className="flex-1">
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
    </div>
  </motion.div>
);

const MediaUploadDialog = ({
  filesToUpload,
  onClose,
  onDiscard,
  chatId,
  onAddFiles,
  groupId,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation();
  const addFilesRef = useRef();

  if (filesToUpload.length === 0) {
    onClose();
    return null;
  }

  const renderMainPreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          src={file.url}
          alt="preview"
          className="max-h-full max-w-full object-contain rounded"
        />
      );
    } else if (file.type.startsWith("video")) {
      return (
        <video src={file.url} controls className="max-h-full max-w-full" />
      );
    } else if (file.type.startsWith("audio")) {
      return (
        <div className="flex items-center justify-center h-full">
          <audio src={file.url} controls />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="w-16 h-16 text-gray-400" />
          <p className="mt-2 text-gray-600">Preview not available</p>
          <p className="text-sm text-gray-500">{file.file.name}</p>
        </div>
      );
    }
  };

  const renderThumbnail = (file) => {
    if (!file) return;
    if (file.type.startsWith("image")) {
      return (
        <img
          src={file.url}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
      );
    } else if (file?.type?.startsWith("video")) {
      return (
        <video
          src={file.url}
          muted
          className="w-full h-full text-gray-400 m-auto"
        />
      );
    } else if (file.type?.startsWith("audio")) {
      return <Music className="w-8 h-8 text-gray-400 m-auto" />;
    } else {
      return <FileText className="w-8 h-8 text-gray-400 m-auto" />;
    }
  };

  const handleSend = async () => {
    if (filesToUpload.length > 5) {
      toast.custom(
        (t) => (
          <CustomToast
            icon={AlertCircle}
            title="Maximum 5 files allowed"
            description="You can only send up to 5 files at a time."
            className="bg-red-50 text-red-800 border border-red-200"
          />
        ),
        {
          duration: 4000,
        }
      );
      return;
    }

    dispatch(setUploadingLoader(true));
    const toastId = toast.custom(
      (t) => (
        <CustomToast
          icon={Loader2}
          title="Sending files..."
          description={`Uploading ${filesToUpload.length} file(s)`}
          className="bg-blue-50 text-blue-800 border border-blue-200"
        />
      ),
      {
        duration: 30000,
      }
    );

    try {
      const IsGroup = groupId ? true : false;
      const myForm = new FormData();
      myForm.append(chatId ? "chatId" : "groupId", groupId || chatId);

      filesToUpload.forEach((fileObj) => {
        if (fileObj.file) {
          myForm.append("files", fileObj.file);
        } else {
          console.error("No file found in fileObj", fileObj);
        }
      });

      const res = await sendAttachments({ data: myForm, IsGroup });
      if (res.data) {
        toast.custom(
          (t) => (
            <CustomToast
              icon={CheckCircle}
              title="Files sent successfully"
              description={`${filesToUpload.length} file(s) uploaded to the chat.`}
              className="bg-background border border-green-300 text-green-500"
            />
          ),
          {
            id: toastId,
            duration: 3000,
          }
        );
        onClose();
      } else {
        toast.custom(
          (t) => (
            <CustomToast
              icon={AlertCircle}
              title="Failed to send files"
              description="An error occurred while uploading. Please try again."
              className="bg-[#faebeb] dark:bg-[#1a0a0a] dark:text-[#e0dada] text-red-800 border border-red-800 dark:border-red-950"
            />
          ),
          {
            id: toastId,
            duration: 4000,
          }
        );
        console.log(res.error);
      }
    } catch (error) {
      toast.custom(
        (t) => (
          <CustomToast
            icon={AlertCircle}
            title="Failed to send files"
            description="An error occurred while uploading. Please try again."
            className="bg-[#faebeb] dark:bg-[#1a0a0a] dark:text-[#e0dada] text-red-800 border border-red-800 dark:border-red-950"
          />
        ),
        {
          id: toastId,
          duration: 4000,
        }
      );
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const handleAddFiles = (e) => {
    e.preventDefault();

    const files = e?.dataTransfer?.files || e.target.files;
    const ArrayFiles = Array.from(files);
    const modifiedFiles = ArrayFiles.map((file) => {
      const type = file.type.split("/")[0];
      const url = URL.createObjectURL(file);
      return {
        file, // the actual File object
        url,
        type,
        name: file.name,
      };
    });
    if (modifiedFiles.length === 0) return;
    onAddFiles(modifiedFiles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 -400 z-50"
    >
      <div className="relative w-[90vw] md:w-[500px] max-w-lg h-[60vh] bg-background rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-200 justify-center items-center">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow hover:bg-gray-100 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Main Preview Display */}
        <div className="flex-1 min-w-full bg-background max-h-[80%] min-h-[80%]">
          <div className="flex items-center h-full w-full justify-center bg-background backdrop-blur-md p-6">
            {renderMainPreview(filesToUpload[selectedImageIndex])}
          </div>
        </div>

        {/* Footer with Thumbnails and Buttons */}
        <div className="border-t p-3 flex justify-between w-full items-center h-full space-x-2">
          <button
            className="px-1 ml-2 py-1 text-primary hover:scale-105 transition"
            onClick={() => addFilesRef.current.click()}
          >
            <input
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleAddFiles(e)}
              onClick={() => console.log("clicked")}
              ref={addFilesRef}
              className="hidden"
            />
            <Paperclip />
          </button>
          <div className="border-x-0 border border-t-gray-300 border-b-gray-300 h-fit scrollbar-none px-2 py-1 max-w-2/3 overflow-x-auto overflow-y-hidden">
            <div className="flex space-x-2 max-w-[16rem]">
              {filesToUpload.map((file, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-none cursor-pointer border-2 rounded-md overflow-hidden transition w-16 h-16 hover:scale-105 ${
                    index === selectedImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <X
                    onClick={(e) => {
                      e.stopPropagation();
                      onDiscard(index);
                      setSelectedImageIndex(0);
                    }}
                    className="size-5 md:size-6 absolute top-0 right-0 backdrop-blur-lg rounded-full text-gray-400"
                  />
                  <div className="w-full h-full flex items-center justify-center">
                    {renderThumbnail(file)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="relative flex items-center justify-center bg-blue-100 p-2 rounded-md mr-1 transition hover:bg-blue-200"
            onClick={handleSend}
          >
            <Send className="size-6 text-primary hover:scale-105 transition-transform" />
            {filesToUpload.length > 0 && (
              <span className="absolute -bottom-1 -right-1 text-xs bg-white border border-blue-300 text-primary rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {filesToUpload.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaUploadDialog;
