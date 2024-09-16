import React from 'react'
import userAvatar from "../../assets/userAvatar.jpg"
const Avatar = ({avatar}) => {
  return (
    <div class=" w-10 h-10 rounded-full shadow-md shadow-orange-300 ">
    <img className="rounded-full w-10 h-10" src={avatar?.url || userAvatar} />
  </div>
  )
}

export default Avatar