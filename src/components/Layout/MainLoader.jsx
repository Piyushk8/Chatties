import React from 'react'
import ChatLoaders from './Loaders'

const MainLoader = () => {
  return (
    <div className='relative h-screen w-screen'>
    {/* header */}
        <div className='header flex justify-center items-center w-full bg-[#ffff] shadow-sm h-[4.3rem] md:h-[6.3rem]'>
            <div className='bg-slate-100  h-[60%] w-[95%] flex justify-between'>
                <div className='bg-slate-300 h-full w-20 p-4 flex justify-center items-center animate-pulse'></div>
                <div className=' h-full w-20 p-4 flex justify-center items-center animate-pulse'></div>
            </div>
        </div>
        
        {/* togglechatlist */}
        <div className='md:hidden flex pl-4 h-[2rem] w-full animate-bounce '>
            {/* <button ref={toggleButtonRef} onClick={()=>dispatch(setIsChatList())}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
             </button> */}
             
            </div>
    {/* MainArea */}
        <div className=' w-full h-[calc(100vh-6.4rem)]' >
        <div className=' h-[100%] max-w-full pb-0 m-0 grid grid-cols-12  ' >
        
      
        <div className="shadow-2xl hidden  md:col-span-4 md:flex flex-col">
            {/* Search and Buttons */}
                <div className=" w-full h-26 ">
                    <div className=" px-4 pt-2 py-2 border-gray-100 border-b-2 ">
                    
                    </div>
                    <div className="overflow-x-scroll mb-2 mt-2 bg-white scrollbar-none flex flex-row items-center justify-start gap-4 pl-5 ">
                        <div className="px-2 h-5 w-14 bg-gray-100 rounded-full dark:bg-gray-300 animate-pulse transition duration-150 ease-in-out">
                        </div>
                        <div className="px-2 h-5 w-14 bg-gray-100 rounded-full dark:bg-gray-300 animate-pulse transition duration-150 ease-in-out">
                        </div>
                        <div className="px-2 h-5 w-14 bg-gray-100 rounded-full dark:bg-gray-300 animate-pulse transition duration-150 ease-in-out">
                        </div>
                        <div className="px-2 h-5 w-14 bg-gray-100 rounded-full dark:bg-gray-300 animate-pulse transition duration-150 ease-in-out">
                        </div>
                       
                    </div>
                </div>
                {/* Scrollable ChatList */}
             <ChatLoaders/>
            </div>
        
        
          {/* Right Side - Chat Page */}
        <div className="ml-0.5 col-span-12 md:col-span-8 flex justify-between flex-col h-[calc(100vh-6.5rem)] ">
            <header className='bg-gray-100 dark:bg-gray-200 h-[3.7rem] px-3 py-6 flex justify-between items-center pl-2 border-t-[1px] gap-5'>
                <div className='flex items-center gap-3'>
                    <div class="h-10 bg-gray-300 dark:bg-gray-400 animate-pulse  w-10 rounded-full ">
                    </div>
                </div>
            </header>
            <div className=' self-center justify-between items-end flex gap-2'>
                 <div className='h-12 w-6 rounded-sm bg-gray-100 delay-1000 animate-pulse'></div>
                 <div className='h-14 w-6 rounded-sm bg-gray-200 delay-1000 animate-pulse'></div>
                 <div className='h-16 w-6 rounded-sm bg-gray-300 delay-1000 animate-pulse'></div>
            </div>
            <div className='h-14 w-full flex justify-center p-2 items-center bg-gray-100 animate-pulse dark:bg-gray-300'>
                <div className='h-[60%] w-full  bg-gray-100'>

                </div>
            </div>
        </div>
        
        
            </div>

        </div>
       </div>
  )
}

export default MainLoader