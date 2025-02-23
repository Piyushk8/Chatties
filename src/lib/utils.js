import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getFileType = (url) => {
  if(!url)return
  const extension = url.split('.').pop().split('?')[0].toLowerCase(); // Get file extension

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
    return 'video';
  } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension)) {
    return 'audio';
  } else {
    return 'file'; // Other types like PDFs, docs, etc.
  }
};
