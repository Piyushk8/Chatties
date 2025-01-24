import React from "react";
import userAvatar from "../../assets/userAvatar.jpg";
import { cn } from "@/lib/utils";
const Avatar = ({ avatar ,className ,height=10,width=10,}) => {
  return (
    <div class={cn(` w-${width} h-${height} flex justify-center items-center rounded-full`,className)}>
      <img className={`rounded-full  w-${width} h-${height}`} src={avatar?.url || userAvatar} />
    </div>
  );
};

export default Avatar;
