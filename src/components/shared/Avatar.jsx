import React from 'react'
import userAvatar from "../../assets/userAvatar.jpg"
const Avatar = ({avatar}) => {
  return (
    <div class="ring-primary ring-offset-base-100 w-10 h-10 rounded-full ring ring-offset-2">
    <img className="rounded-full w-10 h-10" src={avatar?.url || userAvatar} />
  </div>
  )
}

export default Avatar