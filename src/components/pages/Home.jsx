import React from 'react'
import appLayout from '../Layout/appLayout'
import { userNotExists } from '../../redux/reducers/auth'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { server } from '../../constant/config'
import toast from 'react-hot-toast'

function Home(){
  const dispatch = useDispatch()
  const handleLogout=async()=>{
    
    try{const res =  await axios.delete (`${server}/api/v1/user/logout`,{withCredentials:true})
    if(res.data.success==true) {
      dispatch(userNotExists())
      toast.success(res?.data?.message) }  
  }catch(err){
      console.log(err)
    }
  }
  return (
    
    <div className='h-full flex relative justify-center items-center w-full shadow-'>
       <div onClick={handleLogout}  className='absolute top-2 right-4 cursor-pointer pr-2'>
          <span class="material-symbols-outlined">
          logout
          </span> 
          <div className=' text-[9px] text-gray-500'>logout</div>
          </div>
        <div className='h-[60%] flex flex-col items-start pl-8 w-[70%] '> 
          <span className='text-center mt-6 text-2xl font-bold text-gray-400'>
            Real Time Chat App Crafted using
           </span>
          <span className='text-center mt-6 text-lg font-bold text-gray-400'>
           - Socket.io  React NodeJs 
           </span>
          <span className='text-center mt-6 text-lg font-bold text-gray-400'>
           - Drizzle Postgress
           </span>
          <span className='text-center mt-6 text-2xl font-bold text-[#EF6129]'>
          Select a user From list or search to start a Chat
           </span>
        </div>
    

    </div>
  )
}

export default appLayout()(Home);
