import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import userAvatar from "../../assets/userAvatar.jpg"
const Header = ({user}) => {
const [isProfileOpen, setisProfileOpen] = useState(false)
const {name ,avatar} = user;
const ProfileRef = useRef(null)
const imageRef = useRef(null)
  //const {user} = useSelector((state)=>state.auth)
  // const name = chatName.split("-")[0]

  window.addEventListener("click",(e)=>{
    if(e.target !== ProfileRef.current && e.target !==imageRef.current ){
      setisProfileOpen(false)
    }
  })
  const handleClick=(e)=>{
    setisProfileOpen((prev)=>!prev)
  }


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const {userTyping }= useSelector((state)=>state.misc)
  return (<>
    <header className='bg-slate-200 h-16 flex items-center pl-6 gap-5'>
        <div class="avatar">
        <div class=" w-10 rounded-full ">
          <img ref={imageRef} onClick={handleClick} 
            className="cursor-pointer rounded-full h-10 w-10" src={avatar?.url || userAvatar} />
        </div>
        </div>

        <div className='flex-col justify-center'>
            <div>{name}</div>
            <div className='text-xs text-orange-500'>{userTyping ? "Typing...":""}</div>
        </div>

    </header>
          { isProfileOpen && 
          
            <div ref={ProfileRef}  className='flex gap-5  flex-col justify-center items-center h-fit py-4 min-h-[10rem]  min-w-[20rem] bg-slate-100 transition-all duration-300 ease-in-out translate-y-16 mt-2 ml-2 absolute'  >
              <div class="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-2">
                <img   onClick={openModal} 
                  className="cursor-pointer rounded-full h-20 w-20" src={ userAvatar } />
              </div>
              <div className='font-bold text-2xl text-gray-600'>{name}</div>
              <div> joined </div>
              </div>
           }

          {isModalOpen && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeModal}
                  >
                    <div className="relative">
                      <img 
                        src={userAvatar} 
                        alt={"Profiel Image"} 
                        className="max-w-full max-h-full border-4 border-white rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button 
                        onClick={closeModal} 
                        className="absolute top-2 right-2 text-white text-3xl focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}
            
</> )
}

export default Header
