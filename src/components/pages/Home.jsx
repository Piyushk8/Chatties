import React from 'react'
import appLayout from '../Layout/appLayout'

function Home(){
  return (
    
    <div className='h-full flex justify-center items-center w-full shadow-'>
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
