import React from 'react'

const ChatLoaders = () => {
  return (
    
<div role="status" class="max-w-md p-4 space-y-4 border divide-y  rounded shadow animate-pulse  md:p-6 ">
    <div class="flex items-center h-32 justify-between">
        <div>
            <div className='flex'>
            <div class="h-10 bg-gray-100 rounded-full dark:bg-gray-300 w-10 mb-2.5"></div>
            <div class="h-2.5 ml-3 w-20 bg-gray-300 rounded-md dark:bg-gray-300 "></div>
            
            </div>
            <div class="w-40 h-4 bg-gray-200 rounded-full dark:bg-gray-300"></div>
        </div>
    </div>
    <div class="flex items-center h-32 justify-between">
        <div>
            <div className='flex'>
            <div class="h-10 bg-gray-100 rounded-full dark:bg-gray-300 w-10 mb-2.5"></div>
            <div class="h-2.5 ml-3 w-20 bg-gray-300 rounded-md dark:bg-gray-300 "></div>
            
            </div>
            <div class="w-40 h-4 bg-gray-200 rounded-full dark:bg-gray-300"></div>
        </div>
    </div>
    <div class="flex items-center h-32 justify-between">
        <div>
            <div className='flex'>
            <div class="h-10 bg-gray-100 rounded-full dark:bg-gray-300 w-10 mb-2.5"></div>
            <div class="h-2.5 ml-3 w-20 bg-gray-300 rounded-md dark:bg-gray-300 "></div>
            
            </div>
            <div class="w-40 h-4 bg-gray-200 rounded-full dark:bg-gray-300"></div>
        </div>
    </div>
    <span class="sr-only">Loading...</span>
</div>

  )
}

export default ChatLoaders