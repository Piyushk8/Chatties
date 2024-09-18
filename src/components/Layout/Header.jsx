import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userAvatar from "../../assets/userAvatar.jpg"
import axios from 'axios'
import { server } from '../../constant/config'
import toast from 'react-hot-toast'
import { userNotExists } from '../../redux/reducers/auth'
const Header = ({user}) => {
const [isProfileOpen, setisProfileOpen] = useState(false)

const ProfileRef = useRef(null)
const imageRef = useRef(null)
const dispatch = useDispatch()
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

  const handleLogout=async()=>{
    
    try{const res =  await axios.delete(`${server}/api/v1/user/logout`,{withCredentials:true})
    if(res.data.success==true) {
      dispatch(userNotExists())
      toast.success(res?.data?.message) }  
  }catch(err){
      console.log(err)
    }
  }
  const {userTyping }= useSelector((state)=>state.misc)
  return (<>
    <header className='bg-[#F6F6F6] h-[3.7rem] px-3 py-6 flex justify-between items-center pl-2 border-t-[1px] gap-5'>
        <div className='flex items-center gap-3'>
          <div class="avatar">
          <div class=" w-10 rounded-full ">
            <img ref={imageRef} onClick={handleClick} 
              className="cursor-pointer rounded-full h-10 w-10" src={user?.avatar?.url || userAvatar} />
          </div>
          </div>

          <div className='ml-4 self-start flex-col justify-center'>
              <div className='text-base font-semibold'>{user?.name}</div>
              <div className='text-sm font-medium  text-[#B0B0B0]'>{userTyping ? "Typing...":""}</div>
          </div>
        </div>
          <div onClick={handleLogout}  className='cursor-pointer pr-2'>
          <span class="material-symbols-outlined">
          logout
          </span> 
          <div className=' text-[9px] text-gray-500'>logout</div>
          </div>
          </header>

          { isProfileOpen && 
          
            <div ref={ProfileRef}  className='flex gap-5  flex-col justify-center items-center h-fit py-4 min-h-[10rem]  min-w-[20rem] bg-slate-100 transition-all duration-300 ease-in-out translate-y-16 mt-2 ml-2 absolute'  >
              <div class="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-2">
                <img   onClick={openModal} 
                  className="cursor-pointer rounded-full h-20 w-20" src={ userAvatar } />
              </div>
              <div className='font-bold text-2xl text-gray-600'>{name}</div>
              <div> profile </div>
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
                  </div>)
          }
            
</> )
}

export default Header
